import { NeurodiversityTag } from '@/contexts/AuthContext';

interface NeurodiversityBadgeProps {
  tag: NeurodiversityTag;
  size?: 'sm' | 'md' | 'lg';
}

const tagColors: Record<NeurodiversityTag, string> = {
  ADHD: 'bg-primary-soft text-primary',
  Autism: 'bg-success-soft text-success',
  Dyslexia: 'bg-accent-soft text-accent',
  Multiple: 'bg-reward-soft text-reward-foreground',
  Other: 'bg-secondary text-secondary-foreground',
};

const tagIcons: Record<NeurodiversityTag, string> = {
  ADHD: '⚡',
  Autism: '🧩',
  Dyslexia: '📖',
  Multiple: '🌈',
  Other: '✨',
};

export const NeurodiversityBadge = ({ tag, size = 'md' }: NeurodiversityBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${tagColors[tag]} ${sizeClasses[size]}`}
    >
      <span>{tagIcons[tag]}</span>
      <span>{tag}</span>
    </span>
  );
};
