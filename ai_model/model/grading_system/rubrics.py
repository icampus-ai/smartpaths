import fitz  # PyMuPDF
import re
from ai_model.model.grading_system.get_llama_response_from_groq import get_llama_response_from_groq
from ai_model.model.grading_system.llama_utils import get_llama_response
# from llama_utils import get_llama_response  # Assuming get_llama_response is in llama_utils.py

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a PDF file using PyMuPDF (fitz).

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        str: Extracted text from the PDF.
    """
    try:
        doc = fitz.open(pdf_path)  # Open the provided PDF file
        text = ""
        # Iterate through each page and extract text
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            text += page.get_text("text")  # Extract plain text
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def test_generate_rubrics_from_pdf(pdf_path: str):
    """
    Test case to extract rubrics from a given PDF file.

    Args:
        pdf_path (str): Path to the PDF file.
    """
    # Step 1: Extract text from the PDF
    question_paper_text = extract_text_from_pdf(pdf_path)

    # Step 2: Generate rubrics from the extracted text
    if question_paper_text:
        rubrics = generate_rubrics(question_paper_text)

        # Print the rubrics and total score
        print("Generated Rubrics:", rubrics)
    else:
        print("No text extracted from PDF.")

def extract_rubrics_raw(model_question_paper: str) -> str:
    """
    Extracts rubrics in raw format from the question paper using the LLaMA model.

    Args:
        model_question_paper (str): The model question paper as a string.

    Returns:
        str: Raw response from the LLaMA model.
    """
    print(f"raw model question paper: {model_question_paper}")

    prompt = f"""
     You are an expert in educational assessment tasked with reading the paper and marks allocated to each question.
     Your goal is to identify all questions possibly present. You should not add any new information that is not in the question paper. 
     For each question, please follow this strict format:
     **Question [number]**: [question text] — [marks] Marks
     
     Here is the model Question Paper: {model_question_paper}
    """
    raw_response = get_llama_response_from_groq(prompt)
    
    # Print raw response from LLaMA
    print("Raw LLaMA Response:")
    print(raw_response)
    
    return raw_response

def generate_rubrics(question_paper: str) -> dict:
    """
    Processes a complete question paper with multiple questions and their marks.
    
    Args:
        question_paper (str): The complete question paper with questions and marks.
    
    Returns:
        dict: Grading information including individual questions and total max score.
    """
    raw_response = extract_rubrics_raw(question_paper)
    response = raw_response.replace('*', '')
    print("Response:", response)
    return extract_questions_and_scores(response)

def extract_questions_and_scores(raw_response):
    """
    Extracts questions and their associated scores from the raw LLaMA response.
    
    Args:
        raw_response (str): Raw response from LLaMA.
    
    Returns:
        dict: A dictionary of questions with their respective scores and the total score.
    """
    # Refined regex pattern to match the question and score details
    pattern = r"Question (\d+): (.*?) — (\d+)\s*Marks?"
    
    # Find all matches using the regex pattern
    matches = re.findall(pattern, raw_response, re.IGNORECASE | re.DOTALL)

    print("Matches:", matches)

    # Initialize result dictionary and total score
    question_results = {}
    total_max_score = 0
    
    # Find all matches and process them
    for match in matches:
        question_number, question_text, max_score = match
        question_text = question_text.strip().replace('\n', ' ')  # Clean up newlines and extra spaces
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


# # Example usage
# if __name__ == "__main__":
#     pdf_path = r"C:\Users\vscsi\Downloads\Model_Wireless_Communication_Q.pdf"  # Provide the path to your PDF file here
#     test_generate_rubrics_from_pdf(pdf_path)
