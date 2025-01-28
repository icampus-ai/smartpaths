from groq import Groq
import base64
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from ai_model.model.grading_system.get_llama_response_from_groq import get_llama_response_from_groq

def extract_text(image_data):
    """
    Analyzes an image using the Groq API and returns the model's response.

    Parameters:
        image_data (bytes): Image data in bytes.

    Returns:
        str: Response from the model.
    """
    # Function to encode the image into Base64
    def encode_image(image):
        # Open the JPEG image in binary mode
        try:
            image_data = image.read()
            return base64.b64encode(image_data).decode('utf-8')
        except FileNotFoundError:
            raise FileNotFoundError(f"The file at {image} was not found.")
        except Exception as e:
            raise RuntimeError(f"An error occurred while encoding the image: {e}")

    # Encode the image
    base64_image = encode_image(image_data)

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
    text = chat_completion.choices[0].message.content

    prompt = f"faithfully just reconstruct the text from this student's answer to accommodate any simple English errors: {text}"

    reconstructed_text = get_llama_response_from_groq(prompt)

    return reconstructed_text

# # Example usage
# if __name__ == "__main__":
#     # Load your image into memory (e.g., from a file)
#     image_path = r"C:\Users\Vivek\Downloads\handwritten_answer.jpg"  # Example file path
#     with open(image_path, "rb") as image_file:
#         image_data = image_file.read()

#     response = extract_text(image_data)
#     print("Response from the model:", response)
