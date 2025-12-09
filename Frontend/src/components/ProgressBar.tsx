import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// ============================================================================
// Original ProgressBar component for ModuleCard (with progress, color, size, showLabel)
// ============================================================================

interface ProgressBarProps {
  progress: number; // 0-100
  color?: 'primary' | 'success' | 'accent' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Original ProgressBar component used in ModuleCard
 * Shows module progress with color and size options
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className,
}) => {
  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorMap = {
    primary: 'bg-primary',
    success: 'bg-success',
    accent: 'bg-accent',
    warning: 'bg-warning',
    danger: 'bg-destructive',
  };

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <Progress value={progress} className={cn(heightMap[size])} />
    </div>
  );
};

// ============================================================================
// ADHDProgressBar component for ADHD learners (with current, total, label)
// ============================================================================

interface ADHDProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

/**
 * Progress bar component for ADHD learners
 * Shows visual progress to help maintain focus and engagement
 */
export const ADHDProgressBar: React.FC<ADHDProgressBarProps> = ({
  current,
  total,
  label = 'Progress',
  className,
}) => {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">
          {current} / {total}
        </span>
      </div>
      <Progress value={progress} className="h-3" />
    </div>
  );
};

// Default export for backward compatibility (exports the original ProgressBar)
export default ProgressBar;
