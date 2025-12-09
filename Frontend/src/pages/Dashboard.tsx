import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { ModuleCard } from '@/components/ModuleCard';
import { Card } from '@/components/ui/card';
import { modules as mockModules, getTotalStars, getEarnedBadgesCount } from '@/data/mockData';
import { Star, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getModuleProgress } from '@/lib/api';
import type { Module } from '@/data/mockData';
import { getAllModuleProgress } from '@/utils/progressStorage';
import { getActivitiesByModule } from '@/data/activityItems';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [modulesLoading, setModulesLoading] = useState(true);

  // Fetch real progress from backend AND localStorage
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !user.email) return;
      
      try {
        // Get total activities count from local data
        const totalActivities = {
          M1: getActivitiesByModule('M1').length,
          M2: getActivitiesByModule('M2').length,
          M3: getActivitiesByModule('M3').length,
        };
        
        // Get progress from localStorage (most accurate - reflects actual saved progress)
        console.log('Dashboard: Fetching progress for user:', user.email);
        console.log('Dashboard: Total activities:', totalActivities);
        
        const localStorageProgress = getAllModuleProgress(user.email, totalActivities);
        console.log('Dashboard: localStorage progress:', localStorageProgress);
        
        // Try to get backend progress (for fallback or additional data)
        let backendProgress = null;
        try {
          const storedUser = localStorage.getItem('neuropath_user');
          let userId: string | undefined;
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              userId = userData._id || userData.id;
            } catch (e) {
              // Ignore parse errors
            }
          }
          backendProgress = await getModuleProgress(userId);
        } catch (error) {
          console.log('Backend progress unavailable, using localStorage only');
        }
        
        // Map backend module IDs (M1, M2, M3) to frontend module IDs (module-1, module-2, module-3)
        const updatedModules = mockModules.map((module) => {
          const moduleNum = module.id.replace('module-', '');
          const backendModuleId = `M${moduleNum}` as 'M1' | 'M2' | 'M3';
          
          // Use localStorage progress (most accurate)
          const localProgress = localStorageProgress[backendModuleId];
          
          // Always use frontend total activities (correct count)
          const correctTotal = totalActivities[backendModuleId];
          
          // Use localStorage completed count, or 0 if no progress saved
          const completedCount = localProgress?.completed || 0;
          
          // Calculate progress percentage
          const progressPercent = correctTotal > 0 
            ? Math.min((completedCount / correctTotal) * 100, 100)
            : 0;
          
          console.log(`Module ${backendModuleId}: ${completedCount}/${correctTotal} (${progressPercent.toFixed(1)}%)`);
          
          return {
            ...module,
            progress: Math.round(progressPercent * 10) / 10, // Round to 1 decimal
            activitiesCompleted: completedCount,
            totalActivities: correctTotal, // Always use frontend total
          };
        });
        
        setModules(updatedModules);
      } catch (error) {
        console.error('Failed to fetch module progress:', error);
        // Keep default modules (with 0 progress)
      } finally {
        setModulesLoading(false);
      }
    };

    if (!loading && user) {
      fetchProgress();
    }
  }, [user, loading]);

  const totalStars = modules.reduce((acc, m) => acc + m.activitiesCompleted * 3, 0);
  const earnedBadges = getEarnedBadgesCount();

  // Show loading state while user is being loaded or modules are loading
  if (loading || modulesLoading) {
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
