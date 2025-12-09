# Progress Bar Issue Fix

## Problem
Progress bar showing "Lesson 1.1 Progress: 0 / 1" instead of "0 / 12"

## Root Cause
The `getActivitiesByLesson` function in `Frontend/src/data/activityItems.ts` was:
1. Using wrong array name (`exampleActivities` instead of `activities`)
2. Not returning any activities, causing it to show 1 as a fallback

## Fix Applied

### Updated `activityItems.ts`

**Before:**
```typescript
export function getActivitiesByLesson(moduleId: string, lessonId: string): ActivityItem[] {
  return exampleActivities.filter(  // ❌ Wrong array name
    activity => activity.moduleId === moduleId && activity.lessonId === lessonId
  );
}
```

**After:**
```typescript
export function getActivitiesByLesson(moduleId: string, lessonId: string): ActivityItem[] {
  const filtered = activities.filter(  // ✅ Correct array name
    activity => activity.moduleId === moduleId && activity.lessonId === lessonId
  );
  console.log(`getActivitiesByLesson(${moduleId}, ${lessonId}): found ${filtered.length} activities`);
  return filtered;
}
```

Also fixed `getActivityById`:
```typescript
export function getActivityById(id: string): ActivityItem | undefined {
  return activities.find(activity => activity.id === id);  // Was empty before
}
```

## Verification

After fix, the function should return:
- Lesson 1.1: 12 activities
- Lesson 1.2: 10 activities  
- Lesson 1.3: 1 activity

## Test
1. Refresh browser (Cmd+Shift+R)
2. Start Module 1
3. Progress bar should show: "Lesson 1.1 Progress: 0 / 12"
4. Answer first question correctly
5. Should update to: "Lesson 1.1 Progress: 1 / 12"

If it still shows wrong numbers, check browser console for the log message to see what `getActivitiesByLesson` is returning.

