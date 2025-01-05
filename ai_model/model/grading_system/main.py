from grader import grade_student_answers
import json

if __name__ == "__main__":
    model_answer = """
    Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. The main products of photosynthesis are glucose (a form of chemical energy) and oxygen. 
    The process occurs in the chloroplasts of plant cells, where light energy is absorbed and used to convert carbon dioxide and water into glucose and oxygen. Chlorophyll plays a key role in absorbing light.
    """
    student_answer = """
    Photosynthesis is a process where plants make their food using sunlight. They take in carbon dioxide and water to create glucose and oxygen. The plant’s leaves have a chemical called chlorophyll that helps them capture sunlight.
    """
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
        }
    }

    result = grade_student_answers(model_answer, student_answer, grading_criteria)
    print(json.dumps(result, indent=4))
