from groq import Groq
import base64

def extract_text(image_path):
    """
    Analyzes an image using the Groq API and returns the model's response.

    Parameters:
        image_path (str): Path to the image file.

    Returns:
        str: Response from the model.
    """
    # Function to encode the image into Base64
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    # Encode the image
    base64_image = encode_image(image_path)

    # Initialize Groq client with the API key
    client = Groq(api_key="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")

    # Create chat completion request
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract text from this image and just return text as it is."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        model="llama-3.2-11b-vision-preview",
        temperature=0.0,  # Eliminate randomness
        top_p=0.0,        # Disable nucleus sampling (strictly deterministic)
        # top_k=1           # Only the single most likely token is considered at each step
    )


    # Extract and return the response
    return chat_completion.choices[0].message.content

# # Example usage
# if __name__ == "__main__":
#     image_path = r"C:\Users\Vivek\Downloads\handwritten_answer.jpg"  # Path to your image
#     response = extract_text(image_path)
#     print("Response from the model:", response)
