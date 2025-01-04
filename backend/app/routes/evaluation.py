from flask import Blueprint, jsonify, request, redirect, url_for, session
import sys
import os
import re
from io import BytesIO
import base64

from backend.app.services.evaluation_service import evaluate_student_answers
from backend.app.utils.file_validation import append_grading_results, extract_model_data, extract_student_data

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from ai_model.model.evaluator import grade_paper
from ai_model.model.grading_system.grader import grade_student_answers

evaluation_bp = Blueprint('evaluation', __name__)

@evaluation_bp.route('/api/evaluate', methods=['POST'])
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
    
    answer_evaluated_report = evaluate_student_answers(model_question_answer, student_answers)

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": answer_evaluated_report
    }), 200