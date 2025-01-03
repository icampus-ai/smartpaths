import subprocess
import json

def get_llama_response(prompt):
    """Send the prompt to LLaMA 3.2 and get a response, removing the first two lines."""
    try:
        result = subprocess.run(
            ['ollama', 'run', 'llama3.2', prompt],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
        )
        if result.returncode == 0:
            output_lines = result.stdout.strip().split('\n')[2:]
            return "\n".join(output_lines).strip()
        else:
            return None
    except Exception as e:
        print(f"Error calling LLaMA 3.2: {e}")
        return None

def extract_keywords_with_llama(model_answer):
    """
    Extract relevant keywords from the model answer using LLaMA.
    This function sends a prompt to LLaMA for keyword extraction.
    """
    prompt = f"Extract key concepts and important terms from the following text:\n{model_answer}\n\nProvide a list of keywords."
    response = get_llama_response(prompt)
    
    # Process response to extract keywords (if any)
    if response:
        return [kw.strip() for kw in response.split(',') if kw.strip()]
    else:
        return []

def evaluate_answer_with_llama(model_answer, student_answer, grading_criteria):
    """
    Evaluate the student's answer based on dynamic grading criteria using LLaMA for keyword extraction.
    """
    feedback = {}
    total_score = 0
    max_score = len(grading_criteria) * 10  # 10 points per rubric

    # Extract keywords from the model answer using LLaMA
    model_keywords = extract_keywords_with_llama(model_answer)

    # Loop through each grading criterion
    for criterion, data in grading_criteria.items():
        # Generate the prompt, including explicit instructions to give a score and apply penalties if necessary
        prompt = f"""
        Please evaluate the following student answer based on the model answer and grading criterion.
        Provide a score from 0 to 10 based on how well the student answers the question.
        Include a detailed justification for the score, highlighting any deductions and penalties.
        If the student missed any key concepts or explanations, please mention them and apply penalties accordingly.
        
        Model Answer:
        {model_answer}
        
        Student Answer:
        {student_answer}
        
        Grading Criterion:
        {data['llm_prompt']}
        
        Instructions:
        - If the student missed any critical concepts or explanations, apply a penalty based on the importance of the missing information in this specific criterion.
        - The penalty should be subjective, based on the importance of the missing concepts, as defined in the criterion.
        - The maximum penalty should not exceed {data['penalty_for_missing']} per missing concept.
        """ 

        # Send the prompt to LLaMA and get the response
        evaluation = get_llama_response(prompt)

        if evaluation:
            # Look for structured feedback and scores in the response
            if "score:" in evaluation.lower():
                # Extract score from the response, assuming the format is "score: X/10"
                score_start = evaluation.lower().find("score:") + len("score:")
                score_end = evaluation.find("\n", score_start)
                score_str = evaluation[score_start:score_end].strip()

                # If the score is in the format 'X/10', extract the number before the slash
                try:
                    if '/' in score_str:
                        score = int(score_str.split('/')[0].strip())
                    else:
                        score = int(score_str)  # For case where it might be just a number like '7'
                except ValueError:
                    score = 0  # Default to 0 if extraction fails
            else:
                # Default to score 0 if no structured score is found
                score = 0
        else:
            score = 0

        # Collect feedback for each criterion
        justification = evaluation.strip() if evaluation else "No evaluation provided."
        
        # Store feedback
        feedback[criterion] = {
            "score": score,
            "justification": justification,
            "feedback": data['llm_prompt'],
        }

        # Add to total score
        total_score += score

    # Calculate percentage
    percentage = (total_score / max_score) * 100

    # Overall strengths, weaknesses, and improvements for the entire answer
    overall_strengths = "Strengths: The student demonstrated a solid understanding of the core concepts of photosynthesis."
    overall_weaknesses = "Weaknesses: Some explanations could have been more detailed, especially about the mechanisms behind the process."
    overall_improvement = "Improvement: The student should provide a deeper explanation of the biological processes involved and use more specific examples."

    result = {
        "total_score": total_score,
        "max_score": max_score,
        "percentage": percentage,
        "feedback": feedback,
        "overall_strengths": overall_strengths,
        "overall_weaknesses": overall_weaknesses,
        "overall_improvement": overall_improvement
    }

    return result

# Example usage
if __name__ == "__main__":
    # Example model and student answers
    model_answer = """
    Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. The main products of photosynthesis are glucose (a form of chemical energy) and oxygen. 
    The process occurs in the chloroplasts of plant cells, where light energy is absorbed and used to convert carbon dioxide and water into glucose and oxygen. Chlorophyll plays a key role in absorbing light.
    """
    student_answer = """
    Photosynthesis is a process where plants make their food using sunlight. They take in carbon dioxide and water to create glucose and oxygen. The plant’s leaves have a chemical called chlorophyll that helps them capture sunlight.
    """

    # Grading criteria JSON (example)
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
        },
        "Clarity and Grammar": {
            "max_score": 10,
            "llm_prompt": "Evaluate the clarity and grammar of the answer. Is the answer easy to read and free of grammatical errors?",
            "penalty_for_missing": 1
        },
        "Creativity and Originality": {
            "max_score": 10,
            "llm_prompt": "Assess the creativity and originality of the response. Does the student provide any unique insights or ideas?",
            "penalty_for_missing": 1
        },
        "Conciseness and Focus": {
            "max_score": 10,
            "llm_prompt": "Evaluate how concise and focused the response is. Is the answer direct and free from irrelevant details?",
            "penalty_for_missing": 1
        },
        "Coherence and Organization": {
            "max_score": 10,
            "llm_prompt": "Evaluate the logical flow and organization of the response. Is the answer well-organized with clear sections and a coherent structure?",
            "penalty_for_missing": 2
        }
    }

    # Get evaluation result
    result = evaluate_answer_with_llama(model_answer, student_answer, grading_criteria)
    
    # Print result
    print(json.dumps(result, indent=4))
