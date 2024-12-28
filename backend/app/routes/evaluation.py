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
    
    invalid_files = [file.filename for file in student_answers if file.content_type not in ['application/pdf', 'text/plain']]
    if invalid_files:
        return jsonify({"error": f"The following student answer files must be a PDF or TXT: {', '.join(invalid_files)}"}), 400
    
    evaluated_student_files = []
    for student_answer in student_answers:

        class StudentAnswer:
            def __init__(self, file_stream):
                self.file_stream = file_stream
                self.student_name = None
                self.questions_answers = {}

            def parse(self):
                question = None
                for line in self.file_stream:
                    line = line.decode('utf-8').strip()
                    if line.startswith('Student Name:'):
                        self.student_name = line.split(':', 1)[1].strip()
                    elif line and line[0].isdigit():
                        question = line
                        self.questions_answers[question] = ""
                    elif question:
                        self.questions_answers[question] += line + " "

        student_answer_obj = StudentAnswer(student_answer.stream)
        student_answer_obj.parse()
        if not student_answer_obj.student_name:
            return jsonify({"error": f"Student name not found in file: {student_answer.filename}"}), 400

        evaluated_student_files.append({
            "student_name": student_answer_obj.student_name,
            "questions_answers": student_answer_obj.questions_answers
        })
        student_name = None
        for line in student_answer.stream:
            line = line.decode('utf-8').strip()
            if line.startswith('Student Name:'):
                student_name = line.split(':', 1)[1].strip()
            break
        if not student_name:
            return jsonify({"error": f"Student name not found in file: {student_answer.filename}"}), 400
        # Assuming grade_papers is a function that grades the papers and returns the result
        evaluated_student_files.append(
            #grade_papers(model_question_answer, student_answer, difficulty_level)
            list(model_question_answer) + [student_answer]
        )

    return jsonify({
        "message": "Student answers are evaluated successfully",
        "difficulty": difficulty_level,
        "files": evaluated_student_files
    }), 200

