import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-7xl mb-4">🧠</div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NeuroPath
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Learning Paths Designed for Neurodiverse Students
          </p>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            A supportive, distraction-free environment where every student can learn at their own pace
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Card className="p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="text-5xl">👨‍🎓</div>
              <h2 className="text-2xl font-semibold">I'm a Student</h2>
              <p className="text-muted-foreground">
                Start your learning journey with activities designed just for you
              </p>
              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full gap-2"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5" />
                  Student Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Create Student Account
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="text-5xl">👨‍👩‍👧</div>
              <h2 className="text-2xl font-semibold">I'm a Parent/Teacher</h2>
              <p className="text-muted-foreground">
                Monitor progress and support your student's learning journey
              </p>
              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => navigate('/parent-dashboard')}
                  variant="secondary"
                  className="w-full gap-2"
                  size="lg"
                >
                  <Users className="w-5 h-5" />
                  Parent/Teacher View
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Demo access available
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <Card className="p-6 shadow-card animate-in fade-in duration-700 delay-300">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl">📋</div>
              <h3 className="font-semibold">Clear Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step guidance designed for clarity
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <h3 className="font-semibold">Focus Mode</h3>
              <p className="text-sm text-muted-foreground">
                Distraction-free learning environment
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">⭐</div>
              <h3 className="font-semibold">Rewards & Progress</h3>
              <p className="text-sm text-muted-foreground">
                Celebrate achievements and track growth
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
