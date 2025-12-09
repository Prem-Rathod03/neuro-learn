/**
 * Progress Storage Utilities
 * Manages saving and loading user progress to/from localStorage
 */

export interface UserProgress {
  lastActivityId: string;
  completedIds: string[];
  lastUpdated: string;
}

/**
 * Get progress key for a specific user and module
 */
function getProgressKey(userEmail: string, moduleId: string): string {
  return `progress_${userEmail}_${moduleId}`;
}

/**
 * Save user progress for a module
 */
export function saveProgress(
  userEmail: string,
  moduleId: string,
  lastActivityId: string,
  completedIds: string[]
): void {
  try {
    const progressKey = getProgressKey(userEmail, moduleId);
    const progressData: UserProgress = {
      lastActivityId,
      completedIds,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(progressKey, JSON.stringify(progressData));
    console.log(`✅ Saved progress for ${moduleId}:`, lastActivityId);
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

/**
 * Load user progress for a module
 * Also migrates old format keys (module-2) to new format (M2)
 */
export function loadProgress(
  userEmail: string,
  moduleId: string
): UserProgress | null {
  try {
    const progressKey = getProgressKey(userEmail, moduleId);
    console.log(`loadProgress: Looking for key: ${progressKey}`);
    
    // Check for new format first
    let savedProgress = localStorage.getItem(progressKey);
    
    // If not found, check for old format (module-2) and migrate
    if (!savedProgress && moduleId.startsWith('M')) {
      const moduleNum = moduleId.replace('M', '');
      const oldKey = getProgressKey(userEmail, `module-${moduleNum}`);
      const oldProgress = localStorage.getItem(oldKey);
      
      if (oldProgress) {
        console.log(`🔄 Migrating progress from old key: ${oldKey} → ${progressKey}`);
        // Migrate to new key
        localStorage.setItem(progressKey, oldProgress);
        localStorage.removeItem(oldKey);
        savedProgress = oldProgress;
      }
    }
    
    // Also check all localStorage keys to see what's actually stored
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('progress_')) {
        allKeys.push(key);
      }
    }
    console.log('loadProgress: All progress keys in localStorage:', allKeys);
    
    console.log(`loadProgress: Found data for ${progressKey}:`, savedProgress ? 'YES' : 'NO');
    
    if (!savedProgress) {
      return null;
    }
    const progress = JSON.parse(savedProgress) as UserProgress;
    console.log(`✅ Loaded progress for ${moduleId}:`, progress.lastActivityId, `(${progress.completedIds.length} completed)`);
    return progress;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

/**
 * Clear progress for a module (reset)
 */
export function clearProgress(userEmail: string, moduleId: string): void {
  try {
    const progressKey = getProgressKey(userEmail, moduleId);
    localStorage.removeItem(progressKey);
    console.log(`✅ Cleared progress for ${moduleId}`);
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

/**
 * Get all modules with saved progress for a user
 */
export function getAllProgress(userEmail: string): Record<string, UserProgress> {
  const allProgress: Record<string, UserProgress> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`progress_${userEmail}_`)) {
        const moduleId = key.replace(`progress_${userEmail}_`, '');
        const progressData = localStorage.getItem(key);
        if (progressData) {
          allProgress[moduleId] = JSON.parse(progressData);
        }
      }
    }
  } catch (error) {
    console.error('Failed to get all progress:', error);
  }
  return allProgress;
}

/**
 * Clear ALL progress for a user (logout/reset)
 */
export function clearAllProgress(userEmail: string): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`progress_${userEmail}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`✅ Cleared all progress for user: ${userEmail}`);
  } catch (error) {
    console.error('Failed to clear all progress:', error);
  }
}

/**
 * Calculate module progress from localStorage
 * Returns progress percentage and completed count
 */
export function calculateModuleProgress(
  userEmail: string,
  moduleId: string,
  totalActivities: number
): { completed: number; progress: number } {
  try {
    console.log(`calculateModuleProgress: ${moduleId} for ${userEmail}`);
    const progress = loadProgress(userEmail, moduleId);
    console.log(`calculateModuleProgress: ${moduleId} loaded progress:`, progress);
    
    if (!progress) {
      console.log(`calculateModuleProgress: ${moduleId} - No progress found`);
      return { completed: 0, progress: 0 };
    }
    
    // Count unique completed activities
    const completedCount = new Set(progress.completedIds).size;
    console.log(`calculateModuleProgress: ${moduleId} - Completed: ${completedCount}/${totalActivities}`);
    
    const progressPercent = totalActivities > 0 
      ? Math.min((completedCount / totalActivities) * 100, 100)
      : 0;
    
    console.log(`calculateModuleProgress: ${moduleId} - Progress: ${progressPercent.toFixed(1)}%`);
    
    return {
      completed: completedCount,
      progress: Math.round(progressPercent * 10) / 10, // Round to 1 decimal
    };
  } catch (error) {
    console.error(`Failed to calculate module progress for ${moduleId}:`, error);
    return { completed: 0, progress: 0 };
  }
}

/**
 * Get all module progress for dashboard
 * Returns progress for M1, M2, M3
 */
export function getAllModuleProgress(
  userEmail: string,
  totalActivities: { M1: number; M2: number; M3: number }
): {
  M1: { activitiesCompleted: number; totalActivities: number; progress: number };
  M2: { activitiesCompleted: number; totalActivities: number; progress: number };
  M3: { activitiesCompleted: number; totalActivities: number; progress: number };
} {
  console.log('getAllModuleProgress: userEmail =', userEmail);
  console.log('getAllModuleProgress: totalActivities =', totalActivities);
  
  const m1Progress = calculateModuleProgress(userEmail, 'M1', totalActivities.M1);
  const m2Progress = calculateModuleProgress(userEmail, 'M2', totalActivities.M2);
  const m3Progress = calculateModuleProgress(userEmail, 'M3', totalActivities.M3);
  
  console.log('getAllModuleProgress: M1 =', m1Progress);
  console.log('getAllModuleProgress: M2 =', m2Progress);
  console.log('getAllModuleProgress: M3 =', m3Progress);
  
  return {
    M1: {
      ...m1Progress,
      totalActivities: totalActivities.M1,
    },
    M2: {
      ...m2Progress,
      totalActivities: totalActivities.M2,
    },
    M3: {
      ...m3Progress,
      totalActivities: totalActivities.M3,
    },
  };
}

