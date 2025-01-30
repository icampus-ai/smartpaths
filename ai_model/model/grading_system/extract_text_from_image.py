from groq import Groq
import base64
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))


def encode_image(image):
    """
    Encodes the given image into Base64 format.
    
    Args:
        image: Either a path to the image file or a FileStorage object.
    
    Returns:
        str: Base64-encoded image data.
    """
    try:
        if isinstance(image, bytes):
            # If the image is already in bytes, just base64 encode it
            return base64.b64encode(image).decode('utf-8')
        
        elif hasattr(image, 'read'):  # Checking if the object is a FileStorage (e.g., from Flask file upload)
            # If it's a FileStorage object, read it as bytes
            image_data = image.read()
            return base64.b64encode(image_data).decode('utf-8')
        
        elif isinstance(image, str) and os.path.isfile(image):
            # If it's a file path, open the file and read it as bytes
            with open(image, 'rb') as f:
                image_data = f.read()
            return base64.b64encode(image_data).decode('utf-8')
        
        else:
            raise ValueError("Invalid image input. Must be bytes, FileStorage, or a valid file path.")
    
    except Exception as e:
        raise RuntimeError(f"An error occurred while encoding the image: {e}")


def extract_text(image_data):
    """
    Analyzes an image using the Groq API and returns the model's response without any asterisks.

    Parameters:
        image_data (bytes): Image data in bytes.

    Returns:
        str: Response from the model without asterisks.
    """


    # Encode the image
    base64_image = encode_image(image_data)

    try:
        # Initialize Groq client with the API key
        client = Groq(api_key="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")  # Securely load API key
        
        prompt = """
        Extract all text from this image and return it exactly as it is present in the image.
        The format should be:

        Question [Question Number]: [Question Text]
        Answer: [Answer Text]
        """

        # Create chat completion request
        chat_completion = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }],
            model="llama-3.2-11b-vision-preview",
            temperature=0.0,  # Eliminate randomness
            top_p=0.0,        # Disable nucleus sampling (strictly deterministic)
        )

        # Extract the text response
        text = chat_completion.choices[0].message.content

        # Remove any asterisks from the extracted text
        text_without_stars = text.replace('*', '')

        print("Extracted text without asterisks:", text_without_stars)

        return text_without_stars

    except Exception as e:
        print(f"An error occurred while processing the request: {e}")

# # Example usage
# if __name__ == "__main__":
#     # Load your image into memory (e.g., from a file)
#     image_path = r"C:\Users\vscsi\Downloads\student_response.jpg"  # Example file path
#     with open(image_path, "rb") as image_file:
#         image_data = image_file.read()

#     response = extract_text(image_data)
#     print("Response from the model:", response)
