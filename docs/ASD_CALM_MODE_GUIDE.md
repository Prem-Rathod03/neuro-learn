# ASD (Autism) Calm Mode - What the System Checks

## Overview
The Well-Being Layer monitors for signs of sensory overload, confusion, or anxiety in learners with ASD and automatically enables "Calm Mode" to provide a more predictable, less overwhelming learning environment.

---

## What the System Checks For

### 1. **Confusion in Feedback** ✅
**Trigger:** User types feedback containing confusion indicators

**Code Check:**
```typescript
const hasConfusion = feedback.toLowerCase().includes('confus') || 
                     feedback.toLowerCase().includes("don't understand");
```

**Examples that trigger:**
- "I'm confused"
- "This is confusing"
- "I don't understand"
- "Don't understand this"
- "confused about this"

**When:** After user submits an answer with feedback

---

### 2. **Freezing/Overthinking** ✅
**Trigger:** User takes very long time but doesn't make many errors

**Code Check:**
```typescript
const isFreezing = timeTaken > 90 && consecutiveWrong < 2;
```

**What it means:**
- `timeTaken > 90` seconds (1.5 minutes) on a single question
- `consecutiveWrong < 2` (not making many mistakes - they're thinking, not guessing)

**Why this matters:**
- Indicates the learner might be:
  - Overthinking the question
  - Frozen by too many options
  - Overwhelmed by the format
  - Anxious about making a mistake

---

## How to Test ASD Calm Mode

### Test Method 1: Confusion Feedback
1. **Register/Login** with user who has `neuroFlags: ["ASD"]` or `["Autism"]`
2. **Answer a question** (correct or incorrect)
3. **In the feedback box**, type: "I'm confused" or "don't understand"
4. **Submit** the answer
5. **Expected:** 
   - Toast: "Calm Mode Enabled"
   - Banner appears: "🌿 Calm Mode Active - Predictable layout, minimal changes"
   - Animations removed
   - Step indicator shows: "Step X of Y"

### Test Method 2: Freezing Detection
1. **Register/Login** with user who has `neuroFlags: ["ASD"]`
2. **Start a question** but don't answer immediately
3. **Wait 90+ seconds** (1.5 minutes) on the same question
4. **Answer correctly** (or with only 0-1 wrong answers)
5. **Submit**
6. **Expected:** Calm Mode activates automatically

### Test Method 3: Manual Check
You can also check in browser console:
```javascript
// Check if calm mode is active
// Look for: calmMode: true in React DevTools
// Or check localStorage for supportMode: "ASD_CALM"
```

---

## What Happens When Calm Mode Activates

### Visual Changes:
1. ✅ **Animations Removed**
   - No hover effects
   - No transitions
   - No scale transforms
   - Only minimal color transitions

2. ✅ **Step Indicator Added**
   - Shows: "Step 2 of 10" at top of activity
   - Clear progression visibility

3. ✅ **Predictable Layout**
   - Same colors throughout
   - Consistent spacing
   - Fixed feedback icons (green tick / red X)

4. ✅ **Banner Notification**
   - "🌿 Calm Mode Active"
   - "Predictable layout, minimal changes"

### Backend Logging:
- `supportMode: "ASD_CALM"` sent to backend
- Stored in MongoDB interactions collection
- Can be analyzed for patterns

---

## Code Location

### Frontend Trigger Logic
**File:** `Frontend/src/pages/LearningActivity.tsx`

```typescript
// Check ASD triggers
if (hasASD && !calmMode) {
  // Check for confusion in feedback
  const hasConfusion = feedback.toLowerCase().includes('confus') || 
                       feedback.toLowerCase().includes("don't understand");
  
  // Check for freezing (high time, low errors)
  const isFreezing = timeTaken > 90 && newConsecutiveWrong < 2;
  
  if (hasConfusion || isFreezing) {
    setCalmMode(true);
    supportModeToSend = 'ASD_CALM';
    // Show toast notification
  }
}
```

### CSS Styles
**File:** `Frontend/src/styles/wellbeing.css`

```css
.calm-mode {
  animation: none !important;
  transition: none !important;
}
```

---

## Additional Checks You Could Add (Future)

### 1. Activity Type Changes
```typescript
// Track activity type switches
const recentTypes = [activity1.type, activity2.type, activity3.type];
const tooManyChanges = new Set(recentTypes).size >= 3;
// If 3+ different types in last 3 questions → trigger calm mode
```

### 2. High Difficulty Rating
```typescript
// If user rates difficulty as 4-5 (very hard)
if (difficultyRating >= 4 && hasASD) {
  // Trigger calm mode
}
```

### 3. Low Focus Rating
```typescript
// If user rates focus as 1-2 (very low)
if (focusRating <= 2 && hasASD) {
  // Might indicate overwhelm
}
```

### 4. Manual "I'm Overwhelmed" Button
```typescript
// Add a button: "I need a break" or "This is too much"
// Directly triggers calm mode
```

---

## Current Implementation Summary

### ✅ What's Checked:
1. **Feedback contains confusion words** → Triggers calm mode
2. **Time > 90s with low errors** → Triggers calm mode (freezing)

### ✅ What Happens:
1. Calm mode activates
2. Animations removed
3. Step indicator shown
4. Predictable layout enforced
5. Banner notification displayed
6. Logged to backend

### ⚠️ What's NOT Checked Yet (Future):
- Activity type variety (too many switches)
- Difficulty rating from user
- Focus rating from user
- Manual overwhelm button

---

## Testing Checklist

- [ ] User has `neuroFlags: ["ASD"]` or `["Autism"]`
- [ ] Type "confused" in feedback → Calm mode activates
- [ ] Wait 90+ seconds on question → Calm mode activates
- [ ] Verify animations are removed
- [ ] Verify step indicator shows
- [ ] Verify banner appears
- [ ] Check backend logs for `supportMode: "ASD_CALM"`

---

## Quick Test Commands

### In Browser Console:
```javascript
// Check user neuroFlags
const user = JSON.parse(localStorage.getItem('neuropath_user'));
console.log('NeuroFlags:', user.neuroFlags);

// Check if calm mode should trigger
// (You'd need to check React state, but this gives you user flags)
```

### To Test:
1. Set user with ASD flag
2. Answer question
3. Type "confused" in feedback
4. Submit
5. Check for calm mode activation

---

**The system currently checks for confusion in feedback and freezing behavior (high time, low errors) to trigger ASD Calm Mode.** 🎯

