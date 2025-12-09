# backend/app/services/nlp_engine.py

import os
from typing import Tuple, Optional, List

import httpx

# Try to import transformers and torch, but don't fail if they're not available
try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
    TRANSFORMERS_AVAILABLE = True
except (ImportError, PermissionError, OSError) as e:
    print(f"⚠️ Warning: Transformers/Torch not available: {e}")
    print("   Falling back to simple sentiment analysis")
    TRANSFORMERS_AVAILABLE = False

# Load DistilBERT model for sentiment analysis
_tokenizer = None
_model = None


def _load_transformer():
    """Lazy load the DistilBERT model on first use."""
    global _tokenizer, _model
    if not TRANSFORMERS_AVAILABLE:
        return False
    
    if _tokenizer is None or _model is None:
        try:
            model_name = "distilbert-base-uncased-finetuned-sst-2-english"
            print(f"Loading DistilBERT model: {model_name}...")
            _tokenizer = AutoTokenizer.from_pretrained(model_name)
            _model = AutoModelForSequenceClassification.from_pretrained(model_name)
            _model.eval()  # Set to evaluation mode
            print("✓ DistilBERT loaded successfully")
            return True
        except Exception as e:
            print(f"⚠️ Failed to load DistilBERT: {e}")
            return False
    return True


def _simple_sentiment_analysis(text: str) -> Tuple[float, bool]:
    """
    Fallback: Simple rule-based sentiment analysis.
    Used when transformers/torch are not available.
    """
    text_lower = text.lower()
    
    # Negative keywords
    negative_words = [
        'confus', 'difficult', 'hard', 'don\'t understand', 'unclear',
        'frustrated', 'impossible', 'wrong', 'bad', 'hate', 'terrible',
        'not clear', 'too hard', 'can\'t', 'cannot'
    ]
    
    # Positive keywords
    positive_words = [
        'easy', 'fun', 'like', 'good', 'great', 'understand', 'clear',
        'enjoy', 'love', 'helpful', 'excellent', 'perfect'
    ]
    
    # Count matches
    negative_count = sum(1 for word in negative_words if word in text_lower)
    positive_count = sum(1 for word in positive_words if word in text_lower)
    
    # Calculate simple sentiment score
    if negative_count + positive_count == 0:
        return 0.0, False
    
    sentiment_score = (positive_count - negative_count) / (positive_count + negative_count)
    confusion_flag = sentiment_score < -0.3
    
    return sentiment_score, confusion_flag


def analyze_feedback(text: str) -> Tuple[float, bool]:
    """
    Analyze free-text feedback using DistilBERT for sentiment analysis.
    Falls back to simple rule-based analysis if transformers are not available.
    
    Returns:
    - sentiment_score: between -1.0 (very negative) and +1.0 (very positive)
    - confusion_flag: True if sentiment is negative (suggests confusion/difficulty)
    """
    if not text:
        return 0.0, False

    # Try to load and use DistilBERT
    if TRANSFORMERS_AVAILABLE and _load_transformer():
        try:
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
        except Exception as e:
            print(f"⚠️ DistilBERT inference failed: {e}, using simple analysis")
            return _simple_sentiment_analysis(text)
    else:
        # Fallback to simple rule-based analysis
        return _simple_sentiment_analysis(text)


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
    model_name = os.getenv("OLLAMA_MODEL", "llama3.2")  # or "mistral", "gemma2", "qwen2.5", etc.
    
    # Build a much more explicit prompt for neurodiverse learners
    neurotype_context = {
        "Dyslexia": "Use simple words, short sentences, and avoid complex spelling. Break down instructions into clear steps.",
        "ADHD": "Use direct, action-oriented language. Be very clear and concise. Remove unnecessary words.",
        "ASD": "Use literal language, avoid metaphors or idioms. Be explicit and step-by-step.",
        "unknown": "Use simple, clear language suitable for a young learner."
    }
    
    neuro_guidance = neurotype_context.get(req.neuroType or "unknown", neurotype_context["unknown"])
    
    # More direct, example-based prompt that works better with smaller models
    prompt_parts = [
        "Task: Simplify this question for a 6-8 year old child.",
        f"Child's needs: {req.neuroType or 'learning differences'}. {neuro_guidance}",
        "",
        "RULES:",
        "- DO NOT copy the original question",
        "- Use simpler words: 'match' → 'find' or 'pick', 'correct' → 'right'",
        "- Make sentences shorter",
        "",
        "EXAMPLES:",
        "  'Match the picture to the correct word' → 'Find the word that goes with the picture'",
        "  'Select the right answer' → 'Pick the right answer'",
        "  'Identify the object' → 'Find the object'",
        "",
        f"Original: {req.question}",
        "",
        "Simplified (write ONLY the simplified version, nothing else):"
    ]
    
    if req.confusionFlag:
        prompt_parts.insert(3, "⚠️ The student is confused and needs extra help. Simplify even more!")
    
    if req.options:
        prompt_parts.append("")
        prompt_parts.append("Options (you can simplify these too):")
        for i, opt in enumerate(req.options):
            prompt_parts.append(f"{chr(65+i)}. {opt}")
    
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
        simplified_text = raw_response.strip()
        
        # Remove common markers and prefixes
        markers = [
            "Simplified question:",
            "Simplified question (write ONLY the simplified version, nothing else):",
            "Here's the simplified version:",
            "Simplified version:",
            "Here's a simpler version:",
            "The simplified question is:",
            "Simplified:",
        ]
        for marker in markers:
            if marker in simplified_text:
                parts = simplified_text.split(marker, 1)
                if len(parts) > 1:
                    simplified_text = parts[1].strip()
                    break
        
        # Remove the original question if it appears anywhere in the response
        if req.question in simplified_text:
            # Try to extract text that comes AFTER the original question
            parts = simplified_text.split(req.question, 1)
            if len(parts) > 1 and parts[1].strip():
                simplified_text = parts[1].strip()
            # Or try to extract text that comes BEFORE the original question
            elif len(parts) > 0 and parts[0].strip() and parts[0] != req.question:
                simplified_text = parts[0].strip()
            # If original question is the whole response, try to find any different text
            else:
                # Split by newlines and find the first line that's different
                lines = simplified_text.split("\n")
                for line in lines:
                    line = line.strip()
                    if line and line != req.question and len(line) > 10:
                        # Check if this line is substantially different (not just a substring)
                        if (line.lower() != req.question.lower() and 
                            req.question.lower() not in line.lower() and
                            line.lower() not in req.question.lower()):
                            simplified_text = line
                            break
        
        # Clean up common prefixes/suffixes
        prefixes_to_remove = [
            "Here's",
            "Here is",
            "The simplified question is",
            "Simplified:",
            "Answer:",
        ]
        for prefix in prefixes_to_remove:
            if simplified_text.lower().startswith(prefix.lower()):
                simplified_text = simplified_text[len(prefix):].strip()
                # Remove leading colon or dash
                if simplified_text.startswith((":", "-", "—")):
                    simplified_text = simplified_text[1:].strip()
        
        # Remove any leading/trailing quotes
        simplified_text = simplified_text.strip('"\'')
        
        # Final validation - if it's still the same as original, try harder
        if simplified_text.strip().lower() == req.question.strip().lower() or len(simplified_text.strip()) < 10:
            print(f"⚠️ Ollama response seems unchanged. Raw: {raw_response[:300]}")
            # Try to extract any sentence that's different from the original
            sentences = raw_response.replace("\n", " ").split(".")
            for sentence in sentences:
                sentence = sentence.strip()
                if (sentence and 
                    len(sentence) > 15 and  # Must be substantial
                    sentence.lower() != req.question.lower() and 
                    req.question.lower() not in sentence.lower() and
                    sentence.lower() not in req.question.lower()):
                    # This looks like a different sentence
                    simplified_text = sentence
                    break
            
            # If STILL no good result, create a more aggressive fallback
            if simplified_text.strip().lower() == req.question.strip().lower() or len(simplified_text.strip()) < 10:
                print(f"⚠️ Ollama fallback triggered - original: '{req.question}'")
                # Create a more aggressive simplification by replacing common complex words
                fallback = req.question
                
                # More comprehensive replacements (order matters - longer phrases first)
                replacements = [
                    ("match the picture to the correct word", "find the word that goes with the picture"),
                    ("match the picture", "find the word for the picture"),
                    ("match", "pick"),
                    ("select", "choose"),
                    ("identify", "find"),
                    ("determine", "figure out"),
                    ("click", "tap"),
                    ("correct", "right"),
                    ("the correct", "the right"),
                    ("to the", "for the"),
                ]
                
                # Apply replacements (case-insensitive)
                fallback_lower = fallback.lower()
                for old, new_word in replacements:
                    if old in fallback_lower:
                        # Find the position and replace with proper case
                        idx = fallback_lower.find(old)
                        if idx >= 0:
                            # Try to preserve capitalization of first letter
                            before = fallback[:idx]
                            after = fallback[idx + len(old):]
                            # Capitalize if it's at the start of sentence
                            if idx == 0 or (idx > 0 and fallback[idx-1] in '.!?'):
                                new_word_capitalized = new_word[0].upper() + new_word[1:] if len(new_word) > 0 else new_word
                            else:
                                new_word_capitalized = new_word
                            fallback = before + new_word_capitalized + after
                            fallback_lower = fallback.lower()
                            break
                
                # If still unchanged, try a more aggressive rewrite
                if fallback.strip().lower() == req.question.strip().lower():
                    # For "Match the picture to the correct word" type questions
                    if "match" in fallback_lower and "picture" in fallback_lower and "word" in fallback_lower:
                        simplified_text = "Find the word that goes with the picture."
                    elif "match" in fallback_lower:
                        simplified_text = fallback.replace("match", "pick").replace("Match", "Pick")
                    else:
                        simplified_text = f"Can you {fallback.lower()}?"
                else:
                    simplified_text = fallback
                
                print(f"✅ Ollama fallback result: '{simplified_text}'")
        
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

    # Build a much more explicit prompt for neurodiverse learners
    neurotype_context = {
        "Dyslexia": "Use simple words, short sentences, and avoid complex spelling. Break down instructions into clear steps.",
        "ADHD": "Use direct, action-oriented language. Be very clear and concise. Remove unnecessary words.",
        "ASD": "Use literal language, avoid metaphors or idioms. Be explicit and step-by-step.",
        "unknown": "Use simple, clear language suitable for a young learner."
    }
    
    neuro_guidance = neurotype_context.get(req.neuroType or "unknown", neurotype_context["unknown"])
    
    prompt_parts = [
        "You are a teacher helping a neurodiverse child understand a question.",
        f"The child has: {req.neuroType or 'learning differences'}.",
        f"Guidance: {neuro_guidance}",
        "",
        "CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE:",
        "1. You MUST rewrite the question in MUCH simpler language. DO NOT repeat the original question.",
        "2. Use words a 6-8 year old would understand.",
        "3. Break long sentences into shorter ones.",
        "4. Replace complex words with simple ones:",
        "   - 'match' → 'pick' or 'find' or 'choose'",
        "   - 'select' → 'choose' or 'pick'",
        "   - 'identify' → 'find' or 'point to'",
        "   - 'determine' → 'figure out'",
        "   - 'correct' → 'right'",
        "5. DO NOT copy the original question word-for-word. You MUST create a NEW, simpler version.",
        "6. If the question says 'Match the picture to the correct word', rewrite it as 'Find the word that goes with the picture' or 'Pick the word that matches the picture'.",
        "7. Keep the meaning the same, but use simpler words and shorter sentences.",
        "",
        f"Original question: {req.question}",
        "",
        "IMPORTANT: Write ONLY the simplified question. Do NOT include the original question. Do NOT say 'Here is the simplified version:' or similar. Just write the simplified question directly.",
        "",
        "Simplified question:"
    ]
    
    if req.confusionFlag:
        prompt_parts.insert(3, "⚠️ The student is confused and needs extra help. Simplify even more!")
    
    if req.options:
        prompt_parts.append("")
        prompt_parts.append("Options (you can simplify these too):")
        for i, opt in enumerate(req.options):
            prompt_parts.append(f"{chr(65+i)}. {opt}")

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
        # Remove common markers first
        markers = [
            "Simplified question (write ONLY the simplified version, nothing else):",
            "Simplified question:",
            "Here's the simplified version:",
            "Simplified version:",
            "Here's a simpler version:",
            "The simplified question is:",
            "Simplified:",
        ]
        for marker in markers:
            if marker in simplified_text:
                parts = simplified_text.split(marker, 1)
                if len(parts) > 1:
                    simplified_text = parts[1].strip()
                    break
        
        # Remove the original question if it appears anywhere
        if req.question in simplified_text:
            # Try to extract text that comes AFTER the original question
            parts = simplified_text.split(req.question, 1)
            if len(parts) > 1 and parts[1].strip():
                simplified_text = parts[1].strip()
            # Or try to extract text that comes BEFORE the original question
            elif len(parts) > 0 and parts[0].strip() and parts[0] != req.question:
                simplified_text = parts[0].strip()
            # If original question is the whole response, try to find any different text
            else:
                # Split by newlines and find the first line that's different
                lines = simplified_text.split("\n")
                for line in lines:
                    line = line.strip()
                    if line and line != req.question and len(line) > 10:
                        # Check if this line is substantially different
                        if (line.lower() != req.question.lower() and 
                            req.question.lower() not in line.lower() and
                            line.lower() not in req.question.lower()):
                            simplified_text = line
                            break
        
        # Remove common prefixes
        prefixes = ["Here's", "Here is", "Simplified:", "The simplified question is:", "Answer:"]
        for prefix in prefixes:
            if simplified_text.lower().startswith(prefix.lower()):
                simplified_text = simplified_text[len(prefix):].strip()
                # Remove leading colon or dash if present
                if simplified_text.startswith((":", "-", "—")):
                    simplified_text = simplified_text[1:].strip()
        
        # Remove any leading/trailing quotes
        simplified_text = simplified_text.strip('"\'')
        
        # Final check - if it's still the same, try harder to find different text
        if simplified_text.strip() == req.question or len(simplified_text.strip()) < 10:
            print(f"Warning: Simplified text is same as original. Trying to extract different text...")
            # Try to extract any sentence that's different from the original
            raw_text = simplified_text if simplified_text else candidate["content"]["parts"][0].get("text", "")
            sentences = raw_text.replace("\n", " ").split(".")
            for sentence in sentences:
                sentence = sentence.strip()
                if (sentence and 
                    len(sentence) > 15 and  # Must be substantial
                    sentence.lower() != req.question.lower() and 
                    req.question.lower() not in sentence.lower() and
                    sentence.lower() not in req.question.lower()):
                    # This looks like a different sentence
                    simplified_text = sentence
                    break
            
            # If STILL no good result, create a more aggressive fallback
            if simplified_text.strip().lower() == req.question.strip().lower() or len(simplified_text.strip()) < 10:
                print(f"⚠️ Gemini fallback triggered - original: '{req.question}'")
                # Create a more aggressive simplification by replacing common complex words
                fallback = req.question
                
                # More comprehensive replacements (order matters - longer phrases first)
                replacements = [
                    ("match the picture to the correct word", "find the word that goes with the picture"),
                    ("match the picture", "find the word for the picture"),
                    ("match", "pick"),
                    ("select", "choose"),
                    ("identify", "find"),
                    ("determine", "figure out"),
                    ("click", "tap"),
                    ("correct", "right"),
                    ("the correct", "the right"),
                    ("to the", "for the"),
                ]
                
                # Apply replacements (case-insensitive)
                fallback_lower = fallback.lower()
                for old, new_word in replacements:
                    if old in fallback_lower:
                        # Find the position and replace with proper case
                        idx = fallback_lower.find(old)
                        if idx >= 0:
                            # Try to preserve capitalization of first letter
                            before = fallback[:idx]
                            after = fallback[idx + len(old):]
                            # Capitalize if it's at the start of sentence
                            if idx == 0 or (idx > 0 and fallback[idx-1] in '.!?'):
                                new_word_capitalized = new_word[0].upper() + new_word[1:] if len(new_word) > 0 else new_word
                            else:
                                new_word_capitalized = new_word
                            fallback = before + new_word_capitalized + after
                            fallback_lower = fallback.lower()
                            break
                
                # If still unchanged, try a more aggressive rewrite
                if fallback.strip().lower() == req.question.strip().lower():
                    # For "Match the picture to the correct word" type questions
                    if "match" in fallback_lower and "picture" in fallback_lower and "word" in fallback_lower:
                        simplified_text = "Find the word that goes with the picture."
                    elif "match" in fallback_lower:
                        simplified_text = fallback.replace("match", "pick").replace("Match", "Pick")
                    else:
                        simplified_text = f"Can you {fallback.lower()}?"
                else:
                    simplified_text = fallback
                
                print(f"✅ Gemini fallback result: '{simplified_text}'")
        
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
        
        # Handle quota exceeded gracefully - apply fallback simplification
        if status_code == 429:
            print("⚠️ Quota exceeded - applying fallback simplification")
            # Apply the same fallback logic as in Ollama function
            fallback = req.question
            replacements = [
                ("match the picture to the correct word", "find the word that goes with the picture"),
                ("match the picture", "find the word for the picture"),
                ("match", "pick"),
                ("select", "choose"),
                ("identify", "find"),
                ("determine", "figure out"),
                ("click", "tap"),
                ("correct", "right"),
                ("the correct", "the right"),
                ("to the", "for the"),
            ]
            fallback_lower = fallback.lower()
            for old, new_word in replacements:
                if old in fallback_lower:
                    idx = fallback_lower.find(old)
                    if idx >= 0:
                        before = fallback[:idx]
                        after = fallback[idx + len(old):]
                        if idx == 0 or (idx > 0 and fallback[idx-1] in '.!?'):
                            new_word_capitalized = new_word[0].upper() + new_word[1:] if len(new_word) > 0 else new_word
                        else:
                            new_word_capitalized = new_word
                        fallback = before + new_word_capitalized + after
                        fallback_lower = fallback.lower()
                        break
            if fallback.strip().lower() == req.question.strip().lower():
                if "match" in fallback_lower and "picture" in fallback_lower and "word" in fallback_lower:
                    fallback = "Find the word that goes with the picture."
                elif "match" in fallback_lower:
                    fallback = fallback.replace("match", "pick").replace("Match", "Pick")
            print(f"✅ Fallback result: '{fallback}'")
            return fallback, req.options
        
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
