# Seed Dummy Data Script

## What It Does

The `seed_dummy_data.py` script creates realistic dummy users with varied neurodiversity profiles and generates ML/NLP training data.

## Dummy Users Created

| Name | Email | Neuro Flags | Age | Performance Profile |
|------|-------|-------------|-----|---------------------|
| Emma Johnson | emma.johnson@example.com | Dyslexia | 8 | High performer (85% accuracy) |
| Liam Chen | liam.chen@example.com | ADHD | 9 | Variable performance (65% accuracy) |
| Sophia Martinez | sophia.martinez@example.com | ASD | 10 | Steady performer (75% accuracy) |
| Noah Williams | noah.williams@example.com | ADHD, Dyslexia | 8 | Struggling (45% accuracy) |
| Olivia Brown | olivia.brown@example.com | Dyslexia | 11 | Improving over time |
| Ethan Davis | ethan.davis@example.com | ASD, ADHD | 9 | High performer with structure |
| Ava Rodriguez | ava.rodriguez@example.com | Dyslexia | 7 | Variable, still learning |
| Mason Taylor | mason.taylor@example.com | ADHD | 10 | Steady with right support |

## Data Generated

For each user (over 7 days):
- **15-25 activities** completed
- **ML predictions** for each activity request
- **NLP sentiment analyses** for ~40% of activities (when feedback provided)
- Varied performance based on profile
- Realistic timestamps spread over past week

### Total Data Created:
- ✅ 8 users
- ✅ 175 interactions
- ✅ 175 ML predictions
- ✅ 73 NLP analyses

## How to Run

```bash
cd backend
python3 seed_dummy_data.py
```

## What Gets Created

### 1. Users (`users` collection)
- Real names
- Valid email addresses
- Diverse neuroFlags (Dyslexia, ADHD, ASD, combinations)
- Ages 7-11

### 2. Interactions (`interactions` collection)
- Activity completions
- Correct/incorrect answers based on user profile
- Time taken (varied by performance level)
- Difficulty and focus ratings
- Feedback text (40% of activities)
- Sentiment scores and confusion flags

### 3. ML Predictions (`ml_predictions` collection)
- User features (accuracy, time, focus, attention)
- Predicted topic (reading/math)
- Predicted difficulty (easy/medium/hard)
- Predicted modality (text/audio/visual)

### 4. NLP Analyses (`nlp_analyses` collection)
- User feedback texts
- Sentiment scores (-1.0 to +1.0)
- Confusion flags

## Performance Profiles

### High Performer (Emma, Ethan)
- 85% accuracy
- Fast completion times
- Positive feedback
- Low confusion rate

### Steady (Sophia, Mason)
- 75% accuracy
- Consistent performance
- Neutral to positive feedback
- Moderate completion times

### Variable (Liam, Ava)
- 65% accuracy
- Inconsistent performance
- Mixed feedback
- Variable completion times

### Struggling (Noah)
- 45% accuracy
- Slower completion times
- Often confused
- Negative feedback

### Improving (Olivia)
- Starts at 50%, improves to 80%
- Gets faster over time
- Feedback becomes more positive

## Verify the Data

### Check MongoDB
```bash
mongosh neuro_learn

# Count users
db.users.count()  # Should be 8 (or more if you had existing users)

# View users
db.users.find({}, {name: 1, email: 1, neuroFlags: 1}).pretty()

# Count interactions
db.interactions.count()  # Should show 175+ interactions

# Count ML predictions
db.ml_predictions.count()  # Should show 175+ predictions

# Count NLP analyses
db.nlp_analyses.count()  # Should show 73+ analyses
```

### Check Admin Panel
1. Go to: `http://localhost:5173/admin`
2. You should see:
   - 8 users in the user stats table
   - 175+ total interactions
   - 175+ ML predictions
   - 73+ NLP analyses
   - Accuracy trends chart populated
   - User filtering dropdown with all 8 users

### Check API
```bash
# User stats
curl http://127.0.0.1:8030/api/admin/user-stats | python3 -m json.tool

# Model performance
curl http://127.0.0.1:8030/api/admin/model-performance | python3 -m json.tool

# Accuracy trends
curl http://127.0.0.1:8030/api/admin/accuracy-trends | python3 -m json.tool
```

## Re-running the Script

The script **clears existing dummy data** before creating new data to avoid duplicates.

It only removes users with emails matching the dummy user list, so your real users are safe.

To keep accumulating data instead of replacing:
1. Comment out lines 121-125 in `seed_dummy_data.py`
2. Change the email addresses to avoid duplicates

## Use Cases

1. **Test Admin Panel** - Visualize ML/NLP performance
2. **Train Models** - More data improves ML accuracy
3. **Demo System** - Show realistic user interactions
4. **Development** - Test features with diverse users
5. **Analytics** - Validate charts and statistics

## Feedback Examples

The script uses realistic feedback based on performance:

**Positive** (correct answers):
- "This was fun and easy!"
- "I liked this activity"
- "I'm getting better at this"

**Neutral**:
- "It was okay"
- "Not too hard, not too easy"

**Negative** (incorrect answers):
- "This is too confusing"
- "I don't understand this"
- "Too difficult for me"

## Next Steps

1. ✅ View admin panel to see all the data
2. ✅ Filter by user to see individual performance
3. ✅ Check accuracy trends chart
4. ✅ Review ML and NLP logs
5. ✅ Use this data to test and improve your models

The dummy data provides a solid foundation for testing and development! 🚀

