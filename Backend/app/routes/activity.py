from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from ..db.mongo import get_db
from ..services import ml_engine, nlp_engine, feature_builder

# Try to import new ActivityItem models, fallback to old format if not available
try:
    from ..models.activity import ActivityItem
    from ..data.activity_items import EXAMPLE_ACTIVITIES
    USE_NEW_SCHEMA = True
except ImportError:
    USE_NEW_SCHEMA = False
    print("Warning: New activity schema not available, using legacy format")

router = APIRouter()

# Simple mock question bank; swap with ML-powered selection later.
QUESTIONS = [
  {
    "id": "q1",
    "topic": "reading",
    "difficulty": "easy",
    "modality": "text",
    "question": "What is the main idea of the passage?",
    "options": ["It explains how plants grow", "It describes different animals", "It compares two cities", "It tells a story about friendship"],
  },
  {
    "id": "q2",
    "topic": "reading",
    "difficulty": "medium",
    "modality": "text",
    "question": "Which statement is supported by the passage?",
    "options": ["The author prefers summer", "Reading helps you learn", "Exercise is important", "Music makes you happy"],
  },
  {
    "id": "q3",
    "topic": "reading",
    "difficulty": "easy",
    "modality": "audio",
    "question": "Listen to the story. What happened first?",
    "options": ["The cat woke up", "The sun came out", "The bird sang", "The dog ran"],
  },
  {
    "id": "q4",
    "topic": "math",
    "difficulty": "easy",
    "modality": "text",
    "question": "How many apples are there if you have 3 apples and add 2 more?",
    "options": ["4 apples", "5 apples", "6 apples", "7 apples"],
  },
  {
    "id": "q5",
    "topic": "math",
    "difficulty": "medium",
    "modality": "text",
    "question": "If a box has 8 cookies and you eat 3, how many are left?",
    "options": ["4 cookies", "5 cookies", "6 cookies", "7 cookies"],
  },
  {
    "id": "q6",
    "topic": "math",
    "difficulty": "hard",
    "modality": "text",
    "question": "Sarah has 15 stickers. She gives away 6 stickers. Then she gets 4 more. How many stickers does she have now?",
    "options": ["11 stickers", "12 stickers", "13 stickers", "14 stickers"],
  },
  {
    "id": "q7",
    "topic": "reading",
    "difficulty": "hard",
    "modality": "text",
    "question": "Based on the passage, what can you infer about the character's feelings?",
    "options": ["The character was excited", "The character was worried", "The character was confused", "The character was happy"],
  },
  {
    "id": "q8",
    "topic": "math",
    "difficulty": "easy",
    "modality": "visual",
    "question": "Look at the picture. How many circles do you see?",
    "options": ["2 circles", "3 circles", "4 circles", "5 circles"],
  },
  {
    "id": "q9",
    "topic": "reading",
    "difficulty": "medium",
    "modality": "audio",
    "question": "After listening, what was the problem in the story?",
    "options": ["The door was locked", "The key was missing", "The window was broken", "The light was off"],
  },
  {
    "id": "q10",
    "topic": "math",
    "difficulty": "medium",
    "modality": "visual",
    "question": "Count the shapes. How many triangles are there?",
    "options": ["1 triangle", "2 triangles", "3 triangles", "4 triangles"],
  },
]


class SubmitRequest(BaseModel):
  activityId: str
  answer: str
  isCorrect: bool
  timeTaken: float
  difficultyRating: int
  focusRating: int
  feedbackText: Optional[str] = None
  userId: Optional[str] = None
  attentionScore: Optional[float] = None


@router.get("/next")
async def get_next_activity(
    userId: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get next activity using ML recommendation.
    Returns ActivityItem following the new schema, or legacy format as fallback.
    """
    interactions_col = db["interactions"]

    # 1) Get last N interactions for this user (or all if no user)
    query = {"userId": userId} if userId else {}
    logs = await interactions_col.find(query).sort("timestamp", -1).to_list(50)

    # 2) Build feature vector from logs
    features = feature_builder.build_features(logs)

    # 3) Ask ML engine what to do next
    reco = ml_engine.recommend_next(features)  # uses RandomForest/MLP later

    # 4) Try to use new ActivityItem schema if available
    if USE_NEW_SCHEMA:
        try:
            # Map old topic/modality to new activity types
            activity_type_map = {
                ("reading", "text"): "image_to_word",
                ("reading", "audio"): "one_step_instruction",
                ("math", "text"): "counting",
                ("math", "visual"): "visual_addition",
            }
            
            activity_type = activity_type_map.get((reco.topic, reco.modality), "image_to_word")
            
            # Find matching activity by type and difficulty
            chosen = None
            for activity in EXAMPLE_ACTIVITIES:
                if (
                    activity.type == activity_type
                    and activity.difficulty == reco.difficulty
                ):
                    chosen = activity
                    break

            # Fallback: use first activity or random from examples
            if chosen is None:
                count = await interactions_col.count_documents(query)
                idx = count % len(EXAMPLE_ACTIVITIES)
                chosen = EXAMPLE_ACTIVITIES[idx]

            # Convert Pydantic model to dict for JSON response
            return chosen.dict() if hasattr(chosen, 'dict') else chosen
        except Exception as e:
            print(f"Error using new schema, falling back to legacy: {e}")
            # Fall through to legacy format

    # Legacy format fallback
    chosen = None
    for q in QUESTIONS:
        if (
            q["topic"] == reco.topic
            and q["difficulty"] == reco.difficulty
            and q["modality"] == reco.modality
        ):
            chosen = q
            break

    # fallback if nothing matches exactly
    if chosen is None:
        count = await interactions_col.count_documents(query)
        idx = count % len(QUESTIONS)
        chosen = QUESTIONS[idx]

    return {
        "activityId": chosen["id"],
        "topic": chosen["topic"],
        "difficulty": chosen["difficulty"],
        "modality": chosen["modality"],
        "question": chosen["question"],
        "options": chosen["options"],
    }


@router.post("/submit")
async def submit_activity(
    payload: SubmitRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    interactions = db["interactions"]
    doc = payload.dict()
    doc["timestamp"] = datetime.utcnow()

    # 🔹 Run pretrained NLP (or simple version) on feedback text
    if payload.feedbackText:
        sentiment_score, confusion_flag = nlp_engine.analyze_feedback(
            payload.feedbackText
        )
        doc["sentimentScore"] = sentiment_score
        doc["confusionFlag"] = confusion_flag

    await interactions.insert_one(doc)

    return {"success": True}

