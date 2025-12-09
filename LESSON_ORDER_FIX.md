# Fix: Lessons Starting from Wrong Number

## Problem

When entering Module 2, lessons start from 2.2 instead of 2.1. Same issue may happen for Module 1 and 3.

## Root Cause

**Backend has incomplete data:**
- Backend M2: Only 2 activities (M2_L1_Q1, M2_L2_Q1)
- Frontend M2: 30 activities (10 each for 2.1, 2.2, 2.3)

**Possible causes:**
1. Backend returning wrong activity as "first"
2. User has cached progress in MongoDB
3. Frontend fallback logic issues

## Diagnostic Steps

### 1. Check Backend Response
```bash
curl "http://127.0.0.1:8030/api/activity/next?moduleId=M2"
```

Expected: Should return `M2_L1_Q1` (Lesson 2.1)
If it returns `M2_L2_Q1` (Lesson 2.2), backend sorting is wrong.

### 2. Check User Progress
```bash
# Check MongoDB for user interactions
mongosh neurolearn --eval "db.interactions.find({}).sort({timestamp:-1}).limit(5)"
```

If user has completed M2 Lesson 2.1 activities, the system will start at 2.2.

### 3. Clear User Progress (Test)
```bash
# Clear all interactions to start fresh
mongosh neurolearn --eval "db.interactions.deleteMany({})"
```

Then refresh browser and try Module 2 again.

## Solution Options

### Option 1: Clear User Progress (Quick Fix)
If you want to start fresh:
1. Clear MongoDB interactions
2. Clear browser localStorage
3. Refresh browser

### Option 2: Fix Backend Data (Proper Fix)
Sync frontend activities to backend so both have 30 M2 activities.

### Option 3: Force First Lesson (Code Fix)
Update frontend to always start from Lesson X.1 when no progress exists.

## Quick Test

Try this in browser console (F12):
```javascript
// Check localStorage for cached progress
localStorage.getItem('neurolearn-user')

// Clear it
localStorage.clear()

// Reload page
location.reload()
```

Then try clicking Module 2 again.

## Expected Behavior

When clicking a module for the first time:
- **Module 1** → Start at Lesson 1.1
- **Module 2** → Start at Lesson 2.1
- **Module 3** → Start at Lesson 3.1

After completing Lesson X.1:
- Move to Lesson X.2
- Then Lesson X.3 (if exists)

## Current Status

Need to investigate:
1. What activity does backend return for fresh Module 2?
2. Is there user progress stored in MongoDB?
3. Is frontend fallback working correctly?

Let me know what you see when you click Module 2 and I'll provide the exact fix!

