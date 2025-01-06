from llama_utils import get_llama_response
import re
import json
import time

def evaluate_answer(model_answer, student_answer):
    """Evaluate the student's answer based only on the key concepts present in the model answer."""
    start_time = time.time()  # Start time for performance tracking

    # Revised prompt for LLaMA to focus only on key concepts in the model answer
    prompt = f"""
You are an empathetic Teaching Assistant grading for a 3rd-grade class. Your grading focuses exclusively on the key concepts mentioned in the model answer, without worrying about specific word choice, phrasing, or grammar. You should grade based strictly on the essential ideas presented in the model answer.

Task 1: Identify the very key concepts from the model answer. These are the fundamental concepts that must appear in the student's answer.
Task 2: Review the student's answer and check if it mentions the exact key concepts found in the model answer.
Task 3: Grade the student's answer only based on the inclusion or exclusion of these key concepts. Do not consider any extra details, phrasing, or advanced vocabulary.
Task 4: Provide output in the following format:
    Score: x/10
    Justification: Explain the deductions in simple terms, listing what was missing or incorrect and why.
    Feedback: Offer a friendly suggestion for improvement in the student's answer.

Model Answer:
{model_answer}

Student Answer:
{student_answer}
"""

    # Get evaluation from LLaMA
    evaluation = get_llama_response(prompt)

    # End time for performance tracking
    end_time = time.time()
    elapsed_time = end_time - start_time  # Time elapsed for the grading process

    if not evaluation:
        return {"error": "No response from LLaMA.", "elapsed_time": elapsed_time}

    # Parse score, justification, and feedback from LLaMA's response
    score = 0
    justification = "No justification provided."
    feedback = "No feedback provided."

    # Extract score, justification, and feedback using regex
    score_match = re.search(r"Score:\s*(\d{1,2})/10", evaluation, re.IGNORECASE)
    if score_match:
        score = int(score_match.group(1))

    justification_match = re.search(r"Justification:(.*?)(Feedback:|$)", evaluation, re.DOTALL | re.IGNORECASE)
    if justification_match:
        justification = justification_match.group(1).strip()

    feedback_match = re.search(r"Feedback:(.*)", evaluation, re.DOTALL | re.IGNORECASE)
    if feedback_match:
        feedback = feedback_match.group(1).strip()

    return {
        "score": score,
        "justification": justification,
        "feedback": feedback,
        "elapsed_time": elapsed_time  # Include the time taken for grading
    }

def grade_answer(model_answer, student_answer, difficulty_level="medium"):
    """Grades the answer based on model answer and student answer."""
    
    result = evaluate_answer(model_answer, student_answer)

    total_score = result["score"]
    max_score = 10
    percentage = (total_score / max_score) * 100
    
    return {
        "total_score": total_score,
        "max_score": max_score,
        "percentage": percentage,
        "justification": result["justification"],
        "feedback": result["feedback"],
        "elapsed_time": result["elapsed_time"]  # Include elapsed time in final result
    }