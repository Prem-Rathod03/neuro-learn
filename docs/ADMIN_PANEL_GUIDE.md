# Admin Panel Guide 🎛️

## Overview

The Admin Panel provides comprehensive monitoring and analytics for your ML/NLP models, including:
- ML model prediction logs with user filtering
- NLP sentiment analysis logs
- Accuracy trend visualizations
- User performance statistics
- Real-time model performance metrics

---

## Features

### 1. 📊 Dashboard Overview
- **ML Predictions Count**: Total number of ML recommendations
- **NLP Analyses Count**: Total sentiment analyses performed
- **Overall Accuracy**: System-wide success rate
- **Active Users**: Number of users in the system

### 2. 📈 Accuracy Trends Chart
- Line chart showing accuracy over the last 7 days
- Visualizes how students are performing over time
- Helps identify trends and improvements

### 3. 🎯 Model Performance Breakdown
- **Difficulty Distribution**: Bar chart showing activity difficulty levels
- **Total Interactions**: All student-activity interactions
- **Confusion Rate**: Percentage of students flagged as confused

### 4. 👥 User Statistics Table
Shows for each user:
- Total activities completed
- Accuracy percentage (color-coded: green >70%, yellow >50%, red <50%)
- Average time per activity
- Average difficulty rating
- Last activity timestamp

### 5. 🤖 ML Model Logs Table
Recent ML predictions showing:
- Timestamp
- User ID
- Recommended topic (reading/math)
- Predicted difficulty (easy/medium/hard)
- Modality (text/audio/visual)
- User's average accuracy at prediction time

### 6. 💬 NLP Analysis Logs Table
Recent sentiment analyses showing:
- Timestamp
- User ID
- Feedback text
- Sentiment score (-1.0 to +1.0)
- Confusion flag (whether student is confused)

---

## Access the Admin Panel

### 1. Navigate to Admin
```
http://localhost:5173/admin
```

Or click "Admin" in the navigation bar (🛡️ Shield icon)

### 2. User Filtering
Use the dropdown at the top right to filter data by user:
- "All Users" - Shows aggregated data
- Select specific user - Shows data for that user only

### 3. Refresh Data
Click the "Refresh" button to reload all analytics

---

## API Endpoints

The admin panel uses these backend endpoints:

### Get ML Logs
```bash
# All users
curl http://127.0.0.1:8030/api/admin/ml-logs

# Specific user
curl http://127.0.0.1:8030/api/admin/ml-logs?userId=user@example.com

# Limit results
curl http://127.0.0.1:8030/api/admin/ml-logs?limit=100
```

### Get NLP Logs
```bash
curl http://127.0.0.1:8030/api/admin/nlp-logs?userId=user@example.com
```

### Get Accuracy Trends
```bash
# Last 7 days
curl http://127.0.0.1:8030/api/admin/accuracy-trends

# Last 30 days
curl http://127.0.0.1:8030/api/admin/accuracy-trends?days=30

# For specific user
curl http://127.0.0.1:8030/api/admin/accuracy-trends?userId=user@example.com&days=14
```

### Get User Statistics
```bash
curl http://127.0.0.1:8030/api/admin/user-stats
```

### Get Model Performance
```bash
curl http://127.0.0.1:8030/api/admin/model-performance
```

### Get Recent Activity
```bash
curl http://127.0.0.1:8030/api/admin/recent-activity?limit=50
```

---

## Interpreting the Data

### Accuracy Trends
- **Upward trend**: Students are improving ✅
- **Downward trend**: Content may be too difficult ⚠️
- **Flat line**: Consistent performance (stable difficulty)

### Confusion Rate
- **<10%**: Students understand the content well ✅
- **10-30%**: Some confusion, monitor closely ⚠️
- **>30%**: High confusion, consider simplifying content 🚨

### User Accuracy (Color Coding)
- **Green (≥70%)**: Excellent performance ✅
- **Yellow (50-69%)**: Average performance ⚠️
- **Red (<50%)**: Struggling, needs support 🚨

### Sentiment Scores
- **> 0.3**: Positive sentiment (happy, engaged) 😊
- **-0.3 to 0.3**: Neutral sentiment 😐
- **< -0.3**: Negative sentiment (confused, frustrated) + confusion flag 😟

---

## Use Cases

### 1. Monitor Model Performance
- Check if ML models are making accurate predictions
- Verify NLP is detecting confusion correctly
- Track overall system accuracy

### 2. Identify Struggling Students
- Filter by user to see individual performance
- Look for low accuracy or high confusion rates
- Provide targeted support

### 3. Track Improvement Over Time
- Use accuracy trends to see progress
- Compare week-over-week performance
- Validate intervention effectiveness

### 4. Analyze Model Behavior
- See what difficulty levels are recommended
- Check if models adapt to user performance
- Verify topic and modality recommendations

### 5. Quality Assurance
- Ensure models are running correctly
- Verify logs are being stored
- Check for anomalies or errors

---

## Troubleshooting

### No Data Showing
- Ensure backend is running: `curl http://127.0.0.1:8030/api/admin/model-performance`
- Check MongoDB is running: `mongosh`
- Verify users have completed activities

### Empty Accuracy Trends
- Need at least 1 day of data
- Check date range (default 7 days)
- Verify interactions are being logged in MongoDB

### ML/NLP Logs Empty
- ML logs: Need users to request activities
- NLP logs: Need users to submit feedback text
- Check `ml_predictions` and `nlp_analyses` collections in MongoDB

### Charts Not Rendering
- Check browser console for errors (F12)
- Verify recharts is installed: `npm list recharts`
- Refresh the page

---

## Development

### Backend Admin Routes
Located in: `backend/app/routes/admin.py`

### Frontend Admin Page
Located in: `Frontend/src/pages/Admin.tsx`

### Admin API Client
Located in: `Frontend/src/lib/admin-api.ts`

---

## MongoDB Collections Used

The admin panel reads from these collections:
- `interactions`: User activity submissions
- `ml_predictions`: ML model recommendations
- `nlp_analyses`: NLP sentiment analyses
- `users`: User accounts

---

## Example Queries

### Check Total ML Predictions
```bash
mongosh neuro_learn --eval "db.ml_predictions.count()"
```

### View Recent ML Predictions
```bash
mongosh neuro_learn --eval "db.ml_predictions.find().sort({timestamp: -1}).limit(5).pretty()"
```

### Check Confusion Rate
```bash
mongosh neuro_learn --eval "
  var total = db.interactions.count();
  var confused = db.interactions.count({confusionFlag: true});
  print('Confusion Rate: ' + (confused/total*100).toFixed(2) + '%');
"
```

### Get User Performance
```bash
mongosh neuro_learn --eval "
  db.interactions.aggregate([
    {\$group: {
      _id: '\$userId',
      total: {\$sum: 1},
      correct: {\$sum: {\$cond: [{\$eq: ['\$isCorrect', true]}, 1, 0]}}
    }},
    {\$project: {
      userId: '\$_id',
      total: 1,
      correct: 1,
      accuracy: {\$multiply: [{\$divide: ['\$correct', '\$total']}, 100]}
    }}
  ]).pretty()
"
```

---

## Next Steps

1. ✅ Access admin panel at `/admin`
2. ✅ Explore different visualizations
3. ✅ Filter by user to see individual performance
4. ✅ Monitor model accuracy and trends
5. ✅ Use insights to improve the learning system

The admin panel provides real-time insights into your ML/NLP models! 🚀

