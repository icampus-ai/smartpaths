def generate_dynamic_summary(feedback):
    strengths = []
    weaknesses = []
    improvements = []

    for criterion, data in feedback.items():
        if data['score'] >= 7:
            strengths.append(f"The student demonstrated a solid understanding of {criterion.lower()}.")
        elif data['score'] <= 4:
            weaknesses.append(f"The student missed critical elements in {criterion.lower()}, especially in {data['justification']}.")
        if "missing" in data['justification'].lower() or "penalty" in data['justification'].lower():
            improvements.append(f"The student could improve by addressing the missing details in {criterion.lower()}.")

    overall_strengths = "Strengths: " + " ".join(strengths) if strengths else "Strengths: The student demonstrated a good understanding of the core concepts."
    overall_weaknesses = "Weaknesses: " + " ".join(weaknesses) if weaknesses else "Weaknesses: Some aspects could be improved, such as depth or detail."
    overall_improvement = "Improvement: " + " ".join(improvements) if improvements else "Improvement: The student should elaborate more on key concepts and explanations."

    return overall_strengths, overall_weaknesses, overall_improvement
