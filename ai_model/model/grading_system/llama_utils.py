import subprocess

def get_llama_response(prompt):
    """Send the prompt to LLaMA 3.2 and get a response, removing the first two lines."""
    try:
        result = subprocess.run(
            ['ollama', 'run', 'llama3.2', prompt],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
        )
        if result.returncode == 0:
            output_lines = result.stdout.strip().split('\n')[2:]
            return "\n".join(output_lines).strip()
        else:
            return None
    except Exception as e:
        print(f"Error calling LLaMA 3.2: {e}")
        return None

def extract_keywords_with_llama(model_answer):
    """
    Extract relevant keywords from the model answer using LLaMA.
    """
    prompt = f"Extract key concepts and important terms from the following text:\n{model_answer}\n\nProvide a list of keywords."
    response = get_llama_response(prompt)
    if response:
        return [kw.strip() for kw in response.split(',') if kw.strip()]
    return []
