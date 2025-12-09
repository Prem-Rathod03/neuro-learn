import { useCallback } from 'react';

/**
 * Hook for Text-to-Speech functionality
 * Used to support learners with Dyslexia by reading words aloud on hover/focus
 */
export function useTextToSpeech() {
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; // Normal speed (was 0.9 - too slow)
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Maximum volume

    // Try to use a clear, natural-sounding voice
    // Wait for voices to load if needed
    const getVoices = () => {
      return window.speechSynthesis.getVoices();
    };
    
    let voices = getVoices();
    if (voices.length === 0) {
      // Voices might not be loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        voices = getVoices();
      };
    }
    
    // Prefer natural, clear voices (avoid robotic/whisper voices)
    const preferredVoice = voices.find(
      (voice) =>
        (voice.name.includes('Samantha') || // macOS natural voice
         voice.name.includes('Alex') ||      // macOS natural voice
         voice.name.includes('Karen') ||     // macOS natural voice
         voice.name.includes('Google') ||    // Chrome natural voice
         voice.name.includes('Microsoft') || // Windows natural voice
         voice.name.includes('Zira') ||      // Windows natural voice
         voice.name.includes('David')) &&    // Windows natural voice
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

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}

