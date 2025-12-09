"""
Seed script to add dummy users with realistic data
Generates ML predictions, NLP analyses, and user interactions
"""

import asyncio
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "neuro_learn")

# Dummy users with realistic names and diverse neuro flags
DUMMY_USERS = [
    {
        "name": "Emma Johnson",
        "email": "emma.johnson@example.com",
        "neuroFlags": ["Dyslexia"],
        "age": 8,
        "performance_profile": "high"  # High accuracy, fast
    },
    {
        "name": "Liam Chen",
        "email": "liam.chen@example.com",
        "neuroFlags": ["ADHD"],
        "age": 9,
        "performance_profile": "variable"  # Variable accuracy, medium speed
    },
    {
        "name": "Sophia Martinez",
        "email": "sophia.martinez@example.com",
        "neuroFlags": ["ASD"],
        "age": 10,
        "performance_profile": "steady"  # Consistent accuracy, slow and careful
    },
    {
        "name": "Noah Williams",
        "email": "noah.williams@example.com",
        "neuroFlags": ["ADHD", "Dyslexia"],
        "age": 8,
        "performance_profile": "struggling"  # Lower accuracy, needs support
    },
    {
        "name": "Olivia Brown",
        "email": "olivia.brown@example.com",
        "neuroFlags": ["Dyslexia"],
        "age": 11,
        "performance_profile": "improving"  # Accuracy improving over time
    },
    {
        "name": "Ethan Davis",
        "email": "ethan.davis@example.com",
        "neuroFlags": ["ASD", "ADHD"],
        "age": 9,
        "performance_profile": "high"  # High accuracy with structure
    },
    {
        "name": "Ava Rodriguez",
        "email": "ava.rodriguez@example.com",
        "neuroFlags": ["Dyslexia"],
        "age": 7,
        "performance_profile": "variable"  # Still learning, variable performance
    },
    {
        "name": "Mason Taylor",
        "email": "mason.taylor@example.com",
        "neuroFlags": ["ADHD"],
        "age": 10,
        "performance_profile": "steady"  # Good focus with right support
    }
]

# Sample feedback texts for NLP analysis
POSITIVE_FEEDBACK = [
    "This was fun and easy!",
    "I liked this activity",
    "This is great, I understand it",
    "Easy and enjoyable",
    "I'm getting better at this",
]

NEUTRAL_FEEDBACK = [
    "It was okay",
    "Not too hard, not too easy",
    "I can do this",
    "It's fine",
]

NEGATIVE_FEEDBACK = [
    "This is too confusing",
    "I don't understand this",
    "Too difficult for me",
    "This is hard and frustrating",
    "I'm confused and need help",
]

# Activity types
ACTIVITIES = [
    {"id": "M1_L1_Q1", "moduleId": "M1", "lessonId": "1.1", "difficulty": "easy"},
    {"id": "M1_L1_Q2", "moduleId": "M1", "lessonId": "1.1", "difficulty": "easy"},
    {"id": "M1_L2_Q1", "moduleId": "M1", "lessonId": "1.2", "difficulty": "medium"},
    {"id": "M1_L3_Q1", "moduleId": "M1", "lessonId": "1.3", "difficulty": "hard"},
    {"id": "M2_L1_Q1", "moduleId": "M2", "lessonId": "2.1", "difficulty": "easy"},
    {"id": "M2_L2_Q1", "moduleId": "M2", "lessonId": "2.2", "difficulty": "medium"},
    {"id": "M3_L1_Q1", "moduleId": "M3", "lessonId": "3.1", "difficulty": "easy"},
    {"id": "M3_L2_Q1", "moduleId": "M3", "lessonId": "3.2", "difficulty": "medium"},
]


def get_performance_params(profile: str, day_offset: int):
    """Get performance parameters based on user profile and day"""
    
    # Base parameters by profile
    profiles = {
        "high": {"accuracy": 0.85, "time_mult": 0.8, "difficulty_pref": 1.2},
        "steady": {"accuracy": 0.75, "time_mult": 1.2, "difficulty_pref": 1.0},
        "variable": {"accuracy": 0.65, "time_mult": 1.0, "difficulty_pref": 0.9},
        "struggling": {"accuracy": 0.45, "time_mult": 1.5, "difficulty_pref": 0.7},
        "improving": {"accuracy": 0.50 + (day_offset * 0.05), "time_mult": 1.3 - (day_offset * 0.05), "difficulty_pref": 0.8 + (day_offset * 0.05)},
    }
    
    params = profiles.get(profile, profiles["steady"])
    
    # Add some randomness
    params["accuracy"] = max(0.1, min(1.0, params["accuracy"] + random.uniform(-0.1, 0.1)))
    params["time_mult"] = max(0.5, params["time_mult"] + random.uniform(-0.2, 0.2))
    
    return params


async def seed_dummy_data():
    """Seed the database with dummy users and interactions"""
    
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB]
    
    print("🌱 Seeding dummy data...")
    print(f"📊 Creating {len(DUMMY_USERS)} dummy users\n")
    
    # Collections
    users_col = db["users"]
    interactions_col = db["interactions"]
    ml_predictions_col = db["ml_predictions"]
    nlp_analyses_col = db["nlp_analyses"]
    
    # Clear existing dummy data (optional - comment out to keep existing data)
    print("🧹 Clearing existing dummy data...")
    for user in DUMMY_USERS:
        await users_col.delete_one({"email": user["email"]})
        await interactions_col.delete_many({"userId": user["email"]})
        await ml_predictions_col.delete_many({"userId": user["email"]})
        await nlp_analyses_col.delete_many({"userId": user["email"]})
    
    # Create users and generate data
    total_interactions = 0
    total_ml_predictions = 0
    total_nlp_analyses = 0
    
    for user in DUMMY_USERS:
        print(f"👤 Creating user: {user['name']} ({', '.join(user['neuroFlags'])})")
        
        # Insert user
        user_doc = {
            "name": user["name"],
            "email": user["email"],
            "password": "$2b$12$dummyhashforseeding",  # Dummy hash
            "neuroFlags": user["neuroFlags"],
            "age": user["age"],
        }
        await users_col.insert_one(user_doc)
        
        # Generate interactions over the past 7 days
        num_activities = random.randint(15, 25)
        
        for i in range(num_activities):
            # Spread activities over past 7 days
            days_ago = random.randint(0, 6)
            timestamp = datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(0, 23))
            
            # Get performance parameters
            params = get_performance_params(user["performance_profile"], 6 - days_ago)
            
            # Select activity
            activity = random.choice(ACTIVITIES)
            
            # Determine if answer is correct
            is_correct = random.random() < params["accuracy"]
            
            # Generate interaction data
            interaction = {
                "userId": user["email"],
                "activityId": activity["id"],
                "moduleId": activity["moduleId"],
                "lessonId": activity["lessonId"],
                "answer": "selected_answer",
                "isCorrect": is_correct,
                "timeTaken": random.uniform(5, 30) * params["time_mult"],
                "difficultyRating": random.randint(1, 5),
                "focusRating": random.randint(2, 5),
                "timestamp": timestamp,
            }
            
            # Add feedback text for some interactions (for NLP)
            if random.random() < 0.4:  # 40% of interactions have feedback
                if is_correct and random.random() < 0.7:
                    feedback = random.choice(POSITIVE_FEEDBACK)
                    sentiment = random.uniform(0.4, 0.9)
                    confused = False
                elif not is_correct:
                    feedback = random.choice(NEGATIVE_FEEDBACK)
                    sentiment = random.uniform(-0.8, -0.3)
                    confused = True
                else:
                    feedback = random.choice(NEUTRAL_FEEDBACK)
                    sentiment = random.uniform(-0.2, 0.2)
                    confused = False
                
                interaction["feedbackText"] = feedback
                interaction["sentimentScore"] = sentiment
                interaction["confusionFlag"] = confused
                
                # Create NLP analysis log
                nlp_log = {
                    "userId": user["email"],
                    "timestamp": timestamp,
                    "text": feedback,
                    "sentiment_score": sentiment,
                    "confusion_flag": confused,
                }
                await nlp_analyses_col.insert_one(nlp_log)
                total_nlp_analyses += 1
            
            await interactions_col.insert_one(interaction)
            total_interactions += 1
            
            # Generate ML prediction for this activity request
            ml_prediction = {
                "userId": user["email"],
                "timestamp": timestamp - timedelta(seconds=random.randint(1, 5)),
                "features": {
                    "avg_accuracy": params["accuracy"],
                    "avg_time": 15.0 * params["time_mult"],
                    "avg_difficulty_rating": random.randint(2, 4),
                    "avg_focus_rating": random.randint(2, 4),
                    "avg_attention_score": random.uniform(0.6, 0.9),
                    "avg_sentiment": random.uniform(-0.2, 0.5),
                    "confusion_rate": 1.0 - params["accuracy"],
                },
                "prediction": {
                    "topic": random.choice(["reading", "math"]),
                    "difficulty": activity["difficulty"],
                    "modality": random.choice(["text", "audio", "visual"]),
                }
            }
            await ml_predictions_col.insert_one(ml_prediction)
            total_ml_predictions += 1
        
        print(f"   ✓ Generated {num_activities} activities\n")
    
    print("=" * 60)
    print("✅ Seeding complete!")
    print(f"📊 Summary:")
    print(f"   - Users created: {len(DUMMY_USERS)}")
    print(f"   - Interactions: {total_interactions}")
    print(f"   - ML predictions: {total_ml_predictions}")
    print(f"   - NLP analyses: {total_nlp_analyses}")
    print("=" * 60)
    print("\n🎯 You can now:")
    print("   1. View admin panel: http://localhost:5173/admin")
    print("   2. Check MongoDB: mongosh neuro_learn")
    print("   3. Test analytics: curl http://127.0.0.1:8030/api/analytics/models")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_dummy_data())

