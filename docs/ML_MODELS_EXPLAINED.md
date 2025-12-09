# 🤖 ML Models in Neuro Learn - Complete Guide

## Overview

Your Neuro Learn platform uses **3 Machine Learning models** to personalize learning experiences for neurodiverse students. These models analyze student behavior and performance to recommend the best activities.

---

## 🎯 Purpose of ML Models

The ML models work together to:
1. **Predict optimal difficulty level** for each student
2. **Group students by learning behavior** (clustering)
3. **Recommend activity type and format** (topic + modality)

This creates a **personalized, adaptive learning experience** that adjusts to each student's needs in real-time.

---

## 📊 The 3 ML Models

### 1. **Random Forest Classifier** - Difficulty Prediction
**File:** `backend/app/services/ml_engine.py`

**What it does:**
- Predicts the optimal difficulty level (easy, medium, hard) for the next activity
- Uses student's past performance data to make predictions

**Input Features:**
- Average accuracy (how many questions answered correctly)
- Average time taken per question
- Average difficulty rating (student's self-reported difficulty)
- Average focus rating (student's self-reported focus level)
- Average attention score
- Average sentiment (from feedback analysis)
- Confusion rate (how often student is confused)

**Output:**
- `"easy"`, `"medium"`, or `"hard"`

**Example:**
```
If student has:
- Low accuracy (0.3) → Predicts "easy"
- Medium accuracy (0.6) → Predicts "medium"  
- High accuracy (0.9) → Predicts "hard"
```

---

### 2. **K-Means Clustering** - Behavior Grouping
**File:** `backend/app/services/ml_engine.py`

**What it does:**
- Groups students into clusters based on learning behavior patterns
- Helps identify similar learners (e.g., "fast learners", "struggling students", "visual learners")

**Input Features:**
- Same features as Random Forest (accuracy, time, difficulty, focus, etc.)

**Output:**
- Cluster ID (0, 1, or 2) - represents behavior group

**Use Cases:**
- Identify students who need extra support
- Group students for collaborative learning
- Track learning patterns over time

**Example Clusters:**
- **Cluster 0:** Fast learners (high accuracy, low time)
- **Cluster 1:** Average learners (medium accuracy, medium time)
- **Cluster 2:** Struggling learners (low accuracy, high time)

---

### 3. **MLP Classifier (Neural Network)** - Activity Recommendation
**File:** `backend/app/services/ml_engine.py`

**What it does:**
- Recommends the best activity type and format for the student
- Predicts both **topic** (reading/math) and **modality** (text/audio/visual)

**Input Features:**
- Same features as other models

**Output:**
- Topic: `"reading"` or `"math"`
- Modality: `"text"`, `"audio"`, or `"visual"`

**Example:**
```
If student:
- Struggles with reading → Recommends "reading" + "audio" (TTS support)
- Excels at math → Recommends "math" + "visual" (visual learning)
- Needs variety → Alternates between topics and modalities
```

---

## 🔄 How It Works - The Complete Flow

### Step 1: Student Submits Answer
When a student submits an activity answer, the system stores:
- `isCorrect` (true/false)
- `timeTaken` (seconds)
- `difficultyRating` (1-5)
- `focusRating` (1-5)
- `feedbackText` (optional)
- `attentionScore` (0-1)

### Step 2: Feature Building
**File:** `backend/app/services/feature_builder.py`

The system aggregates past interactions:
```python
features = {
    "avg_accuracy": 0.75,        # 75% correct
    "avg_time": 45.2,             # 45 seconds average
    "avg_difficulty_rating": 3.2, # Medium difficulty
    "avg_focus_rating": 3.8,      # Good focus
    "avg_attention_score": 0.85,  # High attention
    "avg_sentiment": 0.3,         # Positive sentiment
    "confusion_rate": 0.15        # 15% confused
}
```

### Step 3: ML Prediction
**File:** `backend/app/routes/activity.py` → `get_next_activity()`

```python
# Get user's past interactions
logs = await get_user_interactions(userId)

# Build features from logs
features = feature_builder.build_features(logs)

# Get ML recommendation
reco = ml_engine.recommend_next(features)
# Returns: Reco(topic="reading", difficulty="medium", modality="audio")
```

### Step 4: Activity Selection
The system uses the ML recommendation to select the next activity:
- Filters activities by `topic` (reading/math)
- Filters by `difficulty` (easy/medium/hard)
- Filters by `modality` (text/audio/visual)
- Returns the best matching activity

### Step 5: Logging
All predictions are logged to MongoDB for:
- Performance tracking
- Model improvement
- Admin analytics

---

## 📈 Where ML Models Are Used

### 1. **Activity Recommendation API**
**Endpoint:** `GET /api/activity/next?userId=...`

**Code:** `backend/app/routes/activity.py`

```python
@router.get("/next")
async def get_next_activity(userId: str, ...):
    # 1. Get user's past interactions
    logs = await get_user_interactions(userId)
    
    # 2. Build features
    features = feature_builder.build_features(logs)
    
    # 3. Get ML recommendation
    reco = ml_engine.recommend_next(features)
    # reco.topic, reco.difficulty, reco.modality
    
    # 4. Select matching activity
    activity = select_activity_by_recommendation(reco)
    
    # 5. Log prediction
    await log_ml_prediction(db, userId, features, reco)
    
    return activity
```

### 2. **Admin Panel - ML Analytics**
**Endpoint:** `GET /api/admin/ml-stats`

**Code:** `backend/app/routes/admin.py`

Shows:
- Total ML predictions made
- Difficulty distribution (easy/medium/hard)
- Topic recommendations (reading/math)
- Modality recommendations (text/audio/visual)
- Accuracy rate (how often recommendations lead to correct answers)

### 3. **Analytics Dashboard**
**Endpoint:** `GET /api/analytics/ml`

**Code:** `backend/app/routes/analytics.py`

Provides:
- ML model usage statistics
- Recommendation effectiveness
- User outcomes after recommendations

---

## 🎓 Real-World Example

### Scenario: Student with Dyslexia

**Student Profile:**
- NeuroFlags: `["Dyslexia"]`
- Past Performance:
  - Accuracy: 0.4 (struggling)
  - Time: 90 seconds (slow)
  - Confusion rate: 0.6 (high confusion)

**ML Model Predictions:**

1. **Random Forest:**
   - Input: Low accuracy (0.4) → **Output: `"easy"`**
   - Reason: Student struggling, needs easier content

2. **K-Means:**
   - Input: Low accuracy + high time → **Output: `Cluster 2`** (struggling learner)
   - Reason: Identifies student needs extra support

3. **MLP Classifier:**
   - Input: High confusion + Dyslexia flag → **Output: `topic="reading"`, `modality="audio"`**
   - Reason: Reading tasks with audio support (TTS) help Dyslexia learners

**Result:**
- System recommends: **Easy reading activity with audio/TTS support**
- Student gets appropriate content that matches their needs

---

## 🔧 Model Training

### Current Status: Dummy Models

**File:** `backend/app/services/ml_engine.py` → `_train_dummy_models()`

The models are currently trained on **synthetic data** (dummy data) because:
- No real training data yet
- Models need to work immediately
- Can be replaced with real data later

### Future: Real Training

To train on real data:

1. **Collect Data:**
   - Use `seed_dummy_data.py` to generate test data
   - Or wait for real user interactions

2. **Train Models:**
   ```python
   # Create training script
   python train_models.py
   ```

3. **Save Models:**
   - Models saved to `backend/models/`
   - `difficulty_rf.joblib` - Random Forest
   - `behaviour_kmeans.joblib` - K-Means
   - `activity_mlp.joblib` - MLP

4. **Models Auto-Load:**
   - Backend automatically loads saved models
   - Falls back to dummy models if not found

---

## 📊 Model Performance Tracking

### Admin Panel
**URL:** `http://localhost:8080/admin`

Shows:
- Total ML predictions
- Difficulty distribution
- Recommendation accuracy
- Model usage statistics

### Logs
All predictions logged to MongoDB:
- Collection: `ml_predictions`
- Fields: `userId`, `features`, `prediction`, `timestamp`

---

## 🎯 Benefits of ML Models

1. **Personalization:**
   - Each student gets activities matched to their level
   - Adapts in real-time as student improves

2. **Efficiency:**
   - Reduces frustration (not too hard)
   - Prevents boredom (not too easy)

3. **Support for Neurodiversity:**
   - Recommends appropriate modalities (audio for Dyslexia)
   - Adjusts difficulty based on performance
   - Identifies students who need extra help

4. **Data-Driven:**
   - Decisions based on actual performance data
   - Not just guessing

---

## 🔍 Key Files

| File | Purpose |
|------|---------|
| `backend/app/services/ml_engine.py` | ML model definitions and predictions |
| `backend/app/services/feature_builder.py` | Converts user logs to ML features |
| `backend/app/routes/activity.py` | Uses ML to recommend next activity |
| `backend/app/routes/admin.py` | ML analytics and monitoring |
| `backend/app/services/model_logger.py` | Logs ML predictions to MongoDB |

---

## 💡 Summary

**ML Models = Smart Personalization**

Your Neuro Learn platform uses ML to:
- ✅ Predict optimal difficulty
- ✅ Group students by behavior
- ✅ Recommend best activity type and format
- ✅ Adapt to each student's needs in real-time
- ✅ Support neurodiverse learners effectively

**The result:** A personalized, adaptive learning experience that helps every student succeed! 🎓

