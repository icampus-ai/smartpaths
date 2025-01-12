import re
from llama_utils import get_llama_response

def extract_rubrics_raw(model_question_paper: str) -> str:
    """
    Extracts the raw response (questions and scores) from the model question paper using LLaMA.
    """
    prompt = f"""
    Extract ALL questions and their marks from the following question paper.
    
    Rules:
    1. Include EVERY question that has text and marks.
    2. Keep the EXACT original question text.
    3. Keep the EXACT original marks.
    4. Format each question EXACTLY like this (one per line):
    '
    Question <question number> : <question text> (<x marks>)
    '
    
    Do not add any other text or explanations.
    Do not modify or interpret the questions.
    Do not skip any questions.
    
    Question Paper:
    {model_question_paper}
    """
    raw_response = get_llama_response(prompt)
    
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
    
    question_results = []
    total_max_score = 0
    
    # Adjusted pattern for LLaMA's response format
    # Marks are not followed by the word "marks" and no space between marks and question text
    pattern = r'(\d+)\s*:\s*(.*?)\s*\((\d+)\s*marks?\)'
    
    # Try matching the response, even if there's extra whitespace or line breaks
    matches = re.finditer(pattern, raw_response, re.IGNORECASE | re.MULTILINE | re.DOTALL)

    for match in matches:
        question_number = match.group(1)
        question_text = match.group(2).strip()
        max_score = float(match.group(3))
        
        question_results.append({
            "question_number": question_number,
            "question_text": question_text,
            "max_score": max_score
        })
        
        total_max_score += max_score

    return {
        "question_results": question_results,
        "model_total_score": total_max_score
    }

# # Example test case for generating rubrics from a question paper
# if __name__ == "__main__":
#     example_question_paper = """
# 1: What is artificial intelligence? (5 marks)
# 2: Define the term "neural network" and provide an example. (10 marks)
# 3: Describe the key differences between supervised and unsupervised learning. (15 marks)
# """

#     rubrics = generate_rubrics(example_question_paper.strip())

#     print("Generated Rubrics:")
#     print(rubrics)
