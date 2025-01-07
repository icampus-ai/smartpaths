import subprocess
import json
import re

# Helper function to interact with LLaMA
def get_llama_response(prompt):
    """Send a prompt to LLaMA 3.2 and return the response."""
    try:
        result = subprocess.run(
            ['ollama', 'run', 'llama3.2', prompt],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.returncode == 0:
            output_lines = result.stdout.strip().split('\n')[2:]
            return "\n".join(output_lines).strip()
        return None
    except Exception as e:
        print(f"Error calling LLaMA 3.2: {e}")
        return None

# Keyword extraction
def extract_keywords(model_answer):
    """Extract key concepts and terms from the model answer using LLaMA."""
    prompt = f"Extract key concepts and terms from the following text:\n{model_answer}\n\nProvide a list of keywords."
    response = get_llama_response(prompt)
    return [kw.strip() for kw in response.split(',') if kw.strip()] if response else []

# Generate summaries
def generate_summary(feedback):
    """Generate overall strengths, weaknesses, and improvements based on feedback."""
    strengths, weaknesses, improvements = [], [], []
    for criterion, data in feedback.items():
        if data['score'] >= 7:
            strengths.append(f"Good understanding of {criterion.lower()}.")
        elif data['score'] <= 4:
            weaknesses.append(f"Critical issues in {criterion.lower()}.")
        if "missing" in data['justification'].lower():
            improvements.append(f"Address missing details in {criterion.lower()}.")
    return (
        "Strengths: " + " ".join(strengths) if strengths else "No significant strengths.",
        "Weaknesses: " + " ".join(weaknesses) if weaknesses else "No major weaknesses.",
        "Improvements: " + " ".join(improvements) if improvements else "Focus on more comprehensive explanations."
    )

# Main evaluation function
def evaluate_answer(model_answer, student_answer, grading_criteria):
    """Evaluate the student's answer based on the provided grading criteria."""
    feedback = {}
    total_score = 0
    max_score = len(grading_criteria) * 10

    # Extract keywords (optional for detailed evaluation)
    model_keywords = extract_keywords(model_answer)

    for criterion, config in grading_criteria.items():
        # Build the prompt for LLaMA
        prompt = f"""
Evaluate the following student answer based on the model answer. Score from 0 to 10 and provide justification.

Model Answer:
{model_answer}

Student Answer:
{student_answer}

Criterion: {config['llm_prompt']}
- Penalize for missing key concepts from the model answer.
- Maximum penalty per missing concept: {config['penalty_for_missing']}.

Include:
1. A score (e.g., "Score: 8/10").
2. A justification explaining the score and penalties.
"""
        # Get evaluation from LLaMA
        evaluation = get_llama_response(prompt)

        # Extract score from the response
        score = 0
        if evaluation and "score:" in evaluation.lower():
            match = re.search(r"\b(\d{1,2})(?=/|$)", evaluation.lower().split("score:")[1].strip())
            score = int(match.group(1)) if match else 0
        score = min(score, 10)  # Cap score at 10

        # Collect feedback
        feedback[criterion] = {
            "score": score,
            "justification": evaluation.strip() if evaluation else "No justification provided.",
            "feedback": config['llm_prompt']
        }
        total_score += score

    # Calculate percentage
    percentage = (total_score / max_score) * 100

    # Generate overall summaries
    strengths, weaknesses, improvements = generate_summary(feedback)

    return {
        "total_score": total_score,
        "max_score": max_score,
        "percentage": percentage,
        "feedback": feedback,
        "overall_strengths": strengths,
        "overall_weaknesses": weaknesses,
        "overall_improvements": improvements,
    }

# Example usage
if __name__ == "__main__":
    model_answer = """
    Photosynthesis is the process by which green plants use sunlight to synthesize food with chlorophyll. Main products are glucose and oxygen. It occurs in chloroplasts.
    """
    student_answer = """
    Photosynthesis is a process where plants use sunlight to make food. They produce glucose and oxygen. Chlorophyll helps in capturing sunlight in leaves.
    """
    grading_criteria = {
        "Content Relevance": {
            "llm_prompt": "Evaluate if all key points in the model answer are included.",
            "penalty_for_missing": 2,
        },
        "Depth of Understanding": {
            "llm_prompt": "Check if the answer shows a thorough understanding of the topic.",
            "penalty_for_missing": 3,
        },
        "Clarity": {
            "llm_prompt": "Assess if the answer is clear and concise.",
            "penalty_for_missing": 1,
        }
    }
    result = evaluate_answer(model_answer, student_answer, grading_criteria)
    print(json.dumps(result, indent=4))
