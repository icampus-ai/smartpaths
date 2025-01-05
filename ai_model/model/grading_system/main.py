from grader import grade_student_answers
import json

if __name__ == "__main__":
    model_answer = """
    Modulation is the process of varying a carrier signal's properties (such as amplitude, frequency, or phase) to encode information for transmission. In wireless communication, modulation allows the information signal to be transmitted over different frequencies, ensuring that it can travel longer distances without significant degradation. This process is essential for efficient use of the electromagnetic spectrum and to minimize interference between channels.
    """
    student_answer = """
    Modulation is changing the properties of a carrier signal to carry data.
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
