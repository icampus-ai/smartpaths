from ai_model.model.grading_system.llama_utils import get_llama_response, extract_keywords_with_llama
from ai_model.model.grading_system.feedback_summary import generate_dynamic_summary

def evaluate_answer(model_answer, student_answer, grading_criteria):
    feedback = {}
    total_score = 0
    max_score = len(grading_criteria) * 10

    model_keywords = extract_keywords_with_llama(model_answer)

    for criterion, data in grading_criteria.items():
        prompt = f"""
Please evaluate the following student answer strictly based on the model answer provided below. The student should only include the concepts and explanations as provided in the model answer. Do not incorporate any external or outside knowledge. Provide a score from 0 to 10 based on how well the student answers the question in alignment with the model answer. Include a detailed justification for the score, highlighting any deductions and penalties.

Model Answer:
{model_answer}

Student Answer:
{student_answer}

Grading Criterion:
{data['llm_prompt']}

Instructions:
- The student should include only the concepts, explanations, and details present in the model answer.
- If the student missed any key concept or explanation from the model answer, apply a penalty for each missing concept.
- Do not apply penalties for any missing concepts that are not mentioned in the model answer.
- The maximum penalty should not exceed {data['penalty_for_missing']} per missing concept.
- Provide a concise explanation (20-30 words) for the score, including:
  - Why the score was given.
  - Any missing concepts or key points from the model answer.
  - Penalties applied for missing these concepts.
"""
        evaluation = get_llama_response(prompt)
        if evaluation and "score:" in evaluation.lower():
            try:
                score_str = evaluation.lower().split("score:")[1].split("/")[0].strip()
                score = int(score_str)
            except ValueError:
                score = 0
        else:
            score = 0

        justification = evaluation.strip() if evaluation else "No evaluation provided."
        feedback[criterion] = {"score": score, "justification": justification, "feedback": data['llm_prompt']}
        total_score += score

    percentage = (total_score / max_score) * 100
    overall_strengths, overall_weaknesses, overall_improvement = generate_dynamic_summary(feedback)

    print("total_score:", total_score)
    print("max_score:", max_score)
    print("percentage:", percentage)
    return {
        "total_score": total_score,
        "max_score": max_score,
        "percentage": percentage,
        "feedback": feedback,
        "overall_strengths": overall_strengths,
        "overall_weaknesses": overall_weaknesses,
        "overall_improvement": overall_improvement
    }

def grade_student_answers(model_answer, student_answer, grading_criteria):
    return evaluate_answer(model_answer, student_answer, grading_criteria)
