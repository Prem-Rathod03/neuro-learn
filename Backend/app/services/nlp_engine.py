# backend/app/services/nlp_engine.py

import os
from typing import Tuple, Optional, List

import httpx
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load DistilBERT model for sentiment analysis
_tokenizer = None
_model = None


def _load_transformer():
    """Lazy load the DistilBERT model on first use."""
    global _tokenizer, _model
    if _tokenizer is None or _model is None:
        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        _tokenizer = AutoTokenizer.from_pretrained(model_name)
        _model = AutoModelForSequenceClassification.from_pretrained(model_name)
        _model.eval()  # Set to evaluation mode


def analyze_feedback(text: str) -> Tuple[float, bool]:
    """
    Analyze free-text feedback using DistilBERT for sentiment analysis.
    Returns:
    - sentiment_score: between -1.0 (very negative) and +1.0 (very positive)
    - confusion_flag: True if sentiment is negative (suggests confusion/difficulty)
    """
    if not text:
        return 0.0, False

    # Load model on first call
    _load_transformer()

    # Tokenize and run inference
    inputs = _tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    
    with torch.no_grad():
        outputs = _model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1)[0]

    # Extract probabilities
    # Index 0 = negative, Index 1 = positive (for SST-2)
    neg_prob = float(probs[0])
    pos_prob = float(probs[1])
    
    # Calculate sentiment score: -1 (very negative) to +1 (very positive)
    sentiment_score = pos_prob - neg_prob
    
    # Flag as confused if sentiment is negative (below threshold)
    confusion_flag = sentiment_score < -0.3

    return sentiment_score, confusion_flag


async def rephrase_text(req) -> Tuple[str, Optional[List[str]]]:
    """
    Calls an LLM to simplify the question.
    Supports both Ollama (local) and Gemini API (cloud).
    Set USE_OLLAMA=true in .env to use Ollama, otherwise uses Gemini.
    """
    use_ollama = os.getenv("USE_OLLAMA", "false").lower() == "true"
    
    if use_ollama:
        return await _rephrase_with_ollama(req)
    else:
        return await _rephrase_with_gemini(req)


async def _rephrase_with_ollama(req) -> Tuple[str, Optional[List[str]]]:
    """Use local Ollama model for rephrasing."""
    ollama_url = os.getenv("OLLAMA_BASE_URL", os.getenv("OLLAMA_URL", "http://localhost:11434"))
    model_name = os.getenv("OLLAMA_MODEL", "llama3.2")  # or "mistral", "gemma2", etc.
    
    # Build a clearer prompt that asks for just the simplified question
    prompt_parts = [
        "You are helping a neurodiverse student understand a multiple-choice question.",
        f"Neurotype: {req.neuroType or 'unknown'}.",
        f"Difficulty level: {req.difficulty or 'unknown'}.",
    ]
    if req.confusionFlag:
        prompt_parts.append("The student is confused. Please simplify the language significantly.")
    
    prompt_parts.append(
        "IMPORTANT: Rephrase ONLY the question below into simpler, kid-friendly language. "
        "Use shorter sentences and easier words. Do NOT repeat the original question. "
        "Just provide the simplified version."
    )
    prompt_parts.append(f"\nOriginal question: {req.question}")
    if req.options:
        prompt_parts.append("\nOptions (you can simplify these too if needed):")
        for i, opt in enumerate(req.options):
            prompt_parts.append(f"{chr(65+i)}. {opt}")
    
    prompt_parts.append("\n\nSimplified question:")
    
    prompt = "\n".join(prompt_parts)
    
    # Ollama API format
    ollama_endpoint = f"{ollama_url}/api/generate"
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False,
    }
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(ollama_endpoint, json=payload, timeout=60.0)
            resp.raise_for_status()
            data = resp.json()
        
        raw_response = data.get("response", "").strip()
        
        if not raw_response:
            print("Warning: Ollama returned empty response")
            return req.question, req.options
        
        print(f"Ollama raw response (first 300 chars): {raw_response[:300]}")
        
        # Parse the response - extract just the simplified question
        simplified_text = raw_response
        
        # Try to find the simplified question after "Simplified question:" marker
        if "Simplified question:" in simplified_text:
            parts = simplified_text.split("Simplified question:", 1)
            if len(parts) > 1:
                simplified_text = parts[1].strip()
        
        # Remove the original question if it appears in the response
        if req.question in simplified_text:
            # Split by the original question and take the part after it
            parts = simplified_text.split(req.question, 1)
            if len(parts) > 1 and parts[1].strip():
                simplified_text = parts[1].strip()
            elif len(parts) > 0 and parts[0].strip() and parts[0] != req.question:
                simplified_text = parts[0].strip()
        
        # Clean up common prefixes/suffixes
        prefixes_to_remove = [
            "Here's a simpler version:",
            "Simplified version:",
            "Here's the simplified question:",
            "The simplified question is:",
        ]
        for prefix in prefixes_to_remove:
            if simplified_text.startswith(prefix):
                simplified_text = simplified_text[len(prefix):].strip()
        
        # Remove any leading/trailing quotes
        simplified_text = simplified_text.strip('"\'')
        
        # If the response is still the same as input or too short, it likely failed
        if simplified_text.strip() == req.question or len(simplified_text.strip()) < 10:
            print(f"Warning: Ollama response seems unchanged. Raw: {raw_response[:200]}")
            # Try to extract any text that's different from the original
            lines = raw_response.split("\n")
            for line in lines:
                line = line.strip()
                if line and line != req.question and len(line) > 10:
                    # Check if this line is substantially different
                    if line.lower() != req.question.lower() and req.question.lower() not in line.lower():
                        simplified_text = line
                        break
            
            # If still no good result, return a basic simplification attempt
            if simplified_text.strip() == req.question or len(simplified_text.strip()) < 10:
                # Last resort: return a message indicating we couldn't simplify
                simplified_text = f"Let's try this: {req.question}"
        
        print(f"Final simplified text: {simplified_text[:100]}...")
        
        # For options, we'll keep them the same for now (can be enhanced later)
        return simplified_text, req.options
        
    except httpx.HTTPStatusError as e:
        error_text = e.response.text
        try:
            error_json = e.response.json()
            error_msg = error_json.get("error", {}).get("message", error_text)
        except:
            error_msg = error_text
        print(f"Ollama API error {e.response.status_code}: {error_msg}")
        # Fallback to original on error
        return req.question, req.options
    except httpx.RequestError as e:
        print(f"Ollama connection error: {str(e)}")
        print("Make sure Ollama is running: ollama serve")
        # Fallback to original on error
        return req.question, req.options
    except Exception as e:
        print(f"Ollama error: {e}")
        return req.question, req.options


async def _rephrase_with_gemini(req) -> Tuple[str, Optional[List[str]]]:
    """Use Gemini API for rephrasing (original implementation)."""
    api_key = os.getenv("LLM_API_KEY")
    api_url = os.getenv("LLM_API_URL")  # e.g. provider endpoint

    # Build a clearer prompt that asks for just the simplified question
    prompt_parts = [
        "You are helping a neurodiverse student understand a multiple-choice question.",
        f"Neurotype: {req.neuroType or 'unknown'}.",
        f"Difficulty level: {req.difficulty or 'unknown'}.",
    ]
    if req.confusionFlag:
        prompt_parts.append("The student is confused. Please simplify the language significantly.")
    
    prompt_parts.append(
        "IMPORTANT: Rephrase ONLY the question below into simpler, kid-friendly language. "
        "Use shorter sentences and easier words. Do NOT repeat the original question. "
        "Just provide the simplified version directly."
    )
    prompt_parts.append(f"\nOriginal question: {req.question}")
    if req.options:
        prompt_parts.append("\nOptions (you can simplify these too if needed):")
        for i, opt in enumerate(req.options):
            prompt_parts.append(f"{chr(65+i)}. {opt}")
    
    prompt_parts.append("\n\nSimplified question:")

    prompt = "\n".join(prompt_parts)

    if not api_key:
        # Fallback: just return original text if no LLM configured
        return req.question, req.options

    # Google Gemini API format
    # Use default endpoint if not provided, or use the provided one
    if not api_url:
        # Default to gemini-2.0-flash if no URL specified
        api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    elif ":generateContent" not in api_url:
        # If URL doesn't have the method, add it
        if api_url.endswith("/"):
            api_url = api_url.rstrip("/")
        if not api_url.endswith(":generateContent"):
            api_url = f"{api_url}:generateContent"
    
    # Replace deprecated model names with available ones
    if "gemini-1.5-flash" in api_url:
        api_url = api_url.replace("gemini-1.5-flash", "gemini-2.0-flash")
    elif "gemini-1.5-pro" in api_url:
        api_url = api_url.replace("gemini-1.5-pro", "gemini-2.0-flash")
    elif "gemini-pro" in api_url and "gemini-2.0" not in api_url:
        api_url = api_url.replace("gemini-pro", "gemini-2.0-flash")
    
    # Gemini API uses X-goog-api-key header, not query parameter
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": api_key,
    }
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }
    
    # URL without query parameter
    url_with_key = api_url

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url_with_key, json=payload, headers=headers, timeout=30.0)
            resp.raise_for_status()
            data = resp.json()
        
        # Debug: print response structure
        print(f"Gemini API response keys: {list(data.keys()) if isinstance(data, dict) else 'not a dict'}")
        
        # Parse Gemini response format
        simplified_text = ""
        if "candidates" in data and len(data["candidates"]) > 0:
            candidate = data["candidates"][0]
            print(f"Candidate keys: {list(candidate.keys()) if isinstance(candidate, dict) else 'not a dict'}")
            if "content" in candidate and "parts" in candidate["content"]:
                if len(candidate["content"]["parts"]) > 0:
                    simplified_text = candidate["content"]["parts"][0].get("text", "").strip()
                    print(f"Extracted text (first 200 chars): {simplified_text[:200]}")
        
        if not simplified_text:
            # If no text extracted, log and return original
            print(f"Warning: No text extracted from response. Full response keys: {list(data.keys()) if isinstance(data, dict) else 'not a dict'}")
            print(f"Full response (first 500 chars): {str(data)[:500]}")
            return req.question, req.options
        
        # Clean up the response - remove any prompt artifacts
        # Remove the original question if it appears
        if req.question in simplified_text:
            # Try to extract just the new simplified version
            parts = simplified_text.split(req.question)
            # Take the part that's different
            for part in parts:
                part = part.strip()
                if part and part != req.question and len(part) > 10:
                    simplified_text = part
                    break
        
        # Remove common prefixes
        prefixes = ["Here's", "Here is", "Simplified:", "The simplified question is:"]
        for prefix in prefixes:
            if simplified_text.startswith(prefix):
                simplified_text = simplified_text[len(prefix):].strip()
                # Remove leading colon if present
                if simplified_text.startswith(":"):
                    simplified_text = simplified_text[1:].strip()
        
        # Final check - if it's still the same, try to find any different text
        if simplified_text.strip() == req.question:
            print(f"Warning: Simplified text is same as original. Trying to extract different text...")
            # Look for any sentence that's different
            sentences = simplified_text.split(".")
            for sentence in sentences:
                sentence = sentence.strip()
                if sentence and sentence != req.question and len(sentence) > 10:
                    simplified_text = sentence
                    break
        
        print(f"Final simplified text: {simplified_text[:150]}...")
            
    except httpx.HTTPStatusError as e:
        error_text = e.response.text
        try:
            error_json = e.response.json()
            error_msg = error_json.get("error", {}).get("message", error_text)
        except:
            error_msg = error_text
        
        status_code = e.response.status_code
        print(f"Gemini API error {status_code}: {error_msg}")
        print(f"URL used: {url_with_key}")  # Show URL
        
        # Handle quota exceeded gracefully - return original text instead of crashing
        if status_code == 429:
            print("Quota exceeded - returning original text as fallback")
            return req.question, req.options
        
        raise Exception(f"LLM API error {status_code}: {error_msg}")
    except httpx.RequestError as e:
        error_msg = f"Request failed: {str(e)}"
        print(f"Gemini API error: {error_msg}")
        raise Exception(f"LLM request failed: {str(e)}")
    except Exception as e:
        # If API call fails, raise with message
        print(f"Gemini API error: {e}")
        raise Exception(f"Rephrase failed: {str(e)}")

    # Return the simplified text (or original if parsing failed)
    if not simplified_text or simplified_text.strip() == req.question:
        print("Warning: Could not extract simplified text, returning original")
        return req.question, req.options
    
    return simplified_text.strip(), req.options
