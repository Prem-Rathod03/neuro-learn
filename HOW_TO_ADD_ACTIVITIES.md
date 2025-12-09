# How to Add Activities Manually

## 📁 Dataset Files Location

You need to update **TWO files** to keep backend and frontend in sync:

1. **Backend (Python)**: `backend/app/data/activity_items.py`
2. **Frontend (TypeScript)**: `Frontend/src/data/activityItems.ts`

---

## 🔧 Step-by-Step Guide

### Step 1: Add to Backend (`backend/app/data/activity_items.py`)

1. Open the file: `backend/app/data/activity_items.py`
2. Find the `EXAMPLE_ACTIVITIES = [` list
3. Add your new activity following this format:

```python
ActivityItem(
    id="M1_L1_Q2",  # Unique ID: M{module}_{lesson}_{question}
    moduleId="M1",   # Module: M1, M2, or M3
    lessonId="1.1",  # Lesson: "1.1", "1.2", "1.3", "2.1", etc.
    type="image_to_word",  # Activity type (see types below)
    instruction="Match the picture to the correct word.",
    instructionTts="Look at the picture and click the word that matches.",
    stimulusImageUrl="/images/module1/lesson1/van.png",  # Image path
    stimulusImageAlt="A blue van on the road",
    stimulusDescription="A blue van",
    difficulty="easy",  # "easy", "medium", or "hard"
    options=[
        ActivityOption(id="A", label="Van", isCorrect=True, ttsText="van"),
        ActivityOption(id="B", label="Fan", isCorrect=False, ttsText="fan"),
        ActivityOption(id="C", label="Man", isCorrect=False, ttsText="man"),
    ],
    accessibility=ActivityAccessibility(
        recommendedFor=["Dyslexia"],  # List: ["Dyslexia"], ["ADHD"], ["ASD"], or combinations
        enableTtsOnHover=True,  # Enable TTS for Dyslexia
        showProgressBar=False,  # Show progress bar for ADHD
        avoidMetaphors=True,
        consistentFeedback=True
    )
),
```

### Step 2: Add to Frontend (`Frontend/src/data/activityItems.ts`)

1. Open the file: `Frontend/src/data/activityItems.ts`
2. Find the `exampleActivities: ActivityItem[] = [` array
3. Add the same activity in TypeScript format:

```typescript
{
  id: "M1_L1_Q2",
  moduleId: "M1",
  lessonId: "1.1",
  type: "image_to_word",
  instruction: "Match the picture to the correct word.",
  instructionTts: "Look at the picture and click the word that matches.",
  stimulusImageUrl: "/images/module1/lesson1/van.png",
  stimulusImageAlt: "A blue van on the road",
  stimulusDescription: "A blue van",
  difficulty: "easy",
  options: [
    { id: "A", label: "Van", isCorrect: true, ttsText: "van" },
    { id: "B", label: "Fan", isCorrect: false, ttsText: "fan" },
    { id: "C", label: "Man", isCorrect: false, ttsText: "man" }
  ],
  accessibility: {
    recommendedFor: ["Dyslexia"],
    enableTtsOnHover: true,
    showProgressBar: false,
    avoidMetaphors: true,
    consistentFeedback: true
  }
},
```

---

## 📋 Activity Types

Available activity types:

- `"image_to_word"` - Match picture to word
- `"one_step_instruction"` - Single instruction (e.g., "Click the sad boy")
- `"two_step_sequence"` - Two-step instructions
- `"counting"` - Count objects
- `"visual_addition"` - Visual math addition
- `"pattern"` - Pattern recognition
- `"comparison"` - Compare items
- `"logic_choice"` - Logic-based choices
- `"sequence_ordering"` - Order events in sequence
- `"focus_filter"` - Focus/filter tasks (for ADHD)

---

## 🎯 ID Naming Convention

**Format**: `M{module}_{lesson}_{question}`

Examples:
- `M1_L1_Q1` = Module 1, Lesson 1.1, Question 1
- `M1_L1_Q2` = Module 1, Lesson 1.1, Question 2
- `M1_L2_Q1` = Module 1, Lesson 1.2, Question 1
- `M2_L1_Q1` = Module 2, Lesson 2.1, Question 1

**Important**: 
- `moduleId` must match: `"M1"`, `"M2"`, or `"M3"`
- `lessonId` format: `"1.1"`, `"1.2"`, `"1.3"`, `"2.1"`, `"2.2"`, `"2.3"`, `"3.1"`, `"3.2"`
- The number before the decimal in `lessonId` should match the module number (1.1 for M1, 2.1 for M2, etc.)

---

## 📝 Complete Example: Adding a New Activity

### Example: Module 1, Lesson 1.1, Question 2 (Van)

**Backend** (`backend/app/data/activity_items.py`):

```python
# Add after the existing M1_L1_Q1 activity
ActivityItem(
    id="M1_L1_Q2",
    moduleId="M1",
    lessonId="1.1",
    type="image_to_word",
    instruction="Match the picture to the correct word.",
    instructionTts="Look at the picture and click the word that matches.",
    stimulusImageUrl="/images/module1/lesson1/van.png",
    stimulusImageAlt="A blue van on the road",
    stimulusDescription="A blue van",
    difficulty="easy",
    options=[
        ActivityOption(id="A", label="Van", isCorrect=True, ttsText="van"),
        ActivityOption(id="B", label="Fan", isCorrect=False, ttsText="fan"),
        ActivityOption(id="C", label="Man", isCorrect=False, ttsText="man"),
    ],
    accessibility=ActivityAccessibility(
        recommendedFor=["Dyslexia"],
        enableTtsOnHover=True,
        showProgressBar=False,
        avoidMetaphors=True,
        consistentFeedback=True
    )
),
```

**Frontend** (`Frontend/src/data/activityItems.ts`):

```typescript
// Add after the existing M1_L1_Q1 activity
{
  id: "M1_L1_Q2",
  moduleId: "M1",
  lessonId: "1.1",
  type: "image_to_word",
  instruction: "Match the picture to the correct word.",
  instructionTts: "Look at the picture and click the word that matches.",
  stimulusImageUrl: "/images/module1/lesson1/van.png",
  stimulusImageAlt: "A blue van on the road",
  stimulusDescription: "A blue van",
  difficulty: "easy",
  options: [
    { id: "A", label: "Van", isCorrect: true, ttsText: "van" },
    { id: "B", label: "Fan", isCorrect: false, ttsText: "fan" },
    { id: "C", label: "Man", isCorrect: false, ttsText: "man" }
  ],
  accessibility: {
    recommendedFor: ["Dyslexia"],
    enableTtsOnHover: true,
    showProgressBar: false,
    avoidMetaphors: true,
    consistentFeedback: true
  }
},
```

---

## ✅ Checklist

When adding a new activity:

- [ ] Added to `backend/app/data/activity_items.py` (Python format)
- [ ] Added to `Frontend/src/data/activityItems.ts` (TypeScript format)
- [ ] `id` is unique and follows naming convention
- [ ] `moduleId` matches the module (M1, M2, or M3)
- [ ] `lessonId` format is correct (e.g., "1.1" for Module 1, Lesson 1)
- [ ] At least one option has `isCorrect: true`
- [ ] Image paths are correct (if using images)
- [ ] TTS text is provided for options (for Dyslexia support)
- [ ] Accessibility settings are appropriate

---

## 🔄 After Adding Activities

1. **Restart the backend** (if running):
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8030
   ```

2. **Restart the frontend** (if running):
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test**: Navigate to the module and verify the new activity appears in sequence.

---

## 💡 Tips

- **Keep activities in order**: Sort by `lessonId` and then by question number within each lesson
- **Use consistent naming**: Follow the `M{module}_L{lesson}_Q{question}` pattern
- **Test incrementally**: Add a few activities at a time and test to ensure they work
- **Image paths**: Make sure image files exist in the `public/images/` directory (frontend) or are accessible via the backend

---

## 🚨 Common Mistakes to Avoid

1. **Forgetting to add to both files** - Backend and frontend must be in sync
2. **Wrong moduleId/lessonId format** - Must match exactly (M1, M2, M3 and "1.1", "1.2", etc.)
3. **Duplicate IDs** - Each activity must have a unique `id`
4. **No correct answer** - At least one option must have `isCorrect: true`
5. **Missing commas** - Python lists need commas between items

---

## 📚 Quick Reference: Field Descriptions

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `id` | ✅ | Unique identifier | `"M1_L1_Q2"` |
| `moduleId` | ✅ | Module number | `"M1"`, `"M2"`, `"M3"` |
| `lessonId` | ✅ | Lesson identifier | `"1.1"`, `"1.2"`, `"2.1"` |
| `type` | ✅ | Activity type | `"image_to_word"` |
| `instruction` | ✅ | Main instruction text | `"Match the picture..."` |
| `instructionTts` | ❌ | TTS version of instruction | `"Look at the picture..."` |
| `stimulusImageUrl` | ❌ | Image path | `"/images/module1/lesson1/pig.png"` |
| `stimulusImageAlt` | ❌ | Image alt text | `"A pink pig"` |
| `stimulusDescription` | ❌ | Description for TTS | `"A pink pig"` |
| `stimulusEmoji` | ❌ | Emoji instead of image | `"🦋"` |
| `difficulty` | ✅ | Difficulty level | `"easy"`, `"medium"`, `"hard"` |
| `options` | ✅ | Answer choices | Array of `ActivityOption` |
| `accessibility` | ✅ | Accessibility settings | `ActivityAccessibility` object |

