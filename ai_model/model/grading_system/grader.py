from ai_model.model.grading_system.llama_utils import get_llama_response_1, get_llama_response
from ai_model.model.grading_system.get_llama_response_from_groq import get_llama_response_from_groq
import re
import json
import time

def evaluate_answer(model_answer: str, student_answer: str, max_score: float) -> dict:
    """
    Evaluates a student's answer against a model answer with a specific maximum score.
    """
    start_time = time.time()
    prompt = f"""
    You are an empathetic Teaching Assistant grading for a 3rd-grade class. Your grading focuses exclusively on the key concepts mentioned in the model answer, without worrying about specific word choice, phrasing, or grammar. You should grade based strictly on the essential ideas presented in the model answer and do not nit pick.

    Task 1: Identify the very key concepts from the model answer. These are the fundamental concepts that must appear in the student's answer. If its almost same, its fine try to compare the essence.
    Task 2: Review the student's answer and check if it mentions the exact key concepts found in the model answer.
    Task 3: Grade the student's answer only based on the inclusion or exclusion of these key concepts. Do not consider any extra details, phrasing, or advanced vocabulary.
    Task 4: Provide output in the following format:
        Score: x/10
        Justification: Explain the deductions in simple terms, listing what was missing or incorrect and why.
        Feedback: Offer a friendly suggestion for improvement in the student's answer.

    Do Not mention the words TASK in the response.

    Model Answer:
    {model_answer}

    Student Answer:
    {student_answer}
    """
    evaluation = get_llama_response_from_groq(prompt)
    end_time = time.time()
    elapsed_time = end_time - start_time

    if not evaluation:
        return {"error": "No response from LLaMA.", "elapsed_time": elapsed_time}

    score = 0
    justification = "No justification provided."
    feedback = "No feedback provided."

    score_match = re.search(r"Score:\s*(\d{1,2})/10", evaluation, re.IGNORECASE)
    if score_match:
        score = int(score_match.group(1))

    justification_match = re.search(r"Justification:(.*?)(Feedback:|$)", evaluation, re.DOTALL | re.IGNORECASE)
    if justification_match:
        justification = justification_match.group(1).strip()

    feedback_match = re.search(r"Feedback:(.*)", evaluation, re.DOTALL | re.IGNORECASE)
    if feedback_match:
        feedback = feedback_match.group(1).strip()

    # Scale the score to the max_score and round to nearest 0.5
    scaled_score = round((score / 10.0 * max_score) * 2) / 2

    return {
        "raw_score": score,
        "scaled_score": scaled_score,
        "max_score": max_score,
        "justification": justification,
        "feedback": feedback,
        "elapsed_time": elapsed_time
    }

def get_bucketed_score(total_score: float, max_score: float, difficulty_level: str = "medium") -> float:
    score_percentage = (total_score / max_score) * 100
    
    if difficulty_level == "easy":
        thresholds = [10, 20, 30, 40, 50, 60, 70]
    elif difficulty_level == "medium":
        thresholds = [12.5, 25, 37.5, 50, 62.5, 75, 80]
    else:
        thresholds = [10, 30, 50, 60, 70, 80, 90]

    if score_percentage >= thresholds[-1]:
        return round(max_score * 2) / 2

    for i, threshold in enumerate(thresholds):
        if score_percentage <= threshold:
            score = (i + 1) * (max_score / len(thresholds))
            return round(score * 2) / 2

    return 0


def grade_student_answers_v2(model_answer: str, student_answer: str, difficulty_level: str = "medium", maximum_score: float = 10) -> dict:
    """
    Grades a student's answer with scaling and difficulty adjustment.
    
    Args:
        model_answer (str): The correct model answer.
        student_answer (str): The student's answer.
        difficulty_level (str): The difficulty level for grading ("easy", "medium", "hard").
        maximum_score (float): The maximum score for the question.
    
    Returns:
        dict: Grading results with score achieved, max score, justification, and feedback.
    """
    # Get initial evaluation
    result = evaluate_answer(model_answer, student_answer, maximum_score)
    print(f"result : {result}")
    
    # Get bucketed score
    final_score = get_bucketed_score(result["scaled_score"], maximum_score, difficulty_level)
    
    return {
        "score_achieved": final_score,
        "maximum_score": maximum_score,
        "justification": result["justification"],
        "feedback": result["feedback"]
    }
