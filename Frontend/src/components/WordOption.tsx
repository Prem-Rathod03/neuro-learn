import React from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface WordOptionProps {
  word: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

/**
 * WordOption component with TTS support for Dyslexia learners
 * Reads the word aloud on hover/focus if user has Dyslexia flag
 */
const WordOption: React.FC<WordOptionProps> = ({
  word,
  onClick,
  selected = false,
  className,
}) => {
  const { user } = useAuth();
  const { speak } = useTextToSpeech();

  // Check if user has Dyslexia flag
  const hasDyslexia =
    user?.neuroFlags?.includes('Dyslexia') ||
    user?.neurodiversityTags?.includes('Dyslexia');

  const handleMouseEnter = () => {
    if (hasDyslexia) {
      speak(word);
    }
  };

  const handleFocus = () => {
    if (hasDyslexia) {
      speak(word);
    }
  };

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onClick={onClick}
      className={cn(
        'px-4 py-2 m-2 rounded-xl border text-lg font-semibold',
        'hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400',
        'transition-colors duration-200',
        selected && 'bg-blue-200 border-blue-400 ring-2 ring-blue-400',
        className
      )}
      aria-label={hasDyslexia ? `${word} (will be read aloud)` : word}
    >
      {word}
    </button>
  );
};

export default WordOption;

