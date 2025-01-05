from flask import json
import requests

def get_llama_response(prompt, model_name="llama3.2"):
    url = "http://localhost:11434/api/generate"

    headers = {
        "Content-Type": "application/json",
    }

    data = {
        "model": model_name,
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_keep": 5,
            "seed": 42,
            "num_predict": 1000,
            "top_k": 10000,
            "top_p": 1.0,
            "temperature": 0.0,
            "repeat_penalty": 1.2,
            "presence_penalty": 1.5,
            "frequency_penalty": 1.0,
            "mirostat": 1,
            "mirostat_tau": 0.8,
            "mirostat_eta": 0.6,
            "penalize_newline": True,
            "stop": [],
            "numa": False,
            "num_ctx": 1024,
            "num_batch": 2,
            "num_gpu": 1,
            "main_gpu": 0,
            "low_vram": False,
            "vocab_only": False,
            "use_mmap": True,
            "use_mlock": False,
            "num_thread": 8,
        }
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        
        if response.status_code == 200:
            result = response.json()
            return result['response']
        else:
            return "Error: Unable to generate response."
    
    except Exception as e:
        return "Error: Something went wrong."

def extract_keywords_with_llama(model_answer):
    """
    Extract relevant keywords from the model answer using LLaMA.
    """
    prompt = f"Extract key concepts and important terms from the following text:\n{model_answer}\n\nProvide a list of keywords."
    response = get_llama_response(prompt)
    if response:
        return [kw.strip() for kw in response.split(',') if kw.strip()]
    return []
