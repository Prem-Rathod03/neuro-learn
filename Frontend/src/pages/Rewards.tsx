import { Navbar } from '@/components/Navbar';
import { BadgeCard } from '@/components/BadgeCard';
import { Card } from '@/components/ui/card';
import { badges, getTotalStars, getEarnedBadgesCount } from '@/data/mockData';
import { Award, Star } from 'lucide-react';

const Rewards = () => {
  const totalStars = getTotalStars();
  const earnedBadges = getEarnedBadgesCount();
  const totalBadges = badges.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Award className="w-10 h-10 text-reward" />
            Rewards & Badges
          </h1>
          <p className="text-muted-foreground text-lg">
            Your achievements and milestones
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-700 delay-100">
          <Card className="p-8 shadow-card bg-gradient-to-br from-reward-soft to-reward-soft/30">
            <div className="flex items-center gap-4">
              <Star className="w-16 h-16 text-reward" fill="currentColor" />
              <div>
                <p className="text-4xl font-bold text-reward-foreground mb-1">{totalStars}</p>
                <p className="text-muted-foreground">Total Stars Earned</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-card bg-gradient-to-br from-success-soft to-success-soft/30">
            <div className="flex items-center gap-4">
              <Award className="w-16 h-16 text-success" />
              <div>
                <p className="text-4xl font-bold text-success-foreground mb-1">
                  {earnedBadges}/{totalBadges}
                </p>
                <p className="text-muted-foreground">Badges Unlocked</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Motivational Message */}
        <Card className="p-6 shadow-card bg-gradient-to-br from-primary-soft to-accent-soft animate-in fade-in duration-700 delay-200">
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">🎉 Amazing Progress!</p>
            <p className="text-muted-foreground">
              You've earned {earnedBadges} badge{earnedBadges !== 1 ? 's' : ''} so far. Keep learning to unlock more!
            </p>
          </div>
        </Card>

        {/* Badges Grid */}
        <div className="space-y-4 animate-in fade-in duration-700 delay-300">
          <h2 className="text-2xl font-semibold">Your Badge Collection</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
              <div
                key={badge.id}
                className="animate-in fade-in duration-700"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <BadgeCard badge={badge} />
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <Card className="p-8 shadow-card text-center animate-in fade-in duration-700 delay-500">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">More Rewards Coming Soon!</h3>
          <p className="text-muted-foreground">
            Keep completing activities to unlock special rewards and surprises
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Rewards;
