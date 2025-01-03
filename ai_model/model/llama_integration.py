import subprocess

def get_llama_response(prompt):
    """Send the prompt to Llama 3.2 and get a response, removing the first two lines."""
            # Run the subprocess and capture stdout and stderr
    try:
        result = subprocess.run(
            ['ollama', 'run', 'llama3.2', prompt],
            stdout=subprocess.PIPE,  # Capture stdout
            stderr=subprocess.PIPE,  # Capture stderr
            text=True,
            encoding='utf-8'
        )
        if result.returncode == 0:
            # Get the response from stdout, split into lines, and remove the first two lines
            output_lines = result.stdout.strip().split('\n')[2:]  # Skip first two lines
            cleaned_output = "\n".join(output_lines)
            return cleaned_output.strip()  # Return the rest of the response, removing extra spaces
        else:
            # In case of an error, return None
            return None
    except Exception as e:
        print(f"Error calling LLaMA 3.2: {e}")
        return None

# # Example usage
# response = get_llama_response("do you understand kannada and hindi?")
# print(response)