# 🧠 NLP Models in Neuro Learn - Complete Guide

## Overview

Your Neuro Learn platform uses **Natural Language Processing (NLP)** to understand student feedback, detect confusion, and simplify questions for neurodiverse learners. NLP helps make the platform more accessible and responsive to student needs.

---

## 🎯 Purpose of NLP Models

The NLP system provides:
1. **Sentiment Analysis** - Understands how students feel about activities
2. **Confusion Detection** - Identifies when students are struggling
3. **Question Simplification** - Rephrases complex questions into simpler language
4. **Feedback Understanding** - Extracts insights from student comments

This creates a **responsive, adaptive system** that understands student needs through natural language.

---

## 📊 The NLP Components

### 1. **DistilBERT** - Sentiment Analysis & Confusion Detection
**File:** `backend/app/services/nlp_engine.py`

**What it does:**
- Analyzes student feedback text to detect sentiment (positive/negative)
- Identifies confusion and frustration from feedback
- Uses pre-trained DistilBERT model (lightweight, fast)

**Model Details:**
- **Model:** `distilbert-base-uncased-finetuned-sst-2-english`
- **Type:** Transformer-based (Hugging Face)
- **Task:** Sentiment Classification (SST-2 dataset)
- **Output:** Sentiment score (-1.0 to +1.0) and confusion flag (True/False)

**How it works:**
```python
# Input: Student feedback text
feedback = "I don't understand this question. It's too hard."

# Process:
1. Tokenize text using DistilBERT tokenizer
2. Run through DistilBERT model
3. Get probabilities for negative/positive
4. Calculate sentiment score: pos_prob - neg_prob
5. Flag as confused if sentiment < -0.3

# Output:
sentiment_score = -0.7  # Negative sentiment
confusion_flag = True   # Student is confused
```

**Fallback:**
If DistilBERT is not available, uses simple rule-based analysis:
- Checks for negative keywords: "confus", "difficult", "don't understand"
- Checks for positive keywords: "easy", "fun", "understand"
- Calculates sentiment based on keyword matches

---

### 2. **LLM (Large Language Model)** - Question Rephrasing
**File:** `backend/app/services/nlp_engine.py` → `rephrase_text()`

**What it does:**
- Simplifies complex questions into easier language
- Adapts language based on neurotype (Dyslexia, ADHD, ASD)
- Makes questions more accessible for neurodiverse learners

**Supported LLMs:**
1. **Ollama** (Local, recommended)
   - Models: `llama3.2`, `llama3.1`, `mistral`, `qwen2.5`
   - Runs locally, no API costs
   - Configured in `.env`: `USE_OLLAMA=true`

2. **Google Gemini** (Cloud)
   - Model: `gemini-2.0-flash`
   - Requires API key
   - Falls back to Ollama if quota exceeded

**How it works:**
```python
# Input: Complex question
question = "Match the picture to the correct word."

# Process:
1. Build prompt with neurotype-specific guidance
2. Send to LLM (Ollama or Gemini)
3. LLM generates simplified version
4. Parse and clean response
5. Apply fallback if needed

# Output:
simplified = "Find the word that goes with the picture."
```

**Neurotype-Specific Guidance:**
- **Dyslexia:** Simple words, short sentences, avoid complex spelling
- **ADHD:** Direct, action-oriented, concise language
- **ASD:** Literal language, explicit, step-by-step, no metaphors

**Fallback Logic:**
If LLM fails or returns same text, applies word replacements:
- "match" → "find" or "pick"
- "correct" → "right"
- "select" → "choose"
- "identify" → "find"

---

## 🔄 How NLP Works - The Complete Flow

### Flow 1: Feedback Analysis

#### Step 1: Student Submits Feedback
When a student submits an activity, they can provide optional feedback:
```json
{
  "activityId": "M1_L1_Q1",
  "answer": "cat",
  "isCorrect": true,
  "feedbackText": "This was confusing. I don't understand."
}
```

#### Step 2: NLP Analysis
**File:** `backend/app/routes/activity.py` → `submit_activity()`

```python
if payload.feedbackText:
    # Analyze feedback using DistilBERT
    sentiment_score, confusion_flag = nlp_engine.analyze_feedback(
        payload.feedbackText
    )
    # sentiment_score: -0.8 (very negative)
    # confusion_flag: True (student is confused)
```

#### Step 3: Store Results
```python
doc["sentimentScore"] = sentiment_score
doc["confusionFlag"] = confusion_flag
```

#### Step 4: Use in ML Features
The confusion flag is used in ML feature building:
```python
features = {
    "confusion_rate": 0.6,  # 60% of feedback shows confusion
    "avg_sentiment": -0.5,   # Negative sentiment
    ...
}
```

#### Step 5: Trigger Support Modes
**Well-Being Layer** uses confusion flag:
- **ASD Calm Mode:** Triggered if `confusionFlag = True`
- **Dyslexia Support:** Triggered if confusion + reading task
- **ADHD Break:** Triggered if confusion + multiple wrong answers

---

### Flow 2: Question Rephrasing

#### Step 1: Student Clicks "Rephrase / Simplify"
**Frontend:** `Frontend/src/pages/LearningActivity.tsx`

```typescript
const handleRephrase = async () => {
  const payload = {
    question: activity.instruction,
    neuroType: user.neuroFlags[0],  // "Dyslexia", "ADHD", "ASD"
    confusionFlag: feedback.includes('confus')
  };
  
  const simplified = await rephrase(payload);
  setSimplified(simplified);
};
```

#### Step 2: Backend Processes Request
**File:** `backend/app/routes/rephrase.py`

```python
@router.post("/rephrase")
async def rephrase(req: RephraseRequest):
    # Call NLP engine
    simplified_q, simplified_opts = await nlp_engine.rephrase_text(req)
    
    # Log for tracking
    await log_rephrase_request(db, userId, req.question, simplified_q)
    
    return RephraseResponse(simplifiedQuestion=simplified_q)
```

#### Step 3: LLM Simplification
**File:** `backend/app/services/nlp_engine.py` → `_rephrase_with_ollama()`

```python
# Build prompt
prompt = f"""
Task: Simplify this question for a 6-8 year old child.
Child's needs: {neuroType}. {neuro_guidance}

Original: {question}
Simplified: 
"""

# Call Ollama
response = await client.post(ollama_endpoint, json={
    "model": "llama3.2",
    "prompt": prompt
})

# Parse and return
simplified = parse_response(response)
```

#### Step 4: Display Simplified Question
Frontend shows the simplified version to the student.

---

## 📈 Where NLP Is Used

### 1. **Activity Submission API**
**Endpoint:** `POST /api/activity/submit`

**Code:** `backend/app/routes/activity.py`

**What it does:**
- Analyzes feedback text when student submits answer
- Detects sentiment and confusion
- Stores results in MongoDB
- Logs NLP analysis for tracking

**Example:**
```python
# Student submits:
{
  "feedbackText": "I'm confused. This is too hard."
}

# NLP Analysis:
sentiment_score = -0.7
confusion_flag = True

# Stored in interaction:
{
  "sentimentScore": -0.7,
  "confusionFlag": True,
  ...
}
```

---

### 2. **Rephrase API**
**Endpoint:** `POST /api/rephrase`

**Code:** `backend/app/routes/rephrase.py`

**What it does:**
- Simplifies questions using LLM (Ollama/Gemini)
- Adapts language for neurotype
- Returns simplified version

**Example:**
```python
# Request:
{
  "question": "Match the picture to the correct word",
  "neuroType": "Dyslexia"
}

# Response:
{
  "simplifiedQuestion": "Find the word that goes with the picture"
}
```

---

### 3. **ML Feature Building**
**File:** `backend/app/services/feature_builder.py`

**What it does:**
- Aggregates NLP results from past interactions
- Calculates average sentiment and confusion rate
- Provides features for ML models

**Features:**
```python
features = {
    "avg_sentiment": 0.2,        # Slightly positive
    "confusion_rate": 0.3,       # 30% confused
    ...
}
```

---

### 4. **Well-Being Layer**
**Files:** `Frontend/src/pages/LearningActivity.tsx`

**What it does:**
- Uses `confusionFlag` to trigger support modes
- ASD Calm Mode: Triggered by confusion
- Dyslexia Support: Triggered by confusion + reading task

**Example:**
```typescript
// Check for confusion in feedback
const hasConfusion = feedback.toLowerCase().includes('confus');

// Trigger ASD Calm Mode
if (hasASD && hasConfusion) {
  setCalmMode(true);
  supportModeToSend = 'ASD_CALM';
}
```

---

### 5. **Admin Panel - NLP Analytics**
**Endpoint:** `GET /api/admin/nlp-stats`

**Code:** `backend/app/routes/admin.py`

**Shows:**
- Total NLP analyses performed
- Sentiment distribution
- Confusion rate across users
- Rephrase request statistics

---

### 6. **Analytics Dashboard**
**Endpoint:** `GET /api/analytics/nlp`

**Code:** `backend/app/routes/analytics.py`

**Provides:**
- NLP model usage statistics
- Sentiment trends over time
- Confusion detection accuracy
- Rephrase effectiveness

---

## 🎓 Real-World Examples

### Example 1: Confusion Detection

**Scenario:** Student struggling with reading activity

**Student Feedback:**
```
"I don't understand this. The words are too hard. I'm confused."
```

**NLP Analysis:**
```python
sentiment_score = -0.85  # Very negative
confusion_flag = True    # Confused
```

**System Response:**
1. **ML Models:** Recommends easier difficulty
2. **Well-Being Layer:** Triggers Dyslexia Support Mode
3. **TTS:** Auto-enables text-to-speech
4. **Next Activity:** Easier reading task with audio support

---

### Example 2: Question Simplification

**Scenario:** Student with Dyslexia needs simpler question

**Original Question:**
```
"Match the picture to the correct word."
```

**NLP Rephrase (Ollama):**
```
Input: {
  "question": "Match the picture to the correct word",
  "neuroType": "Dyslexia"
}

Prompt: "Simplify for Dyslexia: Use simple words, short sentences..."

Output: "Find the word that goes with the picture."
```

**Result:**
- Student sees simplified version
- Easier to understand
- Better learning experience

---

### Example 3: Sentiment Tracking

**Scenario:** Tracking student progress through feedback

**Week 1 Feedback:**
```
"This is too hard. I'm frustrated."
→ sentiment_score: -0.9, confusion_flag: True
```

**Week 2 Feedback:**
```
"This is okay. I understand it better now."
→ sentiment_score: 0.2, confusion_flag: False
```

**Week 3 Feedback:**
```
"This is fun! I like learning this way."
→ sentiment_score: 0.8, confusion_flag: False
```

**System Response:**
- Tracks improvement in sentiment
- Adjusts difficulty as student improves
- Celebrates positive feedback

---

## 🔧 Technical Details

### DistilBERT Setup

**Installation:**
```bash
pip install transformers torch
```

**Model Loading:**
- Lazy loading (only loads when first used)
- Cached in memory after first load
- Falls back to rule-based if unavailable

**Performance:**
- Fast inference (~50ms per text)
- Low memory usage (~250MB)
- Works on CPU (no GPU required)

---

### Ollama Setup

**Installation:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull llama3.2
```

**Configuration:**
```env
# backend/.env
USE_OLLAMA=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

**Performance:**
- Local inference (no API costs)
- Fast response (~2-5 seconds)
- Privacy-friendly (data stays local)

---

### Gemini Setup (Alternative)

**Configuration:**
```env
# backend/.env
USE_OLLAMA=false
LLM_API_KEY=your_gemini_api_key
LLM_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

**Performance:**
- Cloud-based (requires internet)
- Fast response (~1-3 seconds)
- May have quota limits

---

## 📊 NLP Data Flow

```
Student Feedback
      ↓
[DistilBERT Analysis]
      ↓
Sentiment Score + Confusion Flag
      ↓
[Stored in MongoDB]
      ↓
[Used in ML Features]
      ↓
[Triggers Support Modes]
      ↓
[Better Learning Experience]
```

```
Student Clicks "Rephrase"
      ↓
[LLM Request (Ollama/Gemini)]
      ↓
[Simplified Question]
      ↓
[Displayed to Student]
      ↓
[Easier to Understand]
```

---

## 🎯 Benefits of NLP

1. **Understanding Student Needs:**
   - Detects confusion and frustration
   - Identifies positive experiences
   - Tracks sentiment over time

2. **Accessibility:**
   - Simplifies complex questions
   - Adapts language for neurotypes
   - Makes learning more accessible

3. **Personalization:**
   - Uses feedback to adjust difficulty
   - Triggers appropriate support modes
   - Improves learning outcomes

4. **Data-Driven Insights:**
   - Tracks sentiment trends
   - Identifies common confusion points
   - Helps improve content

---

## 🔍 Key Files

| File | Purpose |
|------|---------|
| `backend/app/services/nlp_engine.py` | NLP model definitions and functions |
| `backend/app/routes/rephrase.py` | Rephrase API endpoint |
| `backend/app/routes/activity.py` | Feedback analysis on submission |
| `backend/app/services/feature_builder.py` | Uses NLP results in ML features |
| `backend/app/routes/admin.py` | NLP analytics and monitoring |
| `backend/app/services/model_logger.py` | Logs NLP analyses to MongoDB |

---

## 💡 Summary

**NLP = Understanding & Simplification**

Your Neuro Learn platform uses NLP to:
- ✅ Analyze student feedback (sentiment & confusion)
- ✅ Simplify questions for accessibility
- ✅ Adapt language for neurotypes
- ✅ Trigger appropriate support modes
- ✅ Track student sentiment over time

**The result:** A responsive, accessible learning platform that understands student needs and adapts in real-time! 🎓

---

## 🚀 Future Enhancements

Potential improvements:
1. **Multi-language Support:** Extend NLP to other languages
2. **Emotion Detection:** Detect specific emotions (frustration, excitement)
3. **Question Generation:** Generate new questions based on student needs
4. **Conversational AI:** Chatbot for student support
5. **Advanced Simplification:** More sophisticated text simplification

---

## 📚 Related Documentation

- **ML Models:** See `ML_MODELS_EXPLAINED.md`
- **Well-Being Layer:** See `WELLBEING_LAYER_IMPLEMENTATION.md`
- **TTS Guide:** See `TTS_USAGE_GUIDE.md`

