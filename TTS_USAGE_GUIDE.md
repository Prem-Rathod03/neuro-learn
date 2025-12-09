# Text-to-Speech (TTS) Usage Guide

## Overview
Your NeuroPath app already has TTS functionality built-in using the browser's `SpeechSynthesis` API. This guide shows you how to use it and extend it.

## Current Implementation

### 1. Using the Hook (Recommended)

```typescript
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function MyComponent() {
  const { speak, stop } = useTextToSpeech();

  const handleReadAloud = () => {
    speak("Hello, this text will be read aloud!");
  };

  const handleStop = () => {
    stop(); // Stops any ongoing speech
  };

  return (
    <div>
      <button onClick={handleReadAloud}>Read Aloud</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}
```

### 2. Direct Usage (Without Hook)

```typescript
import { speakText, stopSpeech } from '@/utils/textToSpeechUtils';

// Simple usage
speakText("This text will be read aloud");

// With custom options
speakText("Custom speed and pitch", {
  rate: 0.8,    // Slower (0.1 - 10)
  pitch: 1.2,   // Higher pitch (0 - 2)
  volume: 0.9   // Volume (0 - 1)
});

// Stop speech
stopSpeech();
```

### 3. Where TTS is Currently Used

1. **WordOption Component** - Reads words on hover/focus for Dyslexia learners
2. **ActivityRenderer** - Auto-plays instructions when support boost is enabled
3. **LearningActivity** - "Repeat Instruction" button reads the question aloud

## Converting Text to Audio File

The browser's `SpeechSynthesis` API **cannot directly export audio files**. Here are your options:

### Option 1: Backend TTS Service (Recommended)

Create a backend endpoint that uses a TTS library (e.g., `gTTS`, `pyttsx3`, or cloud APIs):

**Backend (Python example):**
```python
# backend/app/routes/tts.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import pyttsx3
import io

router = APIRouter()

@router.post("/tts/generate")
async def generate_audio(text: str):
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)  # Speed
    engine.setProperty('volume', 1.0)
    
    # Generate audio
    audio_buffer = io.BytesIO()
    engine.save_to_file(text, audio_buffer)
    engine.runAndWait()
    
    audio_buffer.seek(0)
    return StreamingResponse(
        audio_buffer,
        media_type="audio/wav",
        headers={"Content-Disposition": f"attachment; filename=speech.wav"}
    )
```

**Frontend:**
```typescript
import { downloadAudioFromText } from '@/utils/textToSpeechUtils';

// Download audio file
await downloadAudioFromText(
  "Hello, this will be saved as an audio file",
  "my-speech.wav",
  "http://127.0.0.1:8030/api/tts/generate"
);
```

### Option 2: Cloud TTS APIs

Use services like:
- **Google Cloud Text-to-Speech**
- **Amazon Polly**
- **Azure Cognitive Services**
- **ElevenLabs** (high-quality voices)

**Example with Google Cloud TTS:**
```python
# backend/app/routes/tts.py
from google.cloud import texttospeech
import io

@router.post("/tts/generate")
async def generate_audio(text: str):
    client = texttospeech.TextToSpeechClient()
    
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    
    return StreamingResponse(
        io.BytesIO(response.audio_content),
        media_type="audio/mpeg"
    )
```

### Option 3: Client-Side Workaround (Limited)

For simple use cases, you can use the browser's `MediaRecorder` API, but it has limitations:

```typescript
// This is a workaround and may not work in all browsers
async function recordSpeech(text: string): Promise<Blob> {
  // Requires additional setup with Web Audio API
  // See: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
  // Note: SpeechSynthesis output cannot be directly captured
}
```

## Quick Examples

### Example 1: Read Activity Instructions
```typescript
const { speak } = useTextToSpeech();

// Read instruction
speak(activity.instructionTts || activity.instruction);
```

### Example 2: Read Word on Hover
```typescript
const { speak } = useTextToSpeech();

<button
  onMouseEnter={() => speak("cat")}
  onFocus={() => speak("cat")}
>
  Cat
</button>
```

### Example 3: Custom Voice Selection
```typescript
import { speakText, getAvailableVoices } from '@/utils/textToSpeechUtils';

const voices = getAvailableVoices();
const childVoice = voices.find(v => v.name.includes('Child'));

speakText("Hello", {
  rate: 0.8,
  pitch: 1.1,
  voice: childVoice
});
```

### Example 4: Download Audio File (with backend)
```typescript
import { downloadAudioFromText } from '@/utils/textToSpeechUtils';

const handleDownload = async () => {
  await downloadAudioFromText(
    "This will be saved as an audio file",
    "lesson-instruction.wav",
    `${API_BASE_URL}/api/tts/generate`
  );
};
```

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Safari: Full support (iOS 7+)
- ✅ Firefox: Full support
- ⚠️ Some mobile browsers: Limited voice options

## Tips

1. **Always check for support:**
   ```typescript
   if ('speechSynthesis' in window) {
     // Safe to use TTS
   }
   ```

2. **Cancel previous speech before new:**
   ```typescript
   window.speechSynthesis.cancel();
   speak(newText);
   ```

3. **Wait for voices to load:**
   ```typescript
   window.speechSynthesis.onvoiceschanged = () => {
     const voices = window.speechSynthesis.getVoices();
     // Now voices are available
   };
   ```

4. **For audio files, use a backend service** - The browser API cannot export files directly.

## Need Help?

- Check `Frontend/src/hooks/useTextToSpeech.ts` for the current implementation
- See `Frontend/src/components/WordOption.tsx` for a usage example
- For audio file generation, implement a backend TTS service

