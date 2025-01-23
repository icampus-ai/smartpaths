from groq import Groq

# Initialize the Groq client with the API key
client = Groq(api_key="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")

def get_llama_response_from_groq(prompt):
    """
    Sends a prompt to the Groq API and returns the model's response.

    Parameters:
        prompt (str): The input text prompt for the model.

    Returns:
        str: The model's response as a string.
    """
    # Create a chat completion request
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.0,  # Highly deterministic output
        top_p=0.0,        # Restrict to the most probable tokens
        stream=False,     # Collect the full response at once
        stop=None,
    )

    # Return the model's response content
    return completion.choices[0].message.content

# # Example usage
# if __name__ == "__main__":
#     prompt = "Explain the concept of machine learning in simple terms."
#     response = get_llama_response_from_groq(prompt)
#     print("Response:", response)
