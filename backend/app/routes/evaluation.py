from flask import Blueprint, jsonify, request
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from backend.app.services.evaluation_service import evaluate_student_answers, generate_rubrics_from_model_question_answer, evaluate_student_answers_v2


evaluation_bp = Blueprint('evaluation', __name__)

@evaluation_bp.route('/api/evaluate', methods=['POST'])
def evaluation():

    if not all(key in request.files for key in ('modelQuestionAnswer', 'studentAnswers')):
        return jsonify({"error": "Both files are required"}), 400

    model_question_answer = request.files['modelQuestionAnswer']
    model_question_paper = request.files['modelQuestion']
    student_answers = request.files.getlist('studentAnswers')
    difficulty_level = request.form.get('difficultyLevel', 'Medium')

    valid_content_types = [
        'application/pdf', 
        'text/plain', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ]

    if model_question_paper.content_type not in valid_content_types:   
        return jsonify({"error": "Model question paper file must be a PDF, TXT, DOCX, JPEG, or PNG"}), 400

    if model_question_answer.content_type not in valid_content_types:   
        return jsonify({"error": "Model question answer file must be a PDF, TXT, DOCX, JPEG, or PNG"}), 400

    invalid_files = [file.filename for file in student_answers if file.content_type not in valid_content_types]
    if invalid_files:
        return jsonify({"error": f"The following student answer files must be a PDF, TXT, DOCX, JPEG, or PNG: {', '.join(invalid_files)}"}), 400

    answer_evaluated_report = evaluate_student_answers(model_question_paper, model_question_answer, student_answers, difficulty_level, model_question_paper.content_type)

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": answer_evaluated_report
    }), 200
    

@evaluation_bp.route('/api/generate_rubrics', methods=['POST'])
def generate_rubrics_controller():
    print("Inside generate_rubrics")
    print(f"request.files : {request.files}")
    model_question_answer = request.files.get('model_question_answer')
    if not model_question_answer:
        return jsonify({"error": "Model question answer file is required"}), 400

    valid_content_types = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ]

    if model_question_answer.content_type not in valid_content_types:
        return jsonify({"error": "Model question answer file must be a PDF, TXT, DOCX, JPEG, or PNG"}), 400

    rubrics = generate_rubrics_from_model_question_answer(model_question_answer)

    print(f"rubrics : {rubrics}")

    return jsonify({
        "message": "Rubrics generated successfully",
        "rubrics": rubrics
    }), 200
    
    
@evaluation_bp.route('/api/v2/evaluate', methods=['POST'])
def evaluationv2():
    if not all(key in request.files for key in ('modelQuestionAnswer', 'studentAnswers')) not in request.form:
        return jsonify({"error": "Model question answer, and student answers are required"}), 400

    rubrics = request.form.get('rubrics')
    model_question_answer = request.files['modelQuestionAnswer']
    student_answers = request.files.getlist('studentAnswers')
    difficulty_level = request.form.get('difficultyLevel', 'Medium')

    valid_content_types = [
        'application/pdf', 
        'text/plain', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ]

    if model_question_answer.content_type not in valid_content_types:   
        return jsonify({"error": "Model question answer file must be a PDF, TXT, DOCX, JPEG, or PNG"}), 400

    invalid_files = [file.filename for file in student_answers if file.content_type not in valid_content_types]
    if invalid_files:
        return jsonify({"error": f"The following student answer files must be a PDF, TXT, DOCX, JPEG, or PNG: {', '.join(invalid_files)}"}), 400

    answer_evaluated_report = evaluate_student_answers_v2(model_question_answer, student_answers, difficulty_level, model_question_answer.content_type, rubrics)

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": answer_evaluated_report
    }), 200