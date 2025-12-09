/**
 * ActivityRenderer - Renders different activity types based on ActivityItem schema
 * Handles: image_to_word, one_step_instruction, counting, focus_filter, etc.
 */

import React from 'react';
import { ActivityItem, ActivityOption } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WordOption from '@/components/WordOption';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ActivityRendererProps {
  activity: ActivityItem;
  selectedAnswers: string[];
  onSelectAnswer: (optionId: string) => void;
  onSelectMultiple?: (optionId: string) => void; // For focus_filter activities
}

export const ActivityRenderer: React.FC<ActivityRendererProps> = ({
  activity,
  selectedAnswers,
  onSelectAnswer,
  onSelectMultiple,
}) => {
  const { user } = useAuth();
  const { speak } = useTextToSpeech();

  // Check neuroFlags for feature toggles
  const hasDyslexia = user?.neuroFlags?.includes('Dyslexia') || user?.neurodiversityTags?.includes('Dyslexia');
  const hasADHD = user?.neuroFlags?.includes('ADHD') || user?.neurodiversityTags?.includes('ADHD');

  // Determine if options are single words (for TTS support)
  const areWordOptions = activity.options.every(opt => 
    opt.label.split(/\s+/).length === 1 && /^[A-Za-z]+$/i.test(opt.label.trim())
  );

  // Render stimulus (image, emoji, or description)
  const renderStimulus = () => {
    if (activity.stimulusImageUrl) {
      return (
        <div className="flex justify-center mb-6">
          <img
            src={activity.stimulusImageUrl}
            alt={activity.stimulusImageAlt || activity.stimulusDescription || 'Activity image'}
            className="max-w-md rounded-lg shadow-md"
            onLoad={() => {
              // Auto-describe image for screen readers/TTS if needed
              if (activity.stimulusImageAlt && hasDyslexia) {
                // Optionally read image description
              }
            }}
          />
        </div>
      );
    }
    
    if (activity.stimulusEmoji) {
      return (
        <div className="text-center mb-6">
          <div className="text-8xl mb-2">{activity.stimulusEmoji}</div>
          {activity.stimulusDescription && (
            <p className="text-muted-foreground text-sm">{activity.stimulusDescription}</p>
          )}
        </div>
      );
    }

    return null;
  };

  // Render instruction with TTS support
  const renderInstruction = () => {
    const instructionText = activity.instructionTts || activity.instruction;
    
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">{activity.instruction}</h2>
        {activity.steps && activity.steps.length > 0 && (
          <div className="space-y-2">
            {activity.steps.map((step, idx) => (
              <p key={idx} className="text-lg text-muted-foreground">
                {step}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render options based on activity type
  const renderOptions = () => {
    const handleOptionClick = (option: ActivityOption) => {
      if (activity.type === 'focus_filter' && onSelectMultiple) {
        // For focus tasks, allow multiple selections
        onSelectMultiple(option.id);
      } else {
        // Single selection
        onSelectAnswer(option.id);
      }
    };

    const handleOptionHover = (option: ActivityOption) => {
      if (hasDyslexia && activity.accessibility.enableTtsOnHover) {
        const ttsText = option.ttsText || option.imageAlt || option.label;
        speak(ttsText);
      }
    };

    // For focus_filter, show all options in a grid
    if (activity.type === 'focus_filter') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activity.options.map((option) => {
            const isSelected = selectedAnswers.includes(option.id);
            const isCorrect = option.isCorrect;
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => handleOptionHover(option)}
                className={cn(
                  'p-6 rounded-xl border-2 transition-all duration-200',
                  'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary',
                  isSelected && isCorrect && 'bg-green-100 border-green-400',
                  isSelected && !isCorrect && 'bg-red-100 border-red-400',
                  !isSelected && 'bg-background border-border hover:border-primary'
                )}
                aria-label={option.ttsText || option.imageAlt || option.label}
              >
                {option.imageUrl ? (
                  <img
                    src={option.imageUrl}
                    alt={option.imageAlt || option.label}
                    className="w-full h-auto rounded"
                  />
                ) : (
                  <div className="text-4xl">{option.label}</div>
                )}
                {option.label && !option.imageUrl && option.label.length < 20 && (
                  <p className="mt-2 text-sm font-medium">{option.label}</p>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    // For word-based activities with Dyslexia support
    if (hasDyslexia && areWordOptions && activity.accessibility.enableTtsOnHover) {
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {activity.options.map((option) => (
            <WordOption
              key={option.id}
              word={option.label}
              onClick={() => handleOptionClick(option)}
              selected={selectedAnswers.includes(option.id)}
            />
          ))}
        </div>
      );
    }

    // Standard option rendering
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activity.options.map((option) => {
          const isSelected = selectedAnswers.includes(option.id);
          
          return (
            <Button
              key={option.id}
              variant={isSelected ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => handleOptionHover(option)}
              className={cn(
                'h-auto py-6 text-lg transition-all duration-200',
                isSelected && 'shadow-primary-glow'
              )}
            >
              {option.imageUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={option.imageUrl}
                    alt={option.imageAlt || option.label}
                    className="w-24 h-24 object-contain rounded"
                  />
                  <span>{option.label}</span>
                </div>
              ) : (
                <span>{option.label}</span>
              )}
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stimulus (image/emoji) */}
      {renderStimulus()}

      {/* Instruction */}
      {renderInstruction()}

      {/* Options */}
      {renderOptions()}
    </div>
  );
};

