import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { ModuleCard } from '@/components/ModuleCard';
import { Card } from '@/components/ui/card';
import { modules, getTotalStars, getEarnedBadgesCount } from '@/data/mockData';
import { Star, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const totalStars = getTotalStars();
  const earnedBadges = getEarnedBadgesCount();

  // Show loading state while user is being loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">⏳</div>
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user, show error (shouldn't happen due to ProtectedRoute, but safety check)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-2xl font-semibold">Not logged in</h2>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to learn something new today?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4 animate-in fade-in duration-700 delay-100">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-reward-soft rounded-xl">
                <Star className="w-6 h-6 text-reward" fill="currentColor" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStars}</p>
                <p className="text-sm text-muted-foreground">Stars Earned</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success-soft rounded-xl">
                <Award className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{earnedBadges}</p>
                <p className="text-sm text-muted-foreground">Badges Unlocked</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-soft rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {modules.reduce((acc, m) => acc + m.activitiesCompleted, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Activities Done</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Plan */}
        <Card className="p-6 shadow-card bg-gradient-to-br from-primary-soft to-primary-soft/30 animate-in fade-in duration-700 delay-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                📅 Today's Plan
              </h2>
              <p className="text-muted-foreground">
                Complete 1 activity from each module to earn bonus stars!
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/progress')}
              className="hidden md:flex"
            >
              View Progress
            </Button>
          </div>
        </Card>

        {/* Learning Modules */}
        <div className="space-y-4 animate-in fade-in duration-700 delay-300">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Learning Modules</h2>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 shadow-card animate-in fade-in duration-700 delay-400">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/rewards')}
              className="gap-2"
            >
              <Award className="w-4 h-4" />
              View Rewards
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/progress')}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              See Detailed Progress
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
