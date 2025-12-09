# Well-Being Layer Implementation

## Overview
A neurotype-specific support system that provides adaptive assistance when learners show signs of struggle or overload.

---

## Features Implemented

### 1. **ADHD: Focus Break**
**Trigger Conditions:**
- `consecutiveWrong >= 3` OR
- `wrongInLast5 >= 4`

**What Happens:**
- Full-screen modal appears: "Great effort! Let's take a 1-minute brain break"
- 60-second timer with breathing animation
- 3 micro-tasks: stretch, blink, look away
- Disabled answering until break completes
- After break: Reset counters, load next activity (potentially easier)

**Implementation:**
- `ADHDBreakModal` component
- State tracking: `consecutiveWrong`, `wrongInLast5`, `showBreakModal`
- Logged to backend: `supportMode: "ADHD_BREAK"`, `breakTriggered: true`

---

### 2. **Dyslexia: Support Boost**
**Trigger Conditions:**
- `consecutiveWrong >= 2` on reading tasks (image_to_word, instruction_to_image, one_step_instruction) OR
- `timeTaken > 60s` AND `difficulty === 'hard'`

**What Happens:**
- **No forced break** - keeps learner in flow
- Auto-enable TTS: Auto-play question when it loads
- Larger fonts: 1.15x size, increased line spacing
- Hover TTS: Words read on hover
- Visual indicator: "Reading Support Active" banner
- Easier questions: Backend can serve simpler items

**Implementation:**
- `supportBoost` state
- `dyslexia-mode` CSS class
- Auto-play instruction via `useTextToSpeech`
- Logged to backend: `supportMode: "DYSLEXIA_SUPPORT"`

---

### 3. **ASD: Calm Mode**
**Trigger Conditions:**
- Feedback contains "confus" or "don't understand" OR
- `timeTaken > 90s` AND `consecutiveWrong < 2` (freezing/overthinking)

**What Happens:**
- **Predictable Layout:**
  - Same colors, minimal animation
  - Fixed success/error icons
  - Consistent spacing
- **Reduced Variety:**
  - Backend can serve same activity type for next N questions
  - Avoids sudden type switches
- **Step Indicators:**
  - "Step X of Y" shown in header
  - Clear progression visibility
- **Warning Before Changes:**
  - "Next, you will see a new kind of activity..." (future)

**Implementation:**
- `calmMode` state
- `calm-mode` CSS class (removes animations)
- Step indicator in activity header
- Logged to backend: `supportMode: "ASD_CALM"`

---

## Backend Changes

### Updated `SubmitRequest` Model
```python
class SubmitRequest(BaseModel):
    # ... existing fields ...
    supportMode: Optional[str] = None  # "ADHD_BREAK", "DYSLEXIA_SUPPORT", "ASD_CALM"
    breakTriggered: Optional[bool] = None
    breakReason: Optional[str] = None
    consecutiveWrong: Optional[int] = None
    wrongInLast5: Optional[int] = None
```

### MongoDB Storage
All support mode data is logged in the `interactions` collection for:
- Analytics
- ML model training (future)
- Pattern recognition

---

## Frontend State Tracking

### Support Counters
```typescript
const [consecutiveWrong, setConsecutiveWrong] = useState(0);
const [wrongInLast5, setWrongInLast5] = useState<boolean[]>([]);
const [questionsSinceLastBreak, setQuestionsSinceLastBreak] = useState(0);
const [lastBreakAt, setLastBreakAt] = useState<number | null>(null);
```

### Support Modes
```typescript
const [showBreakModal, setShowBreakModal] = useState(false); // ADHD
const [supportBoost, setSupportBoost] = useState(false); // Dyslexia
const [calmMode, setCalmMode] = useState(false); // ASD
```

---

## User Experience Flow

### ADHD Example
1. User answers 3 questions incorrectly
2. Modal appears: "Great effort! Let's take a brain break"
3. Timer counts down (60s) with breathing animation
4. User completes micro-tasks
5. After break: "Nice reset! Let's continue"
6. Next activity loads (potentially easier)
7. Counters reset

### Dyslexia Example
1. User struggles with 2 reading questions
2. Banner appears: "Reading Support Active"
3. Question auto-plays via TTS
4. Fonts increase, line spacing improves
5. Hover over words → TTS reads them
6. No break - continues in flow
7. Support remains active

### ASD Example
1. User takes 90s on question (freezing)
2. Banner appears: "Calm Mode Active"
3. Animations removed
4. Step indicator shows: "Step 2 of 10"
5. Layout becomes predictable
6. Same activity type continues
7. Calm mode remains active

---

## CSS Classes

### `.dyslexia-mode`
- Larger fonts (1.15x)
- Increased line spacing (1.8)
- Letter spacing (0.05em)
- Arial/OpenDyslexic font family

### `.calm-mode`
- Removes all animations
- Minimal transitions (only color/background)
- Fixed feedback icons
- Predictable layout

---

## Future Enhancements

### ML Integration
- Learn optimal break frequency per user
- Adapt thresholds automatically
- Predict when support is needed

### Backend Activity Selection
- For ADHD: Serve easier activities after break
- For Dyslexia: Serve simpler words/examples
- For ASD: Maintain same activity type for N questions

### Additional Features
- Manual "I'm confused" button
- Break customization (duration, tasks)
- Support mode preferences
- Analytics dashboard for support usage

---

## Testing

### Test ADHD Break
1. Set user neuroFlags: `["ADHD"]`
2. Answer 3 questions incorrectly
3. Verify break modal appears
4. Complete break
5. Verify counters reset

### Test Dyslexia Support
1. Set user neuroFlags: `["Dyslexia"]`
2. Answer 2 reading questions incorrectly
3. Verify support boost activates
4. Verify TTS auto-plays
5. Verify fonts increase

### Test ASD Calm Mode
1. Set user neuroFlags: `["ASD"]`
2. Take >90s on question
3. Verify calm mode activates
4. Verify animations removed
5. Verify step indicator shows

---

## Status

✅ **ADHD Break Modal** - Implemented  
✅ **Dyslexia Support Boost** - Implemented  
✅ **ASD Calm Mode** - Implemented  
✅ **Backend Logging** - Implemented  
✅ **State Tracking** - Implemented  
✅ **CSS Styles** - Implemented  
✅ **Integration** - Complete  

---

**The Well-Being Layer is now fully functional and ready for testing!** 🎉

