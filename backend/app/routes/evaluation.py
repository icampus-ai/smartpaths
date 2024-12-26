from flask import Blueprint, jsonify, request, redirect, url_for, session
from flasgger import swag_from

evaluation_bp = Blueprint('evaluation', __name__)

@evaluation_bp.route('/evaluation', methods=['POST'])
@swag_from({
    'parameters': [
        {
            'name': 'modelQuestionAnswer',
            'in': 'formData',
            'type': 'file',
            'required': True,
            'description': 'Model question answer file (PDF or TXT)'
        },
        {
            'name': 'studentAnswers',
            'in': 'formData',
            'type': 'file',
            'required': True,
            'description': 'Student answer files (PDF or TXT)',
            'multiple': True
        },
        {
            'name': 'difficultyLevel',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'Difficulty level (default: Medium)'
        }
    ],
    'responses': {
        200: {
            'description': 'Student answers are evaluated successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'difficulty': {'type': 'string'},
                    'files': {'type': 'array', 'items': {'type': 'string'}}
                }
            }
        },
        400: {
            'description': 'Error message',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def evaluation():
    if 'user' not in session:
        return redirect(url_for('auth.login'))

    if not all(key in request.files for key in ('modelQuestionAnswer', 'studentAnswers')):
        return jsonify({"error": "Both files are required"}), 400

    model_question_answer = request.files['modelQuestionAnswer']
    student_answers = request.files.getlist('studentAnswers')
    difficulty_level = request.form.get('difficultyLevel', 'Medium')

    if model_question_answer.content_type not in ['application/pdf', 'text/plain']:
        return jsonify({"error": "Model question answer file must be a PDF or TXT"}), 400
    
    evaluated_student_files = []
    for student_answer in student_answers:
        if student_answer.content_type not in ['application/pdf', 'text/plain']:
            return jsonify({"error": f"Student answer file {student_answer.filename} must be a PDF or TXT"}), 400
        evaluated_student_files.append(
            #grade_papers(model_question_answer, student_answer, difficulty_level)
            list(model_question_answer) + [student_answer]
        )

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": evaluated_student_files
    }), 200