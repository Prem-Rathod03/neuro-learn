import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Volume2, Minimize2, Maximize2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getNextActivity, submitActivity, rephrase } from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';
import { ADHDProgressBar } from '@/components/ProgressBar';
import { ActivityRenderer } from '@/components/ActivityRenderer';
import { ActivityItem } from '@/types/activity';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getActivityById, getActivitiesByLesson } from '@/data/activityItems';

const LearningActivity = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  const { speak } = useTextToSpeech();
  
  const [distractionFree, setDistractionFree] = useState(settings.distractionFreeDefault);
  const [activity, setActivity] = useState<ActivityItem | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simplified, setSimplified] = useState<string>('');
  const [rephrasing, setRephrasing] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  
  // Track lesson progress
  const [currentLessonProgress, setCurrentLessonProgress] = useState({ completed: 0, total: 0 });
  const [completedActivitiesInLesson, setCompletedActivitiesInLesson] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNext();
  }, [moduleId]);
  
  // Update lesson progress whenever activity changes
  useEffect(() => {
    if (activity) {
      updateLessonProgress(activity);
    }
  }, [activity, completedActivitiesInLesson]);
  
  // Update lesson progress based on current activity
  const updateLessonProgress = (currentActivity: ActivityItem) => {
    // Get all activities for this lesson
    const lessonActivities = getActivitiesByLesson(currentActivity.moduleId, currentActivity.lessonId);
    const totalInLesson = lessonActivities.length;
    
    // Count completed activities in this lesson (from state)
    const completed = completedActivitiesInLesson.size;
    
    console.log(`Lesson ${currentActivity.lessonId} progress: ${completed}/${totalInLesson}`);
    setCurrentLessonProgress({ completed, total: totalInLesson });
  };

  // Helper to get fallback activity
  const getFallbackActivity = (targetModuleId?: string): ActivityItem | null => {
    try {
      console.log('Getting fallback activity for module:', targetModuleId);
      
      let normalizedModuleId = targetModuleId;
      if (targetModuleId) {
        if (targetModuleId.startsWith('module-')) {
          const moduleNum = targetModuleId.replace('module-', '');
          normalizedModuleId = `M${moduleNum}`;
        } else if (!targetModuleId.startsWith('M')) {
          normalizedModuleId = `M${targetModuleId}`;
        }
      }
      
      if (normalizedModuleId) {
        const moduleNum = normalizedModuleId.replace('M', '');
        const firstLesson = `${moduleNum}.1`;
        const activities = getActivitiesByLesson(normalizedModuleId, firstLesson);
        console.log(`${normalizedModuleId} L${firstLesson} activities:`, activities.length);
        if (activities.length > 0) return activities[0];
      }
      
      const fallbackModules = ['M1', 'M2', 'M3'];
      for (const modId of fallbackModules) {
        const moduleNum = modId.replace('M', '');
        const firstLesson = `${moduleNum}.1`;
        const activities = getActivitiesByLesson(modId, firstLesson);
        if (activities.length > 0) {
          console.log(`Using fallback from ${modId} L${firstLesson}`);
          return activities[0];
        }
      }
      
      const byId = getActivityById('M1_L1_Q1');
      if (byId) return byId;
      
      console.error('No fallback activities found!');
      return null;
    } catch (e) {
      console.error('Error getting fallback:', e);
      return null;
    }
  };

  const loadNext = async () => {
    setLoading(true);
    setError(null);
    
    const setActivityAndReset = (activity: ActivityItem) => {
      console.log('Setting activity:', activity.id);
      setActivity(activity);
      setSelectedAnswers([]);
      setStartTime(Date.now());
      setSimplified('');
      setFeedback('');
      setLoading(false);
    };
    
    const fallbackActivity = getFallbackActivity(moduleId);
    if (!fallbackActivity) {
      console.error('No fallback activities found!');
      setError('No activities available. Please check your data files.');
      setLoading(false);
      return;
    }
    
    let apiWorked = false;
    try {
      console.log('Attempting to fetch activity from API...', { moduleId });
      const normalizedModuleId = moduleId 
        ? (moduleId.startsWith('module-') 
            ? `M${moduleId.replace('module-', '')}` 
            : moduleId.startsWith('M') 
              ? moduleId 
              : `M${moduleId}`)
        : undefined;
      
      const next = await getNextActivity(normalizedModuleId);
      console.log('API response received:', next);
      apiWorked = true;
      
      if (next && 'id' in next && 'instruction' in next && 'options' in next && Array.isArray(next.options)) {
        if (next.options.length === 0) {
          throw new Error('Activity has no options');
        }
        setActivityAndReset(next as ActivityItem);
        return;
      } else {
        throw new Error('Invalid activity data received from server');
      }
    } catch (err: any) {
      console.error('Failed to load activity from API:', err);
      apiWorked = false;
    }
    
    if (!apiWorked) {
      console.log('Falling back to mock data...');
      if (fallbackActivity) {
        console.log('Using fallback activity:', fallbackActivity.id);
        setActivityAndReset(fallbackActivity);
        toast({
          title: 'Using offline mode',
          description: 'Using local activities. Backend may be unavailable.',
          variant: 'default',
        });
      } else {
        console.error('No fallback activities available');
        setError('Failed to load activity. No activities available.');
        toast({
          title: 'Error loading activity',
          description: 'Unable to load activities. Please check your connection.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!activity || !startTime) return;
    if (selectedAnswers.length === 0) {
      toast({
        title: 'Please select an answer',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const timeTaken = (Date.now() - startTime) / 1000;

    let isCorrect = false;
    if (activity.type === 'focus_filter') {
      const correctSelections = activity.options.filter(
        opt => opt.isCorrect && selectedAnswers.includes(opt.id)
      ).length;
      isCorrect = correctSelections > 0;
    } else {
      const selectedOption = activity.options.find(opt => selectedAnswers.includes(opt.id));
      isCorrect = selectedOption?.isCorrect || false;
    }

    await submitActivity({
      activityId: activity.id,
      answer: selectedAnswers.join(','),
      isCorrect,
      timeTaken,
      difficultyRating: 3,
      focusRating: 3,
      feedbackText: feedback,
      attentionScore: 0.7,
      lessonId: activity.lessonId,
    });

    if (isCorrect) {
      // Mark this activity as completed in current lesson
      const newCompleted = new Set([...completedActivitiesInLesson, activity.id]);
      setCompletedActivitiesInLesson(newCompleted);
      
      // Get lesson info
      const lessonActivities = getActivitiesByLesson(activity.moduleId, activity.lessonId);
      const completedCount = newCompleted.size;
      
      // Check if lesson is complete
      if (completedCount >= lessonActivities.length) {
        toast({
          title: 'Lesson Complete! 🎉',
          description: `You've completed all ${lessonActivities.length} questions in Lesson ${activity.lessonId}!`,
          variant: 'default',
        });
        
        // Clear completed activities for next lesson
        setCompletedActivitiesInLesson(new Set());
      } else {
        toast({
          title: 'Correct! 🎉',
          description: `${completedCount}/${lessonActivities.length} questions completed in Lesson ${activity.lessonId}`,
          variant: 'default',
        });
      }
      
      await loadNext();
    } else {
      toast({
        title: 'Try again!',
        description: 'Please try again with a different answer.',
        variant: 'destructive',
      });
      setSelectedAnswers([]);
    }
    setSubmitting(false);
  };

  const handleRepeatInstruction = () => {
    if (!activity) return;
    const instructionText = activity.instructionTts || activity.instruction;
    speak(instructionText);
  };

  const handleRephrase = async () => {
    if (!activity || !activity.instruction) return;
    setRephrasing(true);
    try {
      const payload: any = {
        question: activity.instruction,
      };
      
      if (activity.options && activity.options.length > 0) {
        payload.options = activity.options.map(opt => opt.label);
      }
      if (activity.difficulty) {
        payload.difficulty = String(activity.difficulty);
      }
      const neuroFlags = user?.neuroFlags || user?.neurodiversityTags || [];
      if (neuroFlags.length > 0) {
        payload.neuroType = String(neuroFlags[0]);
      } else {
        payload.neuroType = 'unknown';
      }
      if (feedback) {
        const lowerFeedback = feedback.toLowerCase();
        payload.confusionFlag = lowerFeedback.includes('confus') || lowerFeedback.includes("don't understand");
      }
      
      const simplifiedText = await rephrase(payload);
      setSimplified(simplifiedText);
      toast({
        title: 'Simplified!',
        description: 'The question has been rephrased in simpler language',
      });
    } catch (err: any) {
      const errorMsg = err?.message || 'Please try again';
      if (errorMsg.includes('quota') || errorMsg.includes('429') || errorMsg.includes('rate limit')) {
        toast({
          title: 'API Quota Exceeded',
          description: 'The rephrase feature is temporarily unavailable. Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Rephrase failed',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } finally {
      setRephrasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">⏳</div>
          <p className="text-lg text-muted-foreground">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-2xl font-semibold">Unable to Load Activity</h2>
            <p className="text-muted-foreground">{error || 'Activity not found'}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={loadNext} variant="default">
                Try Again
              </Button>
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const showProgressBar = true;

  const handleSelectAnswer = (optionId: string) => {
    if (activity.type === 'focus_filter') {
      setSelectedAnswers(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedAnswers([optionId]);
    }
  };

  const handleSelectMultiple = (optionId: string) => {
    setSelectedAnswers(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  return (
    <div className={cn('min-h-screen bg-background', distractionFree && 'distraction-free')}>
      {!distractionFree && <Navbar />}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {!distractionFree && (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="uppercase tracking-wide text-xs">Module {activity.moduleId}</span>
                  <span className="uppercase tracking-wide text-xs">Lesson {activity.lessonId}</span>
                  <span className="rounded-full px-2 py-0.5 bg-muted text-xs">{activity.difficulty}</span>
                </div>
                <h1 className="text-2xl font-bold">{activity.type.replace(/_/g, ' ')}</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDistractionFree(!distractionFree)}>
                <Minimize2 className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Progress Bar - Shows current lesson progress */}
          {showProgressBar && currentLessonProgress.total > 0 && (
            <Card className="p-4">
              <ADHDProgressBar
                current={currentLessonProgress.completed}
                total={currentLessonProgress.total}
                label={`Lesson ${activity?.lessonId} Progress: ${currentLessonProgress.completed} / ${currentLessonProgress.total}`}
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {currentLessonProgress.completed >= currentLessonProgress.total 
                  ? '✅ Lesson complete! Moving to next lesson...'
                  : `${currentLessonProgress.total - currentLessonProgress.completed} questions remaining in this lesson`
                }
              </p>
            </Card>
          )}

          {distractionFree && (
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setDistractionFree(false)}>
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          )}

          <Card className="p-8 md:p-12 shadow-elevated">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <Button variant="outline" size="lg" onClick={handleRepeatInstruction} className="gap-2">
                  <Volume2 className="w-5 h-5" />
                  Hear/Repeat Question
                </Button>
              </div>

              <ActivityRenderer
                activity={activity}
                selectedAnswers={selectedAnswers}
                onSelectAnswer={handleSelectAnswer}
                onSelectMultiple={handleSelectMultiple}
              />

              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={handleRephrase} disabled={rephrasing}>
                    {rephrasing ? 'Simplifying...' : 'Rephrase / Simplify'}
                  </Button>
                </div>
                {simplified && (
                  <div className="p-4 rounded-md bg-muted/50 text-left">
                    <p className="text-sm font-semibold mb-1">Simplified:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{simplified}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Feedback (optional)</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us if this was too hard, confusing, or easy"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end">
            <Button size="lg" onClick={handleSubmit} className="gap-2" disabled={submitting}>
              Submit & Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningActivity;

