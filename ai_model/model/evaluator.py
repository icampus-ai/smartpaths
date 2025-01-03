import time
import os
import sys
import logging

from tempfile import NamedTemporaryFile

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from llama_integration import get_llama_response

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def read_file(file):
    
        # with open(file_path, 'r', encoding='utf-8') as file:
    return file.read()
    # except FileNotFoundError as e:
    #     logging.error(f"File not found: {file_path}")
    #     raise e
    # except IOError as e:
    #     logging.error(f"Error reading file: {file_path}")
    #     raise e

def get_evaluation_report(model_answers_text, student_answers_text):
    prompt = """
You are a fair and consistent AI grader. Your task is to evaluate a student's answer based on a provided model answer. Your feedback should be structured, objective, and consistent across evaluations. Focus on the following aspects of the student's answer compared to the model answer:

**Evaluation Report Format:**

1. **Score:**  
   Assign a score out of 10 based on the student's accuracy, completeness, clarity, and overall understanding in comparison to the model answer.

2. **Strengths:**  
   Identify specific aspects of the student's answer that are correct, well-organized, or insightful. Highlight what was done well in the student's response.

3. **Weaknesses:**  
   Point out areas where the student's answer could be improved. Mention missing key concepts, incorrect information, or lack of clarity.

4. **Suggestions for Improvement:**  
   Provide clear, actionable suggestions on how the student can improve their answer. Focus on providing recommendations for making the response more complete, accurate, and clear.

**Model Answer:** {model_answer_text}  
**Student Answer:** {student_answer_text}
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

def grade_paper(model_answer_path, student_answer_path, difficulty_level):
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
