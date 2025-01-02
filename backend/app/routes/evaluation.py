from flask import Blueprint, jsonify, request, redirect, url_for, session
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from ai_model.model.evaluator import grade_paper

evaluation_bp = Blueprint('evaluation', __name__)

@evaluation_bp.route('/evaluate', methods=['POST'])
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
    
    evaluated_student_files = []
    for student_answer in student_answers:
        evaluated_student_files.append(grade_paper(model_question_answer, student_answer, difficulty_level))

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": evaluated_student_files
    }), 200