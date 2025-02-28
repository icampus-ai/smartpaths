import re
import json
import time
from ai_model.model.grading_system.get_llama_response_from_groq import get_llama_response_from_groq

def extract_categories_from_response(response):
    """
    Extract grading categories from LLM response with a more robust approach.
    Returns a list of dictionaries containing category information.
    """
    # Split the response by category headers
    category_headers = re.findall(r'\*\*([^*]+?)\s*\((\d+)\s*marks?\)\*\*', response)
    if not category_headers:
        print("Warning: No category headers found in response")
        return []
    
    # Split the text by the category headers to get sections
    section_splits = re.split(r'\*\*[^*]+?\s*\(\d+\s*marks?\)\*\*', response)
    
    # The first split is usually empty or contains intro text
    content_sections = section_splits[1:]
    
    categories = []
    for i, (category_name, max_marks_str) in enumerate(category_headers):
        if i < len(content_sections):
            section_content = content_sections[i]
            
            # Extract score
            score_match = re.search(r'\*\s*Score:\s*(\d+)/(\d+)', section_content, re.IGNORECASE)
            score = int(score_match.group(1)) if score_match else 0
            
            # Extract justification
            justif_match = re.search(r'\*\s*Justification:\s*(.*?)(?=\*\s*Feedback|\*\s*[A-Za-z]|\Z)', 
                                    section_content, re.IGNORECASE | re.DOTALL)
            justification = justif_match.group(1).strip() if justif_match else "No justification provided."
            
            # Extract feedback
            feedbk_match = re.search(r'\*\s*Feedback:\s*(.*?)(?=\*\*|\Z)', section_content, re.IGNORECASE | re.DOTALL)
            feedback = feedbk_match.group(1).strip() if feedbk_match else "No specific feedback provided."
            
            # Clean up category name
            clean_category = category_name.strip().lower().replace(" ", "_")
            max_marks = int(max_marks_str)
            
            categories.append({
                "rubric_category": clean_category,
                "score_assigned": score,
                "max_marks": max_marks,
                "justification": justification,
                "feedback": feedback
            })
    
    return categories

def grader(model_answer, student_answer, rubric):
    start_time = time.time()
    
    rubric_str = "\n".join([
        f"{category.capitalize()} ({details['marks']} marks): {details['description']}" 
        for category, details in rubric['rubric'].items() if details['marks'] > 0
    ])
    
    prompt = f"""
    Model Answer: {model_answer}
    Student Answer: {student_answer}
    
    Rubric:
    {rubric_str}
    
    Based on the above, evaluate the student's answer for each rubric category.
    Provide the following format:
    
    **Category Name (X marks)**
    * Score: Y/X
    * Justification: Explanation of score deductions
    * Feedback: Suggestions for improvement
    """
    
    response = get_llama_response_from_groq(prompt)
    print("\n--- Llama Response ---")
    print(response)
    
    try:
        # Use our improved extraction function
        category_breakdown = extract_categories_from_response(response)
        
        # Calculate total score
        total_score = sum(category["score_assigned"] for category in category_breakdown)
        
        # Extract justifications and feedback for summary
        justifications = [category["justification"] for category in category_breakdown 
                         if category["justification"] != "No justification provided."]
        
        feedbacks = [category["feedback"] for category in category_breakdown 
                    if category["feedback"] != "No specific feedback provided."]
        
        # Set default summary texts
        if justifications:
            overall_justification_text = " ".join(justifications)
        else:
            overall_justification_text = "No detailed justification provided."
        
        if feedbacks:
            overall_feedback_text = " ".join(feedbacks)
        else:
            overall_feedback_text = "No specific feedback provided."
        
        # Generate summary with LLM if we have content to summarize
        if justifications and feedbacks:
            summary_prompt = f"""
            Given the following individual justifications for grading, generate a concise summary:
            
            Justifications:
            {" ".join(justifications)}
            
            Feedback:
            {" ".join(feedbacks)}
            
            Provide a structured response:
            
            **Overall Justification**
            [Summarized justification]
            
            **Overall Feedback**
            [Summarized feedback]
            """
            
            summary_response = get_llama_response_from_groq(summary_prompt)
            
            overall_match = re.search(
                r"\*\*Overall Justification\*\*\n(.*?)\n\*\*Overall Feedback\*\*\n(.*)", 
                summary_response, re.DOTALL
            )
            
            if overall_match:
                overall_justification_text = overall_match.group(1).strip()
                overall_feedback_text = overall_match.group(2).strip()
        
    except Exception as e:
        print(f"Error while parsing: {e}")
        print(f"Exception details: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
    
    elapsed_time = time.time() - start_time
    
    # Debug print to verify what we're returning
    print(f"Extracted categories: {len(category_breakdown)}")
    for cat in category_breakdown:
        print(f"- {cat['rubric_category']}: {cat['score_assigned']}/{cat['max_marks']}")
        print(f"  Justification: {cat['justification'][:50]}...")
    
    return {
        "score_achieved": total_score,
        "maximum_score": rubric["marks"],
        "justification": overall_justification_text,
        "feedback": overall_feedback_text,
        "category_breakdown": category_breakdown,
        "time_elapsed": elapsed_time
    }

def get_bucketed_score(total_score: float, max_score: float, difficulty_level: str = "medium") -> float:
    score_percentage = (total_score / max_score) * 100
    
    if difficulty_level == "easy":
        thresholds = [10, 20, 30, 40, 50, 60, 70]
    elif difficulty_level == "medium":
        thresholds = [12.5, 25, 37.5, 50, 62.5, 75, 80]
    else:  # hard
        thresholds = [10, 30, 50, 60, 70, 80, 90]
    
    if score_percentage >= thresholds[-1]:
        return round(max_score * 2) / 2
    
    for i, threshold in enumerate(thresholds):
        if score_percentage <= threshold:
            score = (i + 1) * (max_score / len(thresholds))
            return round(score * 2) / 2
    
    # Default case (if somehow none of the above conditions are met)
    return round(total_score * 2) / 2

def grade_student_answers_v3(model_answer: str, student_answer: str, rubric: dict, difficulty_level: str = "medium") -> dict:
    response = grader(model_answer, student_answer, rubric)
    if response:
        response["score_achieved"] = get_bucketed_score(response["score_achieved"], response["maximum_score"], difficulty_level)
        print(f"Returning this response from grader: {response}")
    return response


# # Example Usage
# if __name__ == "__main__":
#     rubric = {
#         "bloom_taxonomy": "Computation",
#         "marks": 10,
#         "question": "Calculate the path loss at a distance of 500 meters for a signal frequency of 2 GHz in free space.",
#         "question_number": 2,
#         "rubric": {
#             "analysis": {"description": "Analyzes the result of the calculation and explains its significance.", "marks": 3},
#             "application": {"description": "Correctly applies the Free-Space Path Loss formula to calculate the path loss.", "marks": 5},
#             "clarity_and_organization": {"description": "Answer is clear and well-organized, with proper use of mathematical notation.", "marks": 2},
#             "synthesis": {"description": "Not applicable", "marks": 0},
#             "understanding": {"description": "Not applicable", "marks": 0}
#         }
#     }

#     model_answer = "The FSLP formula is dB = 20 log10(d) + 20 log10(f) - 147.55\n\nFSLP(dB) = 20 log10(500) + 20 log10(2) - 147.55\n= 20 2.69897 + 20 9.30103 - 147.55\n= 53.98 + 186.02 - 147.55\n= 92.45 dB"
#     student_answer = "The FSLP formula is dB = 20 log10(d) + 20 log10(f) - 147.55\n\nFSLP(dB) = 20 log10(500) + 20 log10(2) - 147.55\n= 20 2.69897 + 20 9.30103 - 147.55\n= 53.98 + 186.02 - 147.55\n= 92.45 dB'"

#     result = grade_student_answers_v3(model_answer, student_answer, rubric, "hard")
#     print(json.dumps(result, indent=4))