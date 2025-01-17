import re
from ai_model.model.grading_system.llama_utils import get_llama_response_1

def extract_rubrics_raw(model_question_paper: str) -> str:

    prompt = f"""
     You are an expert in educational assessment tasked with read the the paper and marks allocated to each question.
   Your goal is to create rubrics for each question in the provided question paper. 
   For each question in the paper, extract marks against each question with:
    1. **Question**: Copy the question text exactly as it appears in the paper.
    2. **Marks**: Strictly Total marks allocated to the question only.
    And here is the model Question Paper: {model_question_paper}
    """
    raw_response = get_llama_response_1(prompt)
    
    # Print raw response from LLaMA
    print("Raw LLaMA Response:")
    print(raw_response)
    
    return raw_response

def generate_rubrics(question_paper: str) -> dict:
    """
    Processes a complete question paper with multiple questions and their marks.
    
    Args:
        question_paper (str): The complete question paper with questions and marks
    
    Returns:
        dict: Grading information including individual questions and total max score
    """
    raw_response = extract_rubrics_raw(question_paper)
    print("Raw Response:", raw_response)
    return extract_questions_and_scores(raw_response)

def extract_questions_and_scores(raw_response):
# Define regex pattern to capture question number, question text, and marks
    pattern = r"(\d+)\.\s*\*\*Question\*\*:\s*(.*?)(?:\s*\n\s*\*\*Marks\*\*:\s*(\d+))"
    matches = re.findall(pattern, raw_response, re.IGNORECASE)

    print("Matches:", matches)
   # Initialize result dictionary and total score
    question_results = {}
    total_max_score = 0
    # Find all matches
    
    for match in matches:
        question_number, question_text, max_score = match
        print(f"Question {question_number}: {question_text} - Max Score: {max_score}")
    
        # Ensure dictionary is correctly updated with closing brace
        question_results[question_number] = {
            "question_text": question_text,
            "max_score": int(max_score)
        }
        # Adding max_score to the total score
        total_max_score += int(max_score)
    
    print("Total Max Score:", total_max_score)
    print("Question Results:", question_results)
    # Return the result dictionary and total score
    return {
        "question_results": question_results,
        "model_total_score": total_max_score
    }
    
    