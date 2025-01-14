import re
from ai_model.model.grading_system.llama_utils import get_llama_response
# from llama_utils import get_llama_response

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
    Ensure the feedback reads naturally and flows well in STRICTLY around 70 words:
    
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

# if __name__ == "__main__":
#     feedback_list = [
#         (
#             "In Question 1, you provided a thorough explanation of the key concepts, "
#             "demonstrating a solid understanding of the subject matter. However, your argument lacked balance as it did not consider alternative perspectives. "
#             "Additionally, some of your examples were generic and could have been more directly tied to the question's specific context. "
#             "While your answer was well-structured, the conclusion felt rushed and did not fully summarize the insights presented. "
#             "For future responses, consider dedicating more time to crafting a robust conclusion and integrating diverse viewpoints."
#         ),
#         (
#             "Your response to Question 2 showed promise in its use of technical terms and the inclusion of relevant data points. "
#             "That said, there were issues with organization, as some paragraphs repeated similar ideas without advancing the argument. "
#             "The case study you referenced was a good choice but lacked sufficient analysis to connect it to the question effectively. "
#             "Grammar errors, such as misplaced modifiers and run-on sentences, also detracted from the clarity of your writing. "
#             "Revisiting basic grammatical principles and using a clear framework to organize your ideas would significantly enhance your future answers."
#         ),
#         (
#             "Question 3 required a critical analysis of the provided graph, which you partially achieved. "
#             "Your description of the graph's trends was accurate, but you missed interpreting the anomalies that were clearly marked. "
#             "Moreover, your calculations were mostly correct, but you failed to show the step-by-step process, making it hard to follow your methodology. "
#             "The conclusion drawn from your analysis was weak, as it did not sufficiently address the implications of the data. "
#             "For improvement, practice providing a more detailed breakdown of your reasoning and linking data points to the overall question."
#         ),
#         (
#             "Your answer to Question 4 was creative and demonstrated an ability to think outside the box, which is commendable. "
#             "However, the response lacked depth in addressing the question's core requirements. "
#             "For instance, while your use of hypothetical scenarios was engaging, they did not align well with the theoretical framework outlined in the question. "
#             "Additionally, your response would have benefited from citing specific examples from course materials or external sources. "
#             "To improve, focus on directly tying your creative ideas to the question’s theoretical basis and supporting them with concrete evidence."
#         ),
#         (
#             "The response to Question 5 was well-researched, and your ability to synthesize information from multiple sources stood out. "
#             "However, the essay was overly verbose in some sections, making it challenging to identify your main arguments. "
#             "The middle section, in particular, digressed into tangential topics that were not directly relevant to the question. "
#             "While your conclusion successfully summarized the key points, it lacked actionable recommendations or a forward-looking perspective. "
#             "For future essays, strive for more concise writing and ensure every section contributes directly to your central thesis."
#         )
#     ]

#     overall_feedback = get_overall_feedback(feedback_list)
#     print("\nExtracted Overall Feedback:")
#     print(overall_feedback)

