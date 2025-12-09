import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, Activity, Users, TrendingUp, RefreshCw } from 'lucide-react';
import {
  getMLLogs,
  getNLPLogs,
  getAccuracyTrends,
  getUserStats,
  getModelPerformance,
  type MLLog,
  type NLPLog,
  type AccuracyTrend,
  type UserStat,
} from '@/lib/admin-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  
  // Data states
  const [mlLogs, setMLLogs] = useState<MLLog[]>([]);
  const [nlpLogs, setNLPLogs] = useState<NLPLog[]>([]);
  const [accuracyTrends, setAccuracyTrends] = useState<AccuracyTrend[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [modelPerf, setModelPerf] = useState<any>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const userId = selectedUser === 'all' ? undefined : selectedUser;
      
      const [mlData, nlpData, trendsData, usersData, perfData] = await Promise.all([
        getMLLogs(userId, 50),
        getNLPLogs(userId, 50),
        getAccuracyTrends(userId, 7),
        getUserStats(),
        getModelPerformance(),
      ]);

      setMLLogs(mlData.logs);
      setNLPLogs(nlpData.logs);
      setAccuracyTrends(trendsData.trends);
      setUserStats(usersData.users);
      setModelPerf(perfData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">⏳</div>
          <p className="text-lg text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard 🎛️</h1>
            <p className="text-muted-foreground">ML/NLP Model Performance & Analytics</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {userStats.map((user) => (
                  <SelectItem key={user.userId} value={user.userId}>
                    {user.userId === 'Anonymous' ? 'Anonymous' : user.userId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchAllData} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-soft rounded-xl">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{modelPerf?.ml_predictions || 0}</p>
                <p className="text-sm text-muted-foreground">ML Predictions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-soft rounded-xl">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{modelPerf?.nlp_analyses || 0}</p>
                <p className="text-sm text-muted-foreground">NLP Analyses</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success-soft rounded-xl">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{modelPerf?.overall_accuracy?.toFixed(1) || 0}%</p>
                <p className="text-sm text-muted-foreground">Overall Accuracy</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-reward-soft rounded-xl">
                <Users className="w-6 h-6 text-reward" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.length}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Accuracy Trends Chart */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Accuracy Trends (Last 7 Days)</h2>
          {accuracyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No data available for the selected period</p>
          )}
        </Card>

        {/* Model Performance */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Model Performance Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Difficulty Distribution</h3>
              {modelPerf?.difficulty_distribution && (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={Object.entries(modelPerf.difficulty_distribution).map(([key, value]) => ({
                    difficulty: `Level ${key}`,
                    count: value
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="difficulty" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Interactions</p>
                <p className="text-2xl font-bold">{modelPerf?.total_interactions || 0}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Confusion Rate</p>
                <p className="text-2xl font-bold">{modelPerf?.confusion_rate?.toFixed(1) || 0}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* User Statistics Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">User Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">User ID</th>
                  <th className="text-left p-3">Activities</th>
                  <th className="text-left p-3">Accuracy</th>
                  <th className="text-left p-3">Avg Time (s)</th>
                  <th className="text-left p-3">Avg Difficulty</th>
                  <th className="text-left p-3">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((user) => (
                  <tr key={user.userId} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{user.userId}</td>
                    <td className="p-3">{user.totalActivities}</td>
                    <td className="p-3">
                      <span className={`font-semibold ${user.accuracy >= 70 ? 'text-success' : user.accuracy >= 50 ? 'text-warning' : 'text-destructive'}`}>
                        {user.accuracy.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3">{user.avgTime.toFixed(1)}</td>
                    <td className="p-3">{user.avgDifficulty.toFixed(1)}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {user.lastActivity ? new Date(user.lastActivity).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ML Logs Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">ML Model Logs ({mlLogs.length} recent)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Timestamp</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Topic</th>
                  <th className="text-left p-2">Difficulty</th>
                  <th className="text-left p-2">Modality</th>
                  <th className="text-left p-2">Avg Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {mlLogs.slice(0, 10).map((log) => (
                  <tr key={log._id} className="border-b hover:bg-muted/50">
                    <td className="p-2 text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2 font-mono text-xs">{log.userId || 'Anonymous'}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-primary-soft text-primary rounded text-xs">
                        {log.prediction.topic}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.prediction.difficulty === 'easy' ? 'bg-success-soft text-success' :
                        log.prediction.difficulty === 'medium' ? 'bg-warning-soft text-warning' :
                        'bg-destructive-soft text-destructive'
                      }`}>
                        {log.prediction.difficulty}
                      </span>
                    </td>
                    <td className="p-2 text-xs">{log.prediction.modality}</td>
                    <td className="p-2 text-xs">{(log.features.avg_accuracy * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* NLP Logs Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">NLP Analysis Logs ({nlpLogs.length} recent)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Timestamp</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Feedback Text</th>
                  <th className="text-left p-2">Sentiment</th>
                  <th className="text-left p-2">Confused?</th>
                </tr>
              </thead>
              <tbody>
                {nlpLogs.slice(0, 10).map((log) => (
                  <tr key={log._id} className="border-b hover:bg-muted/50">
                    <td className="p-2 text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2 font-mono text-xs">{log.userId || 'Anonymous'}</td>
                    <td className="p-2 max-w-xs truncate">{log.text}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.sentiment_score > 0.3 ? 'bg-success-soft text-success' :
                        log.sentiment_score < -0.3 ? 'bg-destructive-soft text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {log.sentiment_score.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-2">
                      {log.confusion_flag ? (
                        <span className="text-destructive font-semibold">⚠️ Yes</span>
                      ) : (
                        <span className="text-success">✓ No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Admin;

