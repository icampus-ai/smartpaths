import base64
from ai_model.model.grading_system.grader import grade_student_answers_v2
from ai_model.model.grading_system.rubrics import generate_rubrics
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
    student_content = read_file_content(student_answer_file, file_type)
    student_extracted_answers = extract_student_data(student_content)

    grading_results = {}
    for question_number, qa in student_extracted_answers['questionAndAnswers'].items():
        print(f"Grading answer for question {question_number}...")
        print(f"Model answer: {model_answers.get(question_number)}")
        print(f"Student answer: {qa['answer']}")
        print(f"Rubrics.. period: {generated_rubrics.get(question_number, {})}")
        print(f"Max Score: {generated_rubrics['question_results'][question_number]['max_score']}")
        student_evaluated_outcome = grade_student_answers_v2(
            model_answers.get(question_number),
            qa['answer'],
            difficulty_level,
            generated_rubrics['question_results'][question_number]['max_score']
        )
        grading_results[question_number] = student_evaluated_outcome

    updated_student_content, total_score, feedbacks = append_grading_results(student_content, grading_results)
    
      # Generate overall summary
    summary = generate_summary(total_score, generated_rubrics['model_total_score'])
    
    # Combine the grading results with the summary
    updated_student_content += "\n" + summary

    return file_name, updated_student_content

def save_graded_file(updated_content, file_name, file_type):
    """Save graded content to the appropriate file format."""
    if file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        save_as_docx(updated_content, f"{file_name}_graded.docx")
    elif file_type == 'application/pdf':
        save_as_pdf(updated_content, f"{file_name}_graded.pdf")
    else:
        save_as_text(updated_content, f"{file_name}_graded.txt")

def evaluate_student_answers(model_question_paper, model_question_answer_file, student_answer_files, difficulty_level, file_type='application/pdf'):
    """Evaluate student answers against model answers and rubrics."""
    # Process model files
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
