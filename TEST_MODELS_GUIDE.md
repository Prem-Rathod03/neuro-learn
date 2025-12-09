# How to Test Your ML & NLP Models

This guide shows you **exactly** how to verify your models are working.

---

## Quick Test: Are Models Running?

### Step 1: Check if models are loaded

```bash
# In your backend terminal, look for these startup messages:
cd "/Users/premrathod/Documents/Neuro Learn/backend"
uvicorn app.main:app --reload --port 8030

# You should see models being loaded/trained when you first request an activity
```

### Step 2: Test each model individually

---

## Test 1: ML Models (Difficulty Prediction)

**What it does:** Recommends activity difficulty based on your performance.

### Test it:

1. **Open browser console** (F12 → Console tab)

2. **Submit some activities** with different results:
   - Answer 3 questions correctly (quickly)
   - Answer 2 questions incorrectly (slowly)

3. **Check backend terminal** - you should see:
   ```
   ML recommendation: topic=reading, difficulty=easy, modality=text
   ```

4. **Check MongoDB** to see predictions:
   ```bash
   mongosh
   use neuro_learn
   db.ml_predictions.find().pretty()
   ```
   
   You should see something like:
   ```json
   {
     "userId": "user@example.com",
     "timestamp": ISODate("2024-12-09T..."),
     "features": {
       "avg_accuracy": 0.67,
       "avg_time": 15.5,
       "avg_difficulty_rating": 3,
       "avg_focus_rating": 3,
       "avg_attention_score": 0.7
     },
     "prediction": {
       "topic": "reading",
       "difficulty": "medium",
       "modality": "text"
     }
   }
   ```

### Expected behavior:
- ✅ If you answer correctly → Next activity should be "medium" or "hard"
- ✅ If you answer incorrectly → Next activity should be "easy" or "medium"
- ✅ Fast answers → System recommends harder content
- ✅ Slow answers → System recommends easier content

---

## Test 2: NLP Model (DistilBERT - Sentiment Analysis)

**What it does:** Analyzes your feedback to detect confusion or frustration.

### Test it:

1. **Submit an activity with feedback:**
   - After answering a question, type in the feedback box:
   - **Positive:** "This was easy and fun!"
   - **Negative:** "I don't understand this at all, it's confusing"
   - **Neutral:** "Okay question"

2. **Check backend terminal** - you should see:
   ```
   Sentiment analysis: score=0.85, confused=False  (for positive)
   Sentiment analysis: score=-0.65, confused=True  (for negative)
   ```

3. **Check MongoDB:**
   ```bash
   mongosh
   use neuro_learn
   db.nlp_analyses.find().pretty()
   ```
   
   You should see:
   ```json
   {
     "userId": "user@example.com",
     "timestamp": ISODate("2024-12-09T..."),
     "text": "I don't understand this at all",
     "sentiment_score": -0.68,
     "confusion_flag": true
   }
   ```

4. **Check interactions collection:**
   ```bash
   db.interactions.find({"confusionFlag": true}).pretty()
   ```

### Expected behavior:
- ✅ Positive feedback → `sentiment_score` > 0.3, `confusion_flag` = false
- ✅ Negative feedback → `sentiment_score` < -0.3, `confusion_flag` = true
- ✅ Confused students get flagged → System can adapt

---

## Test 3: LLM Model (Rephrase/Simplify)

**What it does:** Simplifies complex questions using Ollama or Gemini.

### Test it:

1. **Start an activity** in the frontend

2. **Click the "Rephrase / Simplify" button**

3. **Check backend terminal** - you should see:
   ```
   Rephrase request: question=Match the picture to the correct word...
   Ollama raw response: Look at the picture. Click on the word...
   Rephrase result: Look at the picture. Click on the word...
   ```

4. **Check the frontend** - The simplified question should appear below the button

5. **Check MongoDB:**
   ```bash
   mongosh
   use neuro_learn
   db.rephrase_requests.find().pretty()
   ```
   
   You should see:
   ```json
   {
     "timestamp": ISODate("2024-12-09T..."),
     "original_question": "Match the picture to the correct word.",
     "simplified_question": "Look at the picture. Click on the word that matches.",
     "neurotype": "Dyslexia",
     "was_simplified": true
   }
   ```

### Expected behavior:
- ✅ Simplified text should be **different** from original
- ✅ Simplified text should be **simpler/shorter**
- ✅ Works for students with Dyslexia, ADHD, ASD

### If rephrase isn't working:
- Check if Ollama is running: `curl http://localhost:11434/api/tags`
- Check `.env` file has `USE_OLLAMA=true` or valid `LLM_API_KEY`
- Check backend logs for errors

---

## Test 4: Check Analytics Dashboard

**See all models working together:**

### Option 1: API Call
```bash
curl http://127.0.0.1:8030/api/analytics/models | python3 -m json.tool
```

### Option 2: Browser
1. Go to: `http://127.0.0.1:8030/docs`
2. Find `/api/analytics/models`
3. Click "Try it out" → "Execute"

### What you should see:
```json
{
  "total_interactions": 15,
  "ml_analytics": {
    "total_recommendations": 15,
    "difficulty_predictions": {
      "easy": 5,
      "medium": 7,
      "hard": 3
    },
    "accuracy_rate": 0.73
  },
  "nlp_analytics": {
    "sentiment_analyses": 5,
    "average_sentiment": 0.45,
    "confusion_detections": 2
  }
}
```

### Expected behavior:
- ✅ Numbers increase as you use the system
- ✅ Accuracy rate improves over time
- ✅ Confusion detections show struggling students

---

## Test 5: End-to-End Test

**Full workflow to see all models in action:**

### Steps:

1. **Register a new user** with neurotype "Dyslexia"

2. **Complete 5 activities:**
   - Get 3 correct (answer quickly)
   - Get 2 wrong (answer slowly)
   - Submit feedback: "Some questions are too hard"

3. **Click "Rephrase"** on a question

4. **Check what happened:**

   **MongoDB - Interactions:**
   ```bash
   mongosh
   use neuro_learn
   db.interactions.count()  # Should be 5
   db.interactions.find({isCorrect: true}).count()  # Should be 3
   db.interactions.find({isCorrect: false}).count()  # Should be 2
   ```

   **MongoDB - ML Predictions:**
   ```bash
   db.ml_predictions.count()  # Should be 5 (one per activity request)
   db.ml_predictions.find().limit(1).pretty()  # See a prediction
   ```

   **MongoDB - NLP Analyses:**
   ```bash
   db.nlp_analyses.count()  # Should be 5 (if you submitted feedback 5 times)
   db.nlp_analyses.find({confusion_flag: true}).count()  # Check confused submissions
   ```

   **MongoDB - Rephrase Requests:**
   ```bash
   db.rephrase_requests.count()  # Should be 1 (one rephrase click)
   ```

5. **Check Analytics:**
   ```bash
   curl http://127.0.0.1:8030/api/analytics/models | python3 -m json.tool
   ```

---

## Verification Checklist

Use this checklist to verify each model:

### ML Models (RandomForest, KMeans, MLP)
- [ ] Backend logs show "ML recommendation: ..."
- [ ] `db.ml_predictions` has documents
- [ ] Difficulty adapts based on performance (easy → medium → hard)
- [ ] `/api/analytics/models` shows ML usage stats

### NLP Model (DistilBERT)
- [ ] Backend logs show "Sentiment analysis: ..."
- [ ] `db.nlp_analyses` has documents
- [ ] Positive feedback → positive score
- [ ] Negative feedback → negative score + confusion flag
- [ ] `/api/analytics/models` shows sentiment distribution

### LLM Model (Ollama/Gemini)
- [ ] Backend logs show "Rephrase request: ..." and "Rephrase result: ..."
- [ ] `db.rephrase_requests` has documents
- [ ] Simplified text is different from original
- [ ] Simplified text is simpler/shorter
- [ ] Works when clicking "Rephrase / Simplify"

---

## Troubleshooting

### Models not loading?
```bash
# Check if model files exist
ls -lh backend/models/
# You should see:
# - difficulty_rf.joblib
# - behaviour_kmeans.joblib
# - activity_mlp.joblib
```

### DistilBERT not working?
```bash
# Check if transformers is installed
pip list | grep transformers
pip list | grep torch

# If missing:
pip install transformers torch
```

### Ollama not working?
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running:
ollama serve
# In another terminal:
ollama pull llama3.2
```

### No data in MongoDB?
```bash
# Check MongoDB connection
mongosh
show dbs
use neuro_learn
show collections
# You should see: interactions, ml_predictions, nlp_analyses, rephrase_requests
```

---

## Quick Debug Commands

```bash
# 1. Check if backend is running
lsof -ti:8030 && echo "✓ Backend running" || echo "✗ Start backend"

# 2. Check MongoDB
mongosh --eval "db.getMongo()" && echo "✓ MongoDB running" || echo "✗ Start MongoDB"

# 3. Check Ollama (if using)
curl -s http://localhost:11434/api/tags >/dev/null && echo "✓ Ollama running" || echo "✗ Start Ollama"

# 4. Test analytics endpoint
curl -s http://127.0.0.1:8030/api/analytics/models | head -5

# 5. Count interactions
mongosh neuro_learn --quiet --eval "db.interactions.count()"

# 6. Count ML predictions
mongosh neuro_learn --quiet --eval "db.ml_predictions.count()"

# 7. Count NLP analyses
mongosh neuro_learn --quiet --eval "db.nlp_analyses.count()"
```

---

## What "Working" Looks Like

### ✅ ML Models Working:
- Backend logs show predictions
- Difficulty adapts to performance
- MongoDB has `ml_predictions` documents
- Analytics show accuracy rate

### ✅ NLP Models Working:
- Sentiment scores appear in MongoDB
- Confusion flags detect struggling students
- Rephrase button returns simplified text
- Analytics show sentiment distribution

### ✅ System Learning:
- More data → better predictions
- Accuracy rate improves
- Students get appropriate difficulty
- Confused students get help

---

## Next Steps

1. ✅ Complete the end-to-end test above
2. ✅ Check MongoDB collections have data
3. ✅ View analytics dashboard
4. ✅ Verify models are adapting to behavior

The models are **actively learning** from every interaction! 🚀

