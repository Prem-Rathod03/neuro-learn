import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { moduleId } = useParams<{ moduleId: string }>(); // Extract moduleId from URL
  const { settings } = useSettings();
  const { user } = useAuth();
  const { toast } = useToast();

  const { speak } = useTextToSpeech();
  const [distractionFree, setDistractionFree] = useState(settings.distractionFreeDefault);
  const [activity, setActivity] = useState<ActivityItem | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // Support multiple for focus_filter
  const [startTime, setStartTime] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simplified, setSimplified] = useState<string>('');
  const [rephrasing, setRephrasing] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [correctCount, setCorrectCount] = useState(0);
  
  // Track lesson progress
  const [currentLessonProgress, setCurrentLessonProgress] = useState({ completed: 0, total: 0 });
  const [completedActivitiesInLesson, setCompletedActivitiesInLesson] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load activity on mount
    loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Helper to get fallback activity based on moduleId
  const getFallbackActivity = (targetModuleId?: string): ActivityItem | null => {
    try {
      console.log('Getting fallback activity for module:', targetModuleId);
      
      // Normalize moduleId: convert "module-1" to "M1", etc.
      let normalizedModuleId = targetModuleId;
      if (targetModuleId) {
        if (targetModuleId.startsWith('module-')) {
          const moduleNum = targetModuleId.replace('module-', '');
          normalizedModuleId = `M${moduleNum}`;
        } else if (!targetModuleId.startsWith('M')) {
          normalizedModuleId = `M${targetModuleId}`;
        }
      }
      
      // Try to get first activity from the specified module
      if (normalizedModuleId) {
        const moduleNum = normalizedModuleId.replace('M', '');
        const firstLesson = `${moduleNum}.1`; // First lesson of the module
        const activities = getActivitiesByLesson(normalizedModuleId, firstLesson);
        console.log(`${normalizedModuleId} L${firstLesson} activities:`, activities.length);
        if (activities.length > 0) return activities[0];
      }
      
      // Fallback: try M1, then M2, then M3
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
      
      // Last resort: try to get any activity by ID
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
    
    // Helper function to set activity and reset state
    const setActivityAndReset = (activity: ActivityItem) => {
      console.log('Setting activity:', activity.id);
      setActivity(activity);
      setSelectedAnswers([]);
      setStartTime(Date.now());
      setSimplified('');
      setFeedback('');
      setLoading(false);
      // Don't reset progress counters - they persist across activities
    };
    
            // First, get fallback ready (pass moduleId if available)
            const fallbackActivity = getFallbackActivity(moduleId);
            if (!fallbackActivity) {
      console.error('No fallback activities found!');
      setError('No activities available. Please check your data files.');
      setLoading(false);
      return;
    }
    
    // Try to get activity from backend API with timeout (1 second - fail fast)
    let apiWorked = false;
    try {
      console.log('Attempting to fetch activity from API...', { moduleId });
      // Convert module-1, module-2, module-3 to M1, M2, M3
      const normalizedModuleId = moduleId 
        ? (moduleId.startsWith('module-') 
            ? `M${moduleId.replace('module-', '')}` 
            : moduleId.startsWith('M') 
              ? moduleId 
              : `M${moduleId}`)
        : undefined;
      
      const next = await Promise.race([
        getNextActivity(normalizedModuleId),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 1000)
        )
      ]);
      console.log('API response received:', next);
      apiWorked = true;
      
      // Process the response
      if (next && 'id' in next && 'instruction' in next && 'options' in next && Array.isArray(next.options)) {
        // New ActivityItem format
        if (next.options.length === 0) {
          throw new Error('Activity has no options');
        }
        setActivityAndReset(next as ActivityItem);
        return; // Success!
      } else if (next && 'activityId' in next && 'question' in next) {
        // Legacy format - convert to ActivityItem
        const converted: ActivityItem = {
          id: next.activityId || 'legacy-1',
          moduleId: 'M1',
          lessonId: '1.1',
          type: 'image_to_word',
          instruction: next.question || 'Answer the question',
          instructionTts: next.question,
          difficulty: (next.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
          options: (next.options || []).map((opt: string, idx: number) => ({
            id: String.fromCharCode(65 + idx), // A, B, C, D
            label: opt,
            isCorrect: false,
            ttsText: opt,
          })),
          accessibility: {
            recommendedFor: [],
            enableTtsOnHover: false,
            showProgressBar: false,
            avoidMetaphors: true,
            consistentFeedback: true,
          },
        };
        setActivityAndReset(converted);
        return; // Success!
      } else {
        throw new Error('Invalid activity data received from server');
      }
    } catch (err: any) {
      console.error('Failed to load activity from API:', err);
      apiWorked = false;
    }
    
    // If API didn't work, use fallback immediately
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

    // Determine if answer is correct based on ActivityItem schema
    let isCorrect = false;
    if (activity.type === 'focus_filter') {
      // For focus tasks, count correct selections
      const correctSelections = activity.options.filter(
        opt => opt.isCorrect && selectedAnswers.includes(opt.id)
      ).length;
      isCorrect = correctSelections > 0;
    } else {
      // For single-answer activities, check if selected answer is correct
      const selectedOption = activity.options.find(opt => selectedAnswers.includes(opt.id));
      isCorrect = selectedOption?.isCorrect || false;
    }

    await submitActivity({
      activityId: activity.id,
      answer: selectedAnswers.join(','), // Join multiple answers if needed
      isCorrect,
      timeTaken,
      difficultyRating: 3,
      focusRating: 3,
      feedbackText: feedback,
      attentionScore: 0.7, // placeholder; replace with real attention model output
    });

    // Update progress for all users - track questions answered
    // Update total answered count (regardless of correctness)
    setTotalAnswered((prev) => {
      const newCount = prev + 1;
      console.log(`Progress updated: ${newCount} / ${TOTAL_TARGET} questions answered`);
      return newCount;
    });
    
    // Update correct count only if answer is correct
    if (isCorrect) {
      setCorrectCount((prev) => Math.min(prev + 1, TOTAL_TARGET));
    }

    // Show feedback toast
    toast({
      title: isCorrect ? 'Correct! 🎉' : 'Try again!',
      description: isCorrect ? 'Loading the next activity...' : 'Please try again with a different answer.',
      variant: isCorrect ? 'default' : 'destructive',
    });

    // Only move to next question if answer is correct
    if (isCorrect) {
      await loadNext();
    } else {
      // Reset selected answers so user can try again
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
      
      // Include options as strings
      if (activity.options && activity.options.length > 0) {
        payload.options = activity.options.map(opt => opt.label);
      }
      if (activity.difficulty) {
        payload.difficulty = String(activity.difficulty);
      }
      // Use neuroFlags if available, otherwise fallback to neurodiversityTags
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
      // Check if it's a quota error
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
              <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Check neuroFlags for feature toggles
  const hasADHD = user?.neuroFlags?.includes('ADHD') || user?.neurodiversityTags?.includes('ADHD');
  // Show progress bar for all users (not just ADHD) - helps track progress
  const showProgressBar = true; // Always show progress bar to track questions answered

  const handleSelectAnswer = (optionId: string) => {
    if (activity.type === 'focus_filter') {
      // Toggle selection for focus tasks
      setSelectedAnswers(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // Single selection for other activities
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
          {/* Header */}
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

          {/* Progress Bar - shows questions answered */}
          {showProgressBar && (
            <Card className="p-4 bg-muted/30">
              <ADHDProgressBar
                current={totalAnswered}
                total={TOTAL_TARGET}
                label={`Questions Answered: ${totalAnswered} / ${TOTAL_TARGET}`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Progress updates every time you submit an answer (correct or incorrect)
              </p>
            </Card>
          )}

          {/* Distraction-Free Mode Toggle */}
          {distractionFree && (
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setDistractionFree(false)}>
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Activity Card */}
          <Card className="p-8 md:p-12 shadow-elevated">
            <div className="space-y-8">
              {/* Instruction with TTS button */}
              <div className="text-center space-y-4">
                <Button variant="outline" size="lg" onClick={handleRepeatInstruction} className="gap-2">
                  <Volume2 className="w-5 h-5" />
                  Hear/Repeat Question
                </Button>
              </div>

              {/* Activity Renderer - handles all activity types */}
              <ActivityRenderer
                activity={activity}
                selectedAnswers={selectedAnswers}
                onSelectAnswer={handleSelectAnswer}
                onSelectMultiple={handleSelectMultiple}
              />

              {/* Feedback and Rephrase */}
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

          {/* Navigation */}
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
