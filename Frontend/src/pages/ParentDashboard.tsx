import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { NeurodiversityBadge } from '@/components/NeurodiversityBadge';
import { modules } from '@/data/mockData';
import { ArrowLeft, Users, TrendingUp, Award, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { NeurodiversityTag } from '@/contexts/AuthContext';

// Mock student data
const mockStudents = [
  {
    id: '1',
    name: 'Alex Johnson',
    age: 10,
    neurodiversityTags: ['ADHD', 'Dyslexia'] as NeurodiversityTag[],
    lastActive: '2 hours ago',
    totalStars: 45,
    badges: 3,
  },
  {
    id: '2',
    name: 'Emma Davis',
    age: 9,
    neurodiversityTags: ['Autism'] as NeurodiversityTag[],
    lastActive: '1 day ago',
    totalStars: 62,
    badges: 4,
  },
  {
    id: '3',
    name: 'Marcus Lee',
    age: 11,
    neurodiversityTags: ['Multiple'] as NeurodiversityTag[],
    lastActive: '3 hours ago',
    totalStars: 38,
    badges: 2,
  },
];

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">Parent/Teacher Dashboard</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Demo View</div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-700">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-soft rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStudents.length}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success-soft rounded-xl">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockStudents.reduce((acc, s) => acc + s.totalStars, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Combined Stars</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-reward-soft rounded-xl">
                <Award className="w-6 h-6 text-reward" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockStudents.reduce((acc, s) => acc + s.badges, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Badges</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Student List */}
          <Card className="lg:col-span-1 p-6 shadow-card animate-in fade-in duration-700 delay-100">
            <h2 className="text-xl font-semibold mb-4">Students</h2>
            <div className="space-y-3">
              {mockStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedStudent.id === student.id
                      ? 'bg-primary-soft border-2 border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <p className="font-semibold mb-2">{student.name}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {student.neurodiversityTags.map((tag) => (
                      <NeurodiversityBadge key={tag} tag={tag} size="sm" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {student.lastActive}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Selected Student Details */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-700 delay-200">
            {/* Student Header */}
            <Card className="p-6 shadow-card bg-gradient-to-br from-primary-soft to-primary-soft/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedStudent.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedStudent.neurodiversityTags.map((tag) => (
                      <NeurodiversityBadge key={tag} tag={tag} size="md" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Age: {selectedStudent.age} • Last active: {selectedStudent.lastActive}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold text-reward">{selectedStudent.totalStars}</p>
                  <p className="text-xs text-muted-foreground">Stars Earned</p>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold text-success">{selectedStudent.badges}</p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </Card>

            {/* Module Progress */}
            <Card className="p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Module Progress</h3>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{module.icon}</span>
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {module.activitiesCompleted}/{module.totalActivities}
                      </span>
                    </div>
                    <ProgressBar
                      progress={module.progress}
                      color={module.color as any}
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-success-soft rounded-lg">
                  <div className="text-xl">✓</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Completed "Match the Word" activity</p>
                    <p className="text-xs text-muted-foreground">Understanding Instructions • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-reward-soft rounded-lg">
                  <div className="text-xl">⭐</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Earned 3 stars</p>
                    <p className="text-xs text-muted-foreground">Perfect score on activity • 3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary-soft rounded-lg">
                  <div className="text-xl">🎯</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Started Focus & Routine module</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
