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
    model_question_paper = request.files['modelQuestion']
    student_answers = request.files.getlist('studentAnswers')
    difficulty_level = request.form.get('difficultyLevel', 'Medium')
    
    if model_question_paper.content_type not in ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:   
        return jsonify({"error": "Model question paper file must be a PDF or TXT or DOCX"}), 400

    if model_question_answer.content_type not in ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:   
        return jsonify({"error": "Model question answer file must be a PDF or TXT or DOCX"}), 400
    
    invalid_files = [file.filename for file in student_answers if file.content_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']]
    if invalid_files:
        return jsonify({"error": f"The following student answer files must be a PDF or TXT oe DOCX: {', '.join(invalid_files)}"}), 400
    
    answer_evaluated_report = evaluate_student_answers(model_question_paper, model_question_answer, student_answers, difficulty_level)

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": answer_evaluated_report
    }), 200
    
    
    