import base64
from io import BytesIO
import re
from PyPDF2 import PdfReader
from fpdf import FPDF
from ai_model.model.grading_system.grader import grade_student_answers


def evaluate_student_answers(model_question_answer_file, student_answer_files, file_type='text/plain', output_format='text'):
    """
    Evaluates student answers against a model answer file and saves results in the specified format.

    Args:
        model_question_answer_file: A file-like object containing model answers.
        student_answer_files: A list of file-like objects containing student answers.
        file_type: The type of the input files ('text/plain' or 'application/pdf').
        output_format: The format of the output ('text' or 'pdf').

    Returns:
        A list of dictionaries containing evaluated student files in base64 format.
    """
    # Extract model answers
    if file_type == 'application/pdf':
        model_content = extract_pdf_text(model_question_answer_file.read())
    else:
        model_content = model_question_answer_file.read().decode("utf-8")
    model_answers = extract_model_data(model_content)

    grading_criteria = {
        "Content Relevance and Accuracy": {
            "max_score": 10,
            "llm_prompt": "Evaluate the content for relevance and accuracy...",
            "penalty_for_missing": 2
        },
        "Depth of Understanding": {
            "max_score": 10,
            "llm_prompt": "Assess the depth of understanding in the student's response...",
            "penalty_for_missing": 3
        }
    }

    answer_evaluated_report = []

    for student_answer_file in student_answer_files:
        file_name = student_answer_file.filename
        if file_type == 'application/pdf':
            student_content = extract_pdf_text(student_answer_file.read())
        else:
            student_content = student_answer_file.read().decode("utf-8")

        # Extract student metadata and questions/answers
        student_extracted_answers = extract_student_data(student_content)
        grading_results = {}

        # Grade each answer
        for question_number, qa in student_extracted_answers['questionAndAnswers'].items():
            print   (f"Grading answer for question {question_number}...")
            print   (f"Model answer: {model_answers.get(question_number)}")
            print   (f"Student answer: {qa['answer']}")
            result = grade_student_answers(model_answers.get(question_number), qa['answer'], grading_criteria)
            grading_results[question_number] = result

        # Append grading results to the student's original content
        updated_student_content = append_grading_results(student_content, grading_results)
        print   ("Updated student content with grading results:", updated_student_content)
        # Save in the specified format
        if output_format == 'text':
            save_as_text(updated_student_content, f"{file_name}_graded.txt")
        elif output_format == 'pdf':
            save_as_pdf(updated_student_content, f"{file_name}_graded.pdf")

        # Encode the modified student answer for return
        encoded_content = base64.b64encode(updated_student_content.encode("utf-8")).decode('utf-8')
        answer_evaluated_report.append({
            "student_file": file_name,
            "file": encoded_content
        })

    return answer_evaluated_report


def extract_model_data(file_content):
    """
    Extracts questions and answers from the model Q&A file content.
    """
    model_data = {}
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    matches = re.findall(question_pattern, file_content, re.DOTALL)

    for question_number, question_text, answer_text in matches:
        model_data[question_number.strip()] = answer_text.strip()
    return model_data


def extract_student_data(text: str):
    student_data = {}
    questions_and_answers = {}
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    matches = re.findall(question_pattern, text, re.DOTALL)

    for question_number, question_text, answer_text in matches:
        questions_and_answers[question_number] = {
            "question": question_text.strip(),
            "answer": answer_text.strip()
        }
    student_data['questionAndAnswers'] = questions_and_answers
    return student_data


def append_grading_results(student_content, grading_results):
    """
    Appends grading results to the student content after each question and answer.
    """
    updated_text = ""
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    last_pos = 0

    for match in re.finditer(question_pattern, student_content, re.DOTALL):
        question_number, question_text, answer_text = match.groups()
        start, end = match.span()

        # Add original content before the current question
        updated_text += student_content[last_pos:start]
        last_pos = end

        # Append the question, answer, and grading results
        updated_text += f"{question_number}. {question_text}\n"
        updated_text += f"Answer: {answer_text}\n"
        
        # Grading Results for the current question
        grading_result = grading_results.get(question_number, {})
        updated_text += f"Total Score: {grading_result.get('total_score', 0)}/20\n"
        updated_text += f"Feedback: {grading_result.get('feedback', 'No feedback provided')}\n"
        updated_text += f"Percentage: {grading_result.get('percentage', 0)}%\n"
        updated_text += f"Overall Strengths: {grading_result.get('overall_strengths', 'N/A')}\n"
        updated_text += f"Overall Weaknesses: {grading_result.get('overall_weaknesses', 'N/A')}\n"
        updated_text += f"Overall Improvement: {grading_result.get('overall_improvement', 'N/A')}\n"

    # Add any remaining content after the last question
    updated_text += student_content[last_pos:]
    
    print("Updated student content with grading results:", updated_text)
    return updated_text

def extract_pdf_text(pdf_content):
    """
    Extracts text from a PDF file.
    """
    reader = PdfReader(BytesIO(pdf_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def save_as_text(content, file_name):
    """
    Saves content as a plain text file.
    """
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(content)


def save_as_pdf(content, file_name):
    """
    Saves content as a PDF file.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, content)
    pdf.output(file_name)
