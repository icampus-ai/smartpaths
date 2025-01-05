
import base64
from io import BytesIO
import re
from ai_model.model.grading_system.grader import grade_student_answers

def evaluate_student_answers(model_question_answer, student_answers, file_type = 'text/plain'):
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
    answer_evaluated_report = []
    for student_answer in student_answers:
        file_name = student_answer.filename
        student_content = student_answer.read()
        student_answer = student_content.decode("utf-8") 
        student_data = extract_student_data(student_answer)
        grading_results = {}

   # Grade each answer
        for question_number, student_answer_text in student_data['questionAndAnswers'].items():
            # For now, use the model_answer directly for grading
            print("model_answer", model_answers.get(question_number))
            print("student", student_answer_text['answer'])
            result = grade_student_answers(model_answers.get(question_number), student_answer_text['answer'], grading_criteria)
            grading_results[question_number] = result
            print("grading_results", grading_results)
        # Append the grading results to the student's answer
        updated_student_answer = append_grading_results(student_data, grading_results)
        
        # Encode the modified student answer as base64 to include it in the JSON response
        file_like_object = BytesIO(updated_student_answer.encode("utf-8"))
        print("file_like_object successfully")
        student_answer_grading_files = base64.b64encode(file_like_object.getvalue()).decode('utf-8')
        print("student_answer_grading_files successfully")
        answer_evaluated_report.append({
            "student_file": file_name,
            "file": student_answer_grading_files
        })
        
    return answer_evaluated_report


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
    questions_and_answers = {}
    question_pattern = r"(\d+)\.\s*(.*?)\nAnswer:(.*?)(?=\n\d+\.|$)"
    matches = re.findall(question_pattern, text, re.DOTALL)

    for question_number, question_text, answer_text in matches:
        questions_and_answers[question_number] = {
            "question": question_text.strip(),
            "answer": answer_text.strip()
        }
    student_data['questionAndAnswers'] = questions_and_answers
    return student_data

# Helper function to append grading results to student answers
def append_grading_results(student_data, grading_results):
    updated_text = f"Exam ID - {student_data['exam_id']}\n"
    updated_text += f"Student Name: {student_data['name']}\n"
    updated_text += f"Email: {student_data['email']}\n"
    updated_text += f"Student ID: {student_data['student_id']}\n"

    # Add each question and the feedback
    for question_number, questionAndAnswer in student_data['questionAndAnswers'].items():
     updated_text += f"\n{question_number}. {questionAndAnswer['question']}\n"
     updated_text += f"Answer: {questionAndAnswer['answer']}\n"
     grading_result = grading_results.get(question_number, {})
     updated_text += f"Total Score: {grading_result.get('total_score', 0)}/20\n"
     updated_text += f"Feedback: {grading_result.get('feedback', 'No feedback provided')}\n"
     updated_text += f"Percentage: {grading_result.get('percentage', 0)}%\n"
     updated_text += f"Overall Strength: {grading_result.get('overall_strengths', 0)}\n"
     updated_text += f"Overall Weekness: {grading_result.get('overall_weaknesses', 0)}\n"
     updated_text += f"Overall Improvement: {grading_result.get('overall_improvement', 0)}\n"
    return updated_text