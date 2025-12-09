import { Badge } from '@/data/mockData';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard = ({ badge }: BadgeCardProps) => {
  return (
    <Card
      className={cn(
        'p-6 text-center transition-all duration-300',
        badge.earned
          ? 'shadow-card hover:shadow-elevated hover:-translate-y-1 bg-gradient-to-br from-reward-soft to-reward-soft/50'
          : 'opacity-50 grayscale'
      )}
    >
      <div className="text-5xl mb-3">{badge.icon}</div>
      <h3 className="font-semibold mb-2">{badge.title}</h3>
      <p className="text-sm text-muted-foreground">{badge.description}</p>
      {badge.earned && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-success">
          ✓ Earned
        </div>
      )}
    </Card>
  );
};
