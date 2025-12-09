/**
 * Example component showing how to use Text-to-Speech
 * This demonstrates both real-time speech and audio file download
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { downloadAudioFromText } from '@/utils/textToSpeechUtils';
import { Volume2, Download, Square } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8030';

export const TTSExample: React.FC = () => {
  const [text, setText] = useState('Hello! This is an example of text-to-speech.');
  const [isDownloading, setIsDownloading] = useState(false);
  const { speak, stop } = useTextToSpeech();

  const handleSpeak = () => {
    if (text.trim()) {
      speak(text);
    }
  };

  const handleDownload = async () => {
    if (!text.trim()) {
      alert('Please enter some text first');
      return;
    }

    setIsDownloading(true);
    try {
      await downloadAudioFromText(
        text,
        'speech.wav',
        `${API_BASE_URL}/api/tts/generate`
      );
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Failed to download audio. Make sure the backend TTS service is configured.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Text-to-Speech Example</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Enter text to convert:</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          rows={4}
          className="w-full"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSpeak} className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Read Aloud
        </Button>

        <Button onClick={stop} variant="outline" className="flex items-center gap-2">
          <Square className="w-4 h-4" />
          Stop
        </Button>

        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Download Audio'}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>• <strong>Read Aloud:</strong> Plays the text using your browser's TTS</p>
        <p>• <strong>Stop:</strong> Stops any ongoing speech</p>
        <p>• <strong>Download Audio:</strong> Generates and downloads an audio file (requires backend TTS service)</p>
      </div>
    </div>
  );
};

