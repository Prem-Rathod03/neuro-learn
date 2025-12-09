import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Star, TrendingUp } from 'lucide-react';
import { getProgress, ProgressResponse } from '@/lib/api';

const Progress = () => {
  const [progress, setProgress] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getProgress();
      setProgress(data);
    })();
  }, []);

  if (!progress) {
    return <div className="p-8">Loading progress...</div>;
  }

  const overallPercent = Math.round(progress.overallAccuracy * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary" />
            Your Progress
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your learning journey and celebrate your achievements
          </p>
        </div>

        {/* Overall Stats */}
        <Card className="p-8 shadow-card bg-gradient-to-br from-primary-soft to-primary-soft/30 animate-in fade-in duration-700 delay-100">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">{overallPercent}%</div>
              <p className="text-muted-foreground">Overall Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold flex items-center justify-center gap-2 mb-2">
                <Star className="w-10 h-10 text-reward" fill="currentColor" />
                {progress.attempts}
              </div>
              <p className="text-muted-foreground">Total Attempts</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-success mb-2">
                {progress.attempts ? `${overallPercent}%` : '—'}
              </div>
              <p className="text-muted-foreground">Recent Performance</p>
            </div>
          </div>
        </Card>

        {/* Achievements Summary */}
        <Card className="p-6 shadow-card animate-in fade-in duration-700 delay-500">
          <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success-soft rounded-lg">
              <div className="text-2xl">✓</div>
              <div className="flex-1">
                <p className="font-medium">Completed {progress.attempts || 0} activities</p>
                <p className="text-sm text-muted-foreground">Keep the streak going!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-reward-soft rounded-lg">
              <div className="text-2xl">⭐</div>
              <div className="flex-1">
                <p className="font-medium">
                  Accuracy {progress.attempts ? `${overallPercent}%` : 'No attempts yet'}
                </p>
                <p className="text-sm text-muted-foreground">Every attempt counts toward mastery.</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Progress;
