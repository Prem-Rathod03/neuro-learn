/**
 * ADHD Break Modal - Enforced focus break for ADHD learners
 * Shows when consecutiveWrong >= 3 or wrongInLast5 >= 4
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface ADHDBreakModalProps {
  open: boolean;
  onComplete: () => void;
  durationSeconds?: number;
}

export const ADHDBreakModal: React.FC<ADHDBreakModalProps> = ({
  open,
  onComplete,
  durationSeconds = 60,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [currentTask, setCurrentTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([false, false, false]);

  const microTasks = [
    { id: 0, name: 'Stretch your arms', emoji: '🤸' },
    { id: 1, name: 'Blink 10 times', emoji: '👁️' },
    { id: 2, name: 'Look away from screen', emoji: '👀' },
  ];

  useEffect(() => {
    if (!open) {
      setTimeRemaining(durationSeconds);
      setCompletedTasks([false, false, false]);
      setCurrentTask(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-advance tasks every 20 seconds
    const taskInterval = setInterval(() => {
      setCurrentTask((prev) => {
        if (prev < microTasks.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 20000);

    return () => {
      clearInterval(interval);
      clearInterval(taskInterval);
    };
  }, [open, durationSeconds]);

  const handleTaskComplete = (taskId: number) => {
    setCompletedTasks((prev) => {
      const newTasks = [...prev];
      newTasks[taskId] = true;
      return newTasks;
    });
  };

  const progress = ((durationSeconds - timeRemaining) / durationSeconds) * 100;
  const allTasksComplete = completedTasks.every((task) => task);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md" 
        onEscapeKeyDown={(e) => e.preventDefault()} 
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Great effort! Let's take a brain break
        </DialogTitle>
        <DialogDescription className="text-center text-lg">
          Taking a short break helps reset your focus. We'll be back in a moment!
        </DialogDescription>

        <div className="space-y-6 py-4">
          {/* Timer with breathing animation */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Breathing circle */}
              <div
                className="absolute w-24 h-24 rounded-full bg-primary/20 animate-pulse"
                style={{
                  animation: 'breathe 3s ease-in-out infinite',
                }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <Clock className="w-8 h-8 text-primary mb-2" />
                <span className="text-3xl font-bold">{timeRemaining}s</span>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Micro tasks */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-center">Quick activities:</h3>
            {microTasks.map((task, idx) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  idx === currentTask
                    ? 'border-primary bg-primary/10'
                    : completedTasks[idx]
                    ? 'border-green-500 bg-green-50'
                    : 'border-border bg-background'
                }`}
              >
                <span className="text-2xl">{task.emoji}</span>
                <span className="flex-1 text-sm">{task.name}</span>
                {completedTasks[idx] ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTaskComplete(task.id)}
                    disabled={idx !== currentTask}
                  >
                    Done
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Continue button (disabled until timer ends) */}
          <Button
            size="lg"
            className="w-full"
            onClick={onComplete}
            disabled={timeRemaining > 0}
          >
            {timeRemaining > 0
              ? `Continue in ${timeRemaining}s...`
              : allTasksComplete
              ? "Nice reset! Let's continue"
              : "Continue"}
          </Button>
        </div>

        <style jsx>{`
          @keyframes breathe {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.6;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

