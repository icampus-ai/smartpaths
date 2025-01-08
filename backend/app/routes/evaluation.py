from flask import Blueprint, jsonify, request
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from backend.app.services.evaluation_service import evaluate_student_answers


evaluation_bp = Blueprint('evaluation', __name__)

@evaluation_bp.route('/api/evaluate', methods=['POST'])
def evaluation():

    if not all(key in request.files for key in ('modelQuestionAnswer', 'studentAnswers')):
        return jsonify({"error": "Both files are required"}), 400

    model_question_answer = request.files['modelQuestionAnswer']
    student_answers = request.files.getlist('studentAnswers')
    difficulty_level = request.form.get('difficultyLevel', 'Medium')

    
    answer_evaluated_report = evaluate_student_answers(model_question_answer, student_answers, model_question_answer.content_type)

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": answer_evaluated_report
    }), 200