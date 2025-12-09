import { Module } from '@/data/mockData';
import { ProgressBar } from './ProgressBar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard = ({ module }: ModuleCardProps) => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/module/${module.id}/activity/1`);
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="text-5xl">{module.icon}</div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold mb-1">{module.title}</h3>
            <p className="text-muted-foreground text-sm">{module.description}</p>
          </div>

          <ProgressBar
            progress={module.progress}
            color={module.color as any}
            size="md"
            showLabel
          />

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {module.activitiesCompleted} / {module.totalActivities} activities
            </div>
            <Button onClick={handleStart} size="lg" className="gap-2">
              {module.progress > 0 ? 'Continue' : 'Start'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
