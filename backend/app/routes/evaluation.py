from flask import Blueprint, jsonify, request, redirect, url_for, session
from flasgger import swag_from
import pdfplumber

from backend.app.utils.student_answer import StudentAnswer

evaluation_bp = Blueprint('evaluation', __name__)

@evaluation_bp.route('/evaluation', methods=['POST'])
def evaluation():

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
    
    evaluated_student_files = []
    for student_answer in student_answers:
        evaluated_student_files.append(grade_student_answer(model_question_answer, student_answer, difficulty_level))

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": evaluated_student_files
    }), 200
