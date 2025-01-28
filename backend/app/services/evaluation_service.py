import base64
import easyocr
import pytesseract
from pdf2image import convert_from_path
from docx import Document
import os
from ai_model.model.grading_system.grader import grade_student_answers_v2
from ai_model.model.grading_system.rubrics import generate_rubrics
from ai_model.model.grading_system.get_overall_feedback import get_overall_feedback
from ai_model.model.grading_system.extract_text_from_image import extract_text
from backend.app.utils.file_type import (
    extract_pdf_text, 
    extract_docx_text, 
    save_as_docx, 
    save_as_pdf, 
    save_as_text, 
    extract_model_data, 
    extract_student_data, 
    append_grading_results,
    generate_summary
)

def extract_text_from_handwritten_image(image):
    """Extract text from a handwritten document image."""
    print("Extracting text from handwritten image...")
    text = pytesseract.image_to_string(image)
    return text

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file containing handwritten text."""
    images = convert_from_path(pdf_path)
    text = ""
    for image in images:
        text += extract_text_from_handwritten_image(image) + "\n"
    return text

def extract_text_from_docx(docx_path):
    """Extract text from a DOCX file containing handwritten text."""
    doc = Document(docx_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

def read_file_content(file, file_type):
    """Read file content based on its type."""
    if file_type == 'application/pdf':
        return extract_pdf_text(file.read())
    elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return extract_docx_text(file.read())
    return file.read().decode("utf-8")

def process_model_files(model_question_paper, model_question_answer_file, file_type):
    """Process model question paper and answer files."""
    model_question_paper_text = read_file_content(model_question_paper, file_type)
    model_content = read_file_content(model_question_answer_file, file_type)
    model_answers = extract_model_data(model_content)
    return model_question_paper_text, model_answers

def process_student_answers(student_answer_file, file_type, model_answers, generated_rubrics, difficulty_level):
    """Process a single student's answers and return grading results."""
    file_name = student_answer_file.filename
    print(f"File name.............: {file_name}")
    student_content = extract_text(student_answer_file)
    print(f"Student content........: {student_content}")
    student_extracted_answers = extract_student_data(student_content)

    grading_results = {}
    for question_number, qa in student_extracted_answers['questionAndAnswers'].items():
        student_evaluated_outcome = grade_student_answers_v2(
            model_answers.get(question_number),
            qa['answer'],
            difficulty_level,
            generated_rubrics['question_results'][question_number]['max_score']
        )
        grading_results[question_number] = student_evaluated_outcome

    updated_student_content, total_score, feedbacks = append_grading_results(student_content, grading_results)

    # Generate overall summary
    summary = generate_summary(total_score, generated_rubrics['model_total_score'], get_overall_feedback(feedbacks))
    
    # Combine the grading results with the summary
    updated_student_content += "\n" + summary

    return file_name, updated_student_content

def save_graded_file(updated_content, file_name, file_type):
    """Save graded content to the appropriate file format."""
    print(f"File type: {file_type}")
    print(f"File name: {file_name}")
    print(f"Updated content: {updated_content}")
    if file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        save_as_docx(updated_content, f"{file_name}_graded.docx")
    elif file_type == 'application/pdf' or file_type == 'image/jpeg' or file_type == 'image/png':
        save_as_pdf(updated_content, f"{file_name}_graded.pdf")
    elif file_type == 'application/pdf':
        text_content = extract_text_from_pdf(file_name)
        save_as_text(text_content, f"{file_name}_graded.txt")
    elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        text_content = extract_text_from_docx(file_name)
        save_as_text(text_content, f"{file_name}_graded.txt")
    else:
        save_as_text(updated_content, f"{file_name}_graded.txt")

def evaluate_student_answers(model_question_paper, model_question_answer_file, student_answer_files, difficulty_level, file_type='application/pdf'):
    """Evaluate student answers against model answers and rubrics."""
    # Process model files
    print("Processing student files...", student_answer_files)
    model_question_paper_text, model_answers = process_model_files(model_question_paper, model_question_answer_file, file_type)
    
    # Generate rubrics from the model question paper
    print("Generating rubrics in backend...")  
    generated_rubrics = generate_rubrics(model_question_paper_text)
    print(f"Generated rubrics: {generated_rubrics}")
    answer_evaluated_report = []

    for student_answer_file in student_answer_files:
        # Process student answers
        file_name, updated_student_content = process_student_answers(
            student_answer_file, file_type, model_answers, generated_rubrics, difficulty_level
        )
        # Save graded file
        save_graded_file(updated_student_content, file_name, file_type)

        # Encode graded content for report
        encoded_content = base64.b64encode(updated_student_content.encode("utf-8")).decode("utf-8")
        answer_evaluated_report.append({
            "student_file": file_name,
            "file": encoded_content
        })

    return answer_evaluated_report
