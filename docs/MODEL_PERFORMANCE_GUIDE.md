# ML & NLP Model Performance Guide

This guide explains how the ML and NLP models are helping your neurodiverse learning system and how to check their performance.

## 🤖 How Models Are Being Used

### ML Models (Machine Learning)

Your system uses **3 ML models** to personalize learning:

#### 1. **RandomForestClassifier** - Difficulty Prediction
- **Purpose**: Predicts the right difficulty level (easy/medium/hard) for the next activity
- **How it helps**: Adapts to each student's skill level automatically
- **When used**: Every time you request a new activity (`/api/activity/next`)
- **Input**: Your past performance (accuracy, time taken, focus ratings)
- **Output**: Recommended difficulty level

#### 2. **KMeans Clustering** - Learner Behavior Grouping
- **Purpose**: Groups students with similar learning patterns
- **How it helps**: Identifies learning styles (e.g., fast learners, careful learners, struggling learners)
- **When used**: Every time you request a new activity
- **Input**: Your behavior patterns (time spent, accuracy, attention)
- **Output**: Behavior cluster ID (used internally for personalization)

#### 3. **MLPClassifier** - Activity Recommendation
- **Purpose**: Recommends the best topic (reading/math) and modality (text/audio/visual)
- **How it helps**: Suggests activities that match your learning style
- **When used**: Every time you request a new activity
- **Input**: Your learning history and preferences
- **Output**: Recommended topic and modality (e.g., "reading + text", "math + visual")

### NLP Models (Natural Language Processing)

Your system uses **2 NLP models** to understand and help students:

#### 1. **DistilBERT** - Sentiment & Confusion Detection
- **Purpose**: Analyzes student feedback to detect confusion or frustration
- **How it helps**: Identifies when students are struggling and need extra help
- **When used**: Every time you submit feedback text
- **Input**: Your written feedback (e.g., "This is too hard", "I don't understand")
- **Output**: 
  - Sentiment score (-1.0 to +1.0)
  - Confusion flag (true/false)

#### 2. **LLM (Ollama/Gemini)** - Question Rephrasing
- **Purpose**: Simplifies complex questions for neurodiverse learners
- **How it helps**: Makes questions easier to understand for students with Dyslexia, ADHD, or ASD
- **When used**: Every time you click "Rephrase / Simplify"
- **Input**: Original question + your neurotype
- **Output**: Simplified version of the question

---

## 📊 How to Check Model Performance

### Method 1: Use the Analytics API (Recommended)

I've created a new analytics endpoint that shows model performance:

#### **View Overall Model Analytics**
```bash
# Get analytics for last 7 days
curl http://127.0.0.1:8030/api/analytics/models

# Get analytics for specific user
curl http://127.0.0.1:8030/api/analytics/models?userId=YOUR_USER_ID

# Get analytics for last 30 days
curl http://127.0.0.1:8030/api/analytics/models?days=30
```

#### **View Detailed Model Metrics**
```bash
curl http://127.0.0.1:8030/api/analytics/models/detailed
```

#### **In Browser**
1. Open: `http://127.0.0.1:8030/docs`
2. Find the `/api/analytics/models` endpoint
3. Click "Try it out" → "Execute"
4. See the JSON response with all model metrics

### Method 2: Check MongoDB Collections

The models log their predictions to MongoDB:

```bash
# Connect to MongoDB
mongosh

# View ML predictions
use neuro_learn
db.ml_predictions.find().pretty()

# View NLP sentiment analyses
db.nlp_analyses.find().pretty()

# View rephrase requests
db.rephrase_requests.find().pretty()
```

### Method 3: Check Backend Logs

The backend prints model usage in the terminal:

```bash
# Look for these in your backend terminal:
# - "ML recommendation: topic=X, difficulty=Y, modality=Z"
# - "Sentiment analysis: score=X, confused=Y"
# - "Rephrase request: ..."
```

---

## 📈 What the Analytics Show

The analytics endpoint returns:

### ML Analytics
- **Total recommendations**: How many times ML models suggested activities
- **Difficulty predictions**: Breakdown of easy/medium/hard recommendations
- **Topic recommendations**: How many reading vs math activities recommended
- **Accuracy rate**: How often students got questions correct after ML recommendations
- **User outcomes**: Success rate of ML-suggested activities

### NLP Analytics
- **Sentiment analyses**: How many feedback texts were analyzed
- **Sentiment distribution**: Positive/neutral/negative feedback breakdown
- **Confusion detections**: How many times students were flagged as confused
- **Average sentiment**: Overall student satisfaction score
- **Rephrase requests**: How many times questions were simplified

### Model Usage Summary
- Which models are active
- How many times each model was used
- What each model does

---

## 🎯 Interpreting the Results

### Good Signs ✅
- **High accuracy rate** (>70%): ML models are recommending appropriate activities
- **More positive sentiment**: Students are enjoying the activities
- **Few confusion flags**: Students understand the questions
- **Rephrase working**: Simplified questions are different from originals

### Areas for Improvement ⚠️
- **Low accuracy rate** (<50%): Models may need retraining with more data
- **Many confusion flags**: Questions might be too hard, or models need tuning
- **Rephrase returning same text**: LLM prompts may need improvement

---

## 🔧 Improving Model Performance

### 1. Collect More Data
- More user interactions = better predictions
- Encourage students to provide feedback
- Track more metrics (time, attention, etc.)

### 2. Retrain Models Periodically
- Models improve with more data
- Consider retraining weekly/monthly
- Use real student data instead of dummy data

### 3. Monitor Confusion Flags
- High confusion rate? Simplify questions more
- Track which activities cause confusion
- Adjust difficulty levels accordingly

### 4. Fine-tune LLM Prompts
- If rephrase isn't working, improve prompts
- Test different LLM models (try different Ollama models)
- Adjust simplification level based on neurotype

---

## 🚀 Quick Test

Test if models are working:

1. **Test ML Models**:
   ```bash
   # Submit a few activities, then check:
   curl http://127.0.0.1:8030/api/analytics/models
   # Should show ML recommendations and accuracy
   ```

2. **Test NLP Models**:
   - Submit feedback with text like "This is confusing"
   - Check analytics - should show negative sentiment and confusion flag
   - Use "Rephrase" button - should get simplified question

3. **Check Model Logs**:
   ```bash
   # In MongoDB
   db.ml_predictions.count()  # Should increase as you use the system
   db.nlp_analyses.count()   # Should increase when you submit feedback
   ```

---

## 📝 Example Analytics Response

```json
{
  "period_days": 7,
  "total_interactions": 45,
  "ml_analytics": {
    "total_recommendations": 45,
    "difficulty_predictions": {
      "easy": 20,
      "medium": 15,
      "hard": 10
    },
    "accuracy_rate": 0.73,
    "user_outcomes": {
      "correct_after_recommendation": 33,
      "incorrect_after_recommendation": 12
    }
  },
  "nlp_analytics": {
    "sentiment_analyses": 12,
    "average_sentiment": 0.45,
    "confusion_detections": 3
  },
  "summary": {
    "ml_models_helping": "ML models recommend personalized activities based on user performance",
    "nlp_models_helping": "NLP models analyze feedback for confusion and simplify questions"
  }
}
```

---

## 🎓 Next Steps

1. **Use the analytics endpoint** regularly to monitor performance
2. **Collect more data** by having students use the system
3. **Retrain models** periodically with new data
4. **Adjust prompts** if rephrase isn't working well
5. **Monitor confusion flags** to identify struggling students

The models are actively helping personalize learning for each student! 🚀

