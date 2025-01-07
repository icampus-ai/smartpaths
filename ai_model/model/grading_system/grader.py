from llama_utils import get_llama_response
import re
import json
import time

def evaluate_answer(model_answer, student_answer):
    start_time = time.time()
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
    evaluation = get_llama_response(prompt)
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

    print("total_score:", total_score)
    print("max_score:", max_score)
    print("percentage:", percentage)
    return {
        "score": score,
        "justification": justification,
        "feedback": feedback,
        "elapsed_time": elapsed_time
    }

def get_bucketed_score(total_score):
    if total_score <= 1:
        return 0
    elif total_score <= 3:
        return 1
    elif total_score <= 5:
        return 2
    elif total_score <= 7.5:
        return 3
    else:
        return 4

def grade_answer(model_answer, student_answer, difficulty_level="medium"):
    result = evaluate_answer(model_answer, student_answer)
    total_score = result["score"]
    final_score = get_bucketed_score(total_score)
    max_score = 4
    percentage = (final_score / max_score) * 100

    return {
        "final_score": final_score,
        "max_score": max_score,
        "percentage": percentage,
        "justification": result["justification"],
        "feedback": result["feedback"],
        "elapsed_time": result["elapsed_time"]
    }
