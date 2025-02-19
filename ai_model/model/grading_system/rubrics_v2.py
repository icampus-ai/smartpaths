import json
import re
from ai_model.model.grading_system.get_llama_response_from_groq import get_llama_response_from_groq

def generate_rubrics(model_question_and_answer: str) -> list:
    """
    Calls the LLaMA model to extract rubrics from the provided model question and answer.
    
    Args:
        model_question_and_answer (str): The combined model question and answer string.
    
    Returns:
        list: A list of rubrics extracted from the model QA in the specified format.
    """
    # Define the prompt to extract rubrics
    prompt = f"""
    Given the following model question and answer combined in a single string, extract the rubric for each evaluation category in the specified format:
    
    Input: "{model_question_and_answer}"
    
    Please extract the relevant information to generate the rubric, including:
    - Understanding: Criteria for assessing understanding
    - Application: Criteria for assessing application
    - Analysis: Criteria for assessing analysis
    - Synthesis: Criteria for assessing synthesis
    - Clarity and Organization: Criteria for assessing clarity and organization
    
    Please provide the rubric as a list of JSON objects in the following format:
    
    [
      {{
        "question_number": <number>,
        "question": "<question_text>",
        "marks": <total_marks>,
        "bloom_taxonomy": "<bloom_taxonomy>",
        "rubric": {{
          "understanding": {{
            "marks": <marks>,
            "description": "<criteria>"
          }},
          "application": {{
            "marks": <marks>,
            "description": "<criteria>"
          }},
          "analysis": {{
            "marks": <marks>,
            "description": "<criteria>"
          }},
          "synthesis": {{
            "marks": <marks>,
            "description": "<criteria>"
          }},
          "clarity_and_organization": {{
            "marks": <marks>,
            "description": "<criteria>"
          }}
        }}
      }}
    ]
    
    Please respond with the rubrics as a list in this exact format.
    """
    
    # Call LLaMA model via Groq to generate the response
    raw_response = get_llama_response_from_groq(prompt)
    
    # Extract just the JSON part of the response by removing extra text
    match = re.search(r"(\[.*\])", raw_response, re.DOTALL)
    if match:
        clean_response = match.group(1)
    else:
        print("Error: Unable to extract valid JSON from the response.")
        return []
    
    # Process the response into a list of JSON objects
    try:
        rubrics = json.loads(clean_response)
        return rubrics
    except json.JSONDecodeError:
        print("Error: Failed to decode the LLaMA response as JSON.")
        print("Raw LLaMA Response:", clean_response)
        return []

# # Example Usage:
# model_question_and_answer = """
# Question 1: What is the capital of France? — 5 Marks
# Answer: The capital of France is Paris.

# Question 2: Explain the process of photosynthesis. — 10 Marks
# Answer: Photosynthesis is the process by which plants convert sunlight into energy, primarily occurring in the chloroplasts.

# Question 3: Discuss the impact of the Industrial Revolution on society. — 15 Marks
# Answer: The Industrial Revolution had a profound impact on society, leading to urbanization, the rise of factory work, and significant technological advancements.
# """
# rubrics = generate_rubrics(model_question_and_answer)
# print(json.dumps(rubrics, indent=2))
