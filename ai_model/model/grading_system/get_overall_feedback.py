import re
from llama_utils import get_llama_response

def get_overall_feedback(feedback_list: list) -> str:
    """
    Combines a list of feedback statements into a single cohesive overall feedback using LLaMA
    and extracts the final feedback in a clean format.
    
    Args:
        feedback_list (list): A list of individual feedback strings.
        
    Returns:
        str: Extracted overall feedback text.
    """
    # Step 1: Prepare the prompt
    prompt = f"""
    Combine the following feedback statements for individual answers into a single cohesive overall feedback like a Teaching Assistant would.
    Ensure the feedback reads naturally and flows well:
    
    Feedback statements:
    {', '.join(feedback_list)}
    
    Format your response EXACTLY like this:
    Overall_feedback: <final cohesive feedback>

    DO NOT include anything in this summary apart from what is in the feedback statements.
    """
    
    # Step 2: Get response from LLaMA
    raw_feedback = get_llama_response(prompt)
    
    # Step 3: Extract the overall feedback using regex
    extracted_feedback = extract_feedback(raw_feedback)
    return extracted_feedback

def extract_feedback(raw_text: str) -> str:
    """
    Extracts the feedback text prefixed with 'Overall_feedback:' using regex.
    
    Args:
        raw_text (str): The raw response from LLaMA.
        
    Returns:
        str: The extracted overall feedback.
    """
    # Enhanced regex to handle potential newlines and variations in format
    match = re.search(r'overall[_ ]feedback\s*[:\-]\s*(.*)', raw_text, re.IGNORECASE | re.DOTALL)
    if match:
        feedback = match.group(1).strip()
        # Remove any trailing newlines or extra spaces
        return re.sub(r'\s+', ' ', feedback).strip()
    return "Feedback not found."

# Example usage
if __name__ == "__main__":
    feedback_list = [
        "Good effort on addressing the question.",
        "Your grammar needs improvement for better clarity.",
        "Add more examples to enhance the depth of your response.",
        "Well-structured but some sections could be expanded.",
        "You should have spoken in depth about photosynthesis for q2."
    ]
    
    overall_feedback = get_overall_feedback(feedback_list)
    print("\nExtracted Overall Feedback:")
    print(overall_feedback)
