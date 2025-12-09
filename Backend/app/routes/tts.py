"""
Text-to-Speech API endpoint
Converts text to audio files for download
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import io
import os

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    rate: Optional[float] = 0.9
    pitch: Optional[float] = 1.0
    volume: Optional[float] = 1.0
    voice: Optional[str] = None  # Voice name or language code


@router.post("/tts/generate")
async def generate_audio(request: TTSRequest):
    """
    Generate audio file from text using a TTS service.
    
    Options:
    1. Use pyttsx3 (offline, requires system TTS)
    2. Use gTTS (Google TTS, requires internet)
    3. Use cloud APIs (Google Cloud, AWS Polly, etc.)
    
    Currently returns a placeholder - implement based on your needs.
    """
    try:
        # Option 1: Use pyttsx3 (offline, system voices)
        try:
            import pyttsx3
            
            engine = pyttsx3.init()
            engine.setProperty('rate', int(request.rate * 100))  # pyttsx3 uses 0-200
            engine.setProperty('volume', request.volume)
            
            # Save to buffer
            audio_buffer = io.BytesIO()
            temp_file = "/tmp/tts_output.wav"
            engine.save_to_file(request.text, temp_file)
            engine.runAndWait()
            
            # Read the file
            with open(temp_file, 'rb') as f:
                audio_data = f.read()
            
            os.remove(temp_file)  # Clean up
            
            return StreamingResponse(
                io.BytesIO(audio_data),
                media_type="audio/wav",
                headers={
                    "Content-Disposition": f"attachment; filename=speech.wav"
                }
            )
        except ImportError:
            # Option 2: Use gTTS (Google TTS, requires internet)
            try:
                from gtts import gTTS
                
                tts = gTTS(text=request.text, lang='en', slow=False)
                audio_buffer = io.BytesIO()
                tts.write_to_fp(audio_buffer)
                audio_buffer.seek(0)
                
                return StreamingResponse(
                    audio_buffer,
                    media_type="audio/mpeg",
                    headers={
                        "Content-Disposition": f"attachment; filename=speech.mp3"
                    }
                )
            except ImportError:
                # Option 3: Return error with instructions
                raise HTTPException(
                    status_code=501,
                    detail="TTS service not configured. Install pyttsx3 (pip install pyttsx3) or gTTS (pip install gtts)"
                )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"TTS generation failed: {str(e)}"
        )


@router.get("/tts/voices")
async def get_available_voices():
    """
    Get list of available TTS voices (if using pyttsx3)
    """
    try:
        import pyttsx3
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        
        voice_list = []
        for voice in voices:
            voice_list.append({
                "id": voice.id,
                "name": voice.name,
                "gender": getattr(voice, 'gender', 'unknown'),
                "languages": getattr(voice, 'languages', [])
            })
        
        return {"voices": voice_list}
    except ImportError:
        return {
            "voices": [],
            "message": "pyttsx3 not installed. Install with: pip install pyttsx3"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting voices: {str(e)}"
        )

