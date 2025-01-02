from groq import Groq

# Initialize Groq client (ensure you have the API key set up if necessary)
client = Groq(api_key="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")

def get_groq_response(prompt):

    # Create the chat completion request
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # Use the Llama model
        messages=[{"role": "system", "content": "You are an AI grader."},  # Define the role of the AI
                    {"role": "user", "content": prompt}],  # Pass the grading prompt
        temperature=0,  # Set creativity for grading response
        top_p=1,  # Top-p for sampling (nucleus sampling)
        stream=False  # Stream is off as we want the full result at once
    )
    return completion.choices[0].message.content

