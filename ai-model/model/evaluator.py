import time
import os
import logging
from llama_integration import get_llama_response
from tempfile import NamedTemporaryFile

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError as e:
        logging.error(f"File not found: {file_path}")
        raise e
    except IOError as e:
        logging.error(f"Error reading file: {file_path}")
        raise e

def get_evaluation_report(model_answers_text, student_answers_text):
    prompt = f"""
    You are a highly skilled and fair Teaching Assistant (TA) tasked with grading a student's answers based on the model answers and the student's responses. Your goal is to provide an in-depth, constructive, and fair evaluation of the student's work. The evaluation must include the following:

    **Evaluation Process:**

    1. **Compare the Student Answer with the Model Answer:**
    For each question, compare the student's answer with the model answer provided. Assess the student's answer according to the following criteria:
    - **Accuracy:** Is the student’s answer factually correct? Does it cover the necessary points as outlined in the model answer?
    - **Completeness:** Does the student provide a complete response, including all necessary components as outlined in the model answer? If the question is multi-part, has the student answered all parts sufficiently?
    - **Clarity and Organization:** Is the answer clear, logical, and well-organized? Does the student use appropriate language and terminology?

    2. **Detailed Feedback for Each Question:**
    For each question, provide a feedback report with the following:
    - **Score (number of marks student scored out of the total marks for the question):** Assign a score for each question based on how well the student answered it in relation to the model answer.
    - **Strengths:** What parts of the student's answer were correct, well-organized, or insightful?
    - **Weaknesses:** What parts of the student's answer were lacking or incorrect? Were key points missing, or did the answer fail to address critical aspects of the question?
    - **Suggestions for Improvement:** Offer actionable advice on how the student can improve their answer for future questions. Focus on providing suggestions to help improve clarity, completeness, and depth of the response.

    3. **Provide the Final Evaluation Report:**
    The evaluation report should summarize:
    - **Detailed Feedback for Each Question:** Provide feedback on strengths, weaknesses, and specific suggestions for each question.
    - **Overall Feedback Summary:** Optionally, provide a summary of the student's overall performance, highlighting areas of strength and areas for improvement across all questions.

    **Evaluation Report Structure:**
    - **Detailed Feedback for Each Question:** Include feedback for each question, including assigned score, strengths, weaknesses, and improvement suggestions.
    - **General Summary:** If necessary, offer a general summary of the student's performance across all questions, pointing out areas for improvement.

    **Please ensure your evaluation is thorough, fair, and objective, and that the final score correctly reflects the student's performance based on the model answers. Offer specific, actionable feedback for each question to help the student improve.**

    **model_answer_text:** {model_answers_text}
    **student_answer_text:** {student_answers_text}
    """
    
    try:
        start_time = time.time()
        evaluation_report = get_llama_response(prompt)
        elapsed_time = time.time() - start_time
        logging.info(f"Time taken to grade the paper: {elapsed_time:.2f} seconds")
        return evaluation_report
    except Exception as e:
        logging.error("Error during evaluation report generation.")
        raise e

def grade_paper(model_answer_path, student_answer_path):
    try:
        model_answers_text = read_file(model_answer_path)
        student_answers_text = read_file(student_answer_path)
        evaluation_report = get_evaluation_report(model_answers_text, student_answers_text)
        logging.info("Evaluation report has been successfully generated.")
        
        temp_file = NamedTemporaryFile(delete=False, mode='w', encoding='utf-8', suffix='.txt')
        temp_file.write(evaluation_report)
        temp_file.close()
        
        return temp_file.name
    except Exception as e:
        logging.error("Error during paper grading process.")
        raise e

if __name__ == "__main__":
    try:
        evaluation_report_file_path = grade_paper('model_answers.txt', 'student_answers_0.txt')
        logging.info(f"Evaluation report file created: {evaluation_report_file_path}")
    except Exception as e:
        logging.error("Failed to grade paper and generate evaluation report.")
