from llama_utils import get_llama_response
import re

def evaluate_answer(model_answer, student_answer):
    """Evaluate the student's answer based on correctness."""
    prompt = f"""
    Grade the following student answer based on the model answer. Focus on correctness. 
    Provide a score (0-10) with:
    - A score (e.g., "Score: 8/10").
    - Justification for any deductions, prefixed by "Justification:".
    - Suggestions to improve the answer, prefixed by "Feedback:".

    Model Answer:
    {model_answer}

    Student Answer:
    {student_answer}
    """

    # Get evaluation from LLaMA
    evaluation = get_llama_response(prompt)

    if not evaluation:
        return {"error": "No response from LLaMA."}

    # Parse feedback and scores
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
    }
