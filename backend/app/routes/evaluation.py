from flask import Blueprint, jsonify, request, redirect, url_for, session
import sys
import os
import re
from io import BytesIO
import base64

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from ai_model.model.evaluator import grade_paper
from ai_model.model.grading_system.grader import grade_student_answers

evaluation_bp = Blueprint('evaluation', __name__)


def extract_model_data(file_content):
    """
    Extracts questions and answers from the model Q&A file content.
    """
    model_data = {}
    # Regex to extract question number, question text, and answer
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    matches = re.findall(question_pattern, file_content, re.DOTALL)

    for question_number, question_text, answer_text in matches:
        model_data[question_number.strip()] = answer_text.strip()
    return model_data

def extract_student_data(text: str):
    student_data = {}
    
    # Extract student details (Exam ID, Name, Email, Student ID)
    student_data['exam_id'] = re.search(r"Exam ID\s*-\s*(.*)", text).group(1).strip()
    student_data['name'] = re.search(r"Student Name:\s*(.*)", text).group(1).strip()
    student_data['email'] = re.search(r"Email:\s*(.*)", text).group(1).strip()
    student_data['student_id'] = re.search(r"Student ID:\s*(.*)", text).group(1).strip()

    # Extract questions and answers
    answers = {}
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    matches = re.findall(question_pattern, text, re.DOTALL)

    for question_number, question_text, answer_text in matches:
        answers[question_number] = answer_text.strip()
    student_data['answers'] = answers
    return student_data

# Helper function to append grading results to student answers
def append_grading_results(student_data, grading_results):
    updated_text = f"Exam ID - {student_data['exam_id']}\n"
    updated_text += f"Student Name: {student_data['name']}\n"
    updated_text += f"Email: {student_data['email']}\n"
    updated_text += f"Student ID: {student_data['student_id']}\n"

    # Add each question and the feedback
    for question_number, answer in student_data['answers'].items():
        updated_text += f"\n{question_number}. {answer}\n"
        grading_result = grading_results.get(question_number, {})
        updated_text += f"Score: {grading_result.get('score', 0)}/10\n"
        updated_text += f"Feedback: {grading_result.get('feedback', 'No feedback provided')}\n"

    return updated_text

@evaluation_bp.route('/api/evaluate', methods=['POST'])
def evaluation():

    print("Inside evaluation")

    if not all(key in request.files for key in ('modelQuestionAnswer', 'studentAnswers')):
        return jsonify({"error": "Both files are required"}), 400

    model_question_answer = request.files['modelQuestionAnswer']
    student_answers = request.files.getlist('studentAnswers')
    difficulty_level = request.form.get('difficultyLevel', 'Medium')

    if model_question_answer.content_type not in ['application/pdf', 'text/plain']:
        return jsonify({"error": "Model question answer file must be a PDF or TXT"}), 400
    
    invalid_files = [file.filename for file in student_answers if file.content_type not in ['application/pdf', 'text/plain']]
    if invalid_files:
        return jsonify({"error": f"The following student answer files must be a PDF or TXT: {', '.join(invalid_files)}"}), 400
    
    
    model_content = model_question_answer.read()
    model_answer = model_content.decode("utf-8")  # Assuming text content in the file
    model_answers = extract_model_data(model_answer)
    # Extract answers from the model file
    grading_criteria = {
        "Content Relevance and Accuracy": {
            "max_score": 10,
            "llm_prompt": "Evaluate the content for relevance and accuracy, ensuring all key concepts from the model answer are included. Penalty applies for missing essential elements.",
            "penalty_for_missing": 2
        },
        "Depth of Understanding": {
            "max_score": 10,
            "llm_prompt": "Assess the depth of understanding in the student's response. Does the answer show a comprehensive understanding of the topic? Apply penalty for missing critical explanations.",
            "penalty_for_missing": 3
        }
    }
    results = []
    for student_answer in student_answers:
        file_name = student_answer.filename
        student_content = student_answer.read()
        student_answer = student_content.decode("utf-8") 
        student_data = extract_student_data(student_answer)
        grading_results = {}

   # Grade each answer
        for question_number, student_answer_text in student_data['answers'].items():
            # For now, use the model_answer directly for grading
            print("model_answer", model_answers.get(question_number))
            print("student", student_answer_text)
            result = grade_student_answers(model_answers.get(question_number), student_answer_text, grading_criteria)
            grading_results[question_number] = result
            print("grading_results", grading_results)
        # Append the grading results to the student's answer
        updated_student_answer = append_grading_results(student_data, grading_results)
        print("updated_student_answer successfully")

        # Encode the modified student answer as base64 to include it in the JSON response
        file_like_object = BytesIO(updated_student_answer.encode("utf-8"))
        print("file_like_object successfully")
        student_answer_grading_files = base64.b64encode(file_like_object.getvalue()).decode('utf-8')
        print("student_answer_grading_files successfully")
        results.append({
            "student_file": file_name,
            "file": student_answer_grading_files
        })

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": results
    }), 200