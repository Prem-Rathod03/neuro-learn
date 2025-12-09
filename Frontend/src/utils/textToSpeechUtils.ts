/**
 * Text-to-Speech Utilities
 * Extended utilities for TTS functionality including audio file export
 */

/**
 * Convert text to speech and play it (existing functionality)
 */
export function speakText(text: string, options?: {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate ?? 1.0; // Normal speed (was 0.9)
  utterance.pitch = options?.pitch ?? 1.0; // Normal pitch
  utterance.volume = options?.volume ?? 1.0; // Maximum volume

  if (options?.voice) {
    utterance.voice = options.voice;
  } else {
    // Try to find a natural, clear voice (avoid whisper/robotic voices)
    const getVoices = () => {
      return window.speechSynthesis.getVoices();
    };
    
    let voices = getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = getVoices();
      };
    }
    
    // Prefer natural, clear voices
    const preferredVoice = voices.find(
      (voice) =>
        (voice.name.includes('Samantha') ||
         voice.name.includes('Alex') ||
         voice.name.includes('Karen') ||
         voice.name.includes('Google') ||
         voice.name.includes('Microsoft') ||
         voice.name.includes('Zira') ||
         voice.name.includes('David')) &&
        voice.lang.startsWith('en') &&
        !voice.name.toLowerCase().includes('whisper') &&
        !voice.name.toLowerCase().includes('compact')
    ) || voices.find(
      (voice) =>
        voice.lang.startsWith('en') &&
        !voice.name.toLowerCase().includes('whisper') &&
        !voice.name.toLowerCase().includes('compact') &&
        voice.default !== false
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Get available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Convert text to audio file using Web Speech API + MediaRecorder
 * Note: This requires a backend service or Web Audio API workaround
 * as the browser's SpeechSynthesis API doesn't directly support audio export
 */
export async function textToAudioFile(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    format?: 'wav' | 'mp3';
  }
): Promise<Blob | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  // Method 1: Using Web Audio API to capture SpeechSynthesis output
  // This is a workaround since SpeechSynthesis doesn't directly support recording
  return new Promise((resolve) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        resolve(blob);
      };

      // Start recording
      mediaRecorder.start();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate ?? 0.9;
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      // Note: This method has limitations - SpeechSynthesis output
      // cannot be directly captured. For production, use a backend TTS service.

      // Fallback: Use a backend API for TTS audio generation
      resolve(null);
    } catch (error) {
      console.error('Error creating audio file:', error);
      resolve(null);
    }
  });
}

/**
 * Download audio file from text
 * Uses a backend API endpoint to generate audio
 */
export async function downloadAudioFromText(
  text: string,
  filename: string = 'speech.wav',
  apiEndpoint?: string
): Promise<void> {
  if (apiEndpoint) {
    // Use backend TTS API
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  } else {
    console.warn('No API endpoint provided. Use a backend TTS service for audio file generation.');
  }
}

