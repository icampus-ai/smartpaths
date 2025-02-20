import re
import json
from ai_model.model.grading_system.get_llama_response_from_groq import get_llama_response_from_groq

def grader(model_answer, student_answer, rubric):
    total_score = 0
    category_breakdown = []
    
    # Construct the rubric string
    rubric_str = "\n".join([
        f"{category.capitalize()} ({details['marks']} marks): {details['description']}" 
        for category, details in rubric['rubric'].items()
    ])

    # Construct the grading prompt
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

    # Get Llama response
    response = get_llama_response_from_groq(prompt)

    # Debugging: Print Llama response
    print("\n--- Llama Response ---")
    print(response)

    # **Parsing Logic**
    try:
        category_blocks = re.findall(
            r"\*\*(.*?)\*\*\n\* Score: (\d+)/(\d+)\n\* Justification: (.*?)\n\* Feedback: (.*?)\n", 
            response, re.DOTALL
        )

        overall_justifications = []
        overall_feedbacks = []

        for block in category_blocks:
            category_name, score, max_marks, justif, feedbk = block

            category_name = category_name.split(" (")[0].strip().lower().replace(" ", "_")
            score = int(score)
            max_marks = int(max_marks)

            category_breakdown.append({
                "rubric_category": category_name,
                "score_assigned": score,
                "max_marks": max_marks,
                "justification": justif.strip(),
                "feedback": feedbk.strip()
            })

            total_score += score
            overall_justifications.append(justif.strip())
            overall_feedbacks.append(feedbk.strip())

        # **Summarize Justifications & Feedback**
        summary_prompt = f"""
        Given the following individual justifications for grading, generate a concise summary:

        Justifications:
        {" ".join(overall_justifications)}

        Feedback:
        {" ".join(overall_feedbacks)}

        Provide a structured response:

        **Overall Justification**
        [Summarized justification]

        **Overall Feedback**
        [Summarized feedback]
        """

        summary_response = get_llama_response_from_groq(summary_prompt)

        # Extract the overall justification and feedback from the summary response
        overall_match = re.search(
            r"\*\*Overall Justification\*\*\n(.*?)\n\*\*Overall Feedback\*\*\n(.*)", 
            summary_response, re.DOTALL
        )

        if overall_match:
            overall_justification_text = overall_match.group(1).strip()
            overall_feedback_text = overall_match.group(2).strip()
        else:
            overall_justification_text = "Summary generation failed."
            overall_feedback_text = "Summary generation failed."

    except Exception as e:
        print(f"Error while parsing: {e}")
        return None

    return {
        "score_achieved": total_score,
        "maximum_score": rubric["marks"],
        "justification": overall_justification_text,
        "feedback": overall_feedback_text,
        "category_breakdown": category_breakdown
    }


def grade_student_answers_v3(model_answer: str, student_answer: str, rubric:dict, difficulty_level: str = "medium", maximum_score: float = 10) -> dict:

    response = grader(model_answer, student_answer, rubric)
    return response

# Example Usage
rubric = {
    "question_number": 3,
    "question": "Discuss the impact of the Industrial Revolution on society.",
    "marks": 15,
    "bloom_taxonomy": "Analysis",
    "rubric": {
        "understanding": {"marks": 4, "description": "Explain the Industrial Revolution and its impact."},
        "application": {"marks": 2, "description": "Provide real-world examples of the Industrial Revolution."},
        "analysis": {"marks": 4, "description": "Analyze causes and effects of the Industrial Revolution."},
        "synthesis": {"marks": 2, "description": "Synthesize the broader implications on society."},
        "clarity_and_organization": {"marks": 3, "description": "Ensure clarity and logical structure of the response."}
    }
}

# model_answer = "The Industrial Revolution led to urbanization, factories, and changes in social structures."
# student_answer = "The Industrial Revolution created factories and made people move to cities."

# result = grade_student_answers_v3(model_answer, student_answer, rubric)

# # Display the result
# print(json.dumps(result, indent=4))
