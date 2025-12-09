from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from ..db.mongo import get_db
from ..services import ml_engine, nlp_engine, feature_builder
from ..services.model_logger import log_ml_prediction, log_nlp_analysis

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
  # Add lessonId to payload for better tracking
  lessonId: Optional[str] = None
  # Well-Being Layer: Support mode tracking
  supportMode: Optional[str] = None  # "ADHD_BREAK", "DYSLEXIA_SUPPORT", "ASD_CALM"
  breakTriggered: Optional[bool] = None
  breakReason: Optional[str] = None
  consecutiveWrong: Optional[int] = None
  wrongInLast5: Optional[int] = None


@router.get("/next")
async def get_next_activity(
    userId: Optional[str] = None,
    moduleId: Optional[str] = None,  # Filter by module: M1, M2, or M3 (or module-1, module-2, module-3)
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get next activity using ML recommendation.
    Returns ActivityItem following the new schema, or legacy format as fallback.
    
    Args:
        userId: Optional user ID for personalization
        moduleId: Optional module filter (M1, M2, M3). If provided, returns activities only from that module.
    """
    interactions_col = db["interactions"]

    # 1) Get last N interactions for this user (or all if no user)
    query = {"userId": userId} if userId else {}
    logs = await interactions_col.find(query).sort("timestamp", -1).to_list(50)

    # 2) Build feature vector from logs
    features = feature_builder.build_features(logs)

    # 3) Ask ML engine what to do next
    reco = ml_engine.recommend_next(features)  # uses RandomForest/MLP later
    
    # Log ML prediction for performance tracking
    await log_ml_prediction(
        db,
        userId,
        features,
        {"topic": reco.topic, "difficulty": reco.difficulty, "modality": reco.modality}
    )

    # 4) Try to use new ActivityItem schema if available
    if USE_NEW_SCHEMA:
        try:
            from ..data.activity_items import (
                get_activities_by_module,
                get_next_activity_in_sequence,
                get_activities_by_lesson
            )
            
            # Normalize moduleId: convert "module-1" to "M1", "module-2" to "M2", etc.
            target_module = None
            if moduleId:
                if moduleId.startswith("module-"):
                    # Convert "module-1" -> "M1"
                    module_num = moduleId.replace("module-", "")
                    target_module = f"M{module_num}"
                elif moduleId.startswith("M"):
                    # Already in correct format
                    target_module = moduleId
                else:
                    # Try to extract number and convert
                    try:
                        num = int(moduleId.replace("M", "").replace("module-", ""))
                        target_module = f"M{num}"
                    except ValueError:
                        target_module = "M1"  # Default fallback
            
            if not target_module:
                # Map ML topic to module
                # M1 = Understanding Instructions (reading/language)
                # M2 = Basic Numbers & Logic (math)
                # M3 = Focus & Routine Skills (executive function)
                topic_to_module = {
                    "reading": "M1",
                    "math": "M2",
                }
                target_module = topic_to_module.get(reco.topic, "M1")  # Default to M1
            
            # Get last completed activity for this user to determine next in sequence
            last_activity_id = None
            last_lesson_id = None
            if logs:
                # Find last activity with moduleId matching target module
                for log in logs:
                    if "activityId" in log:
                        activity_id = log.get("activityId", "")
                        if activity_id.startswith("M"):
                            # Extract module from activityId like "M1_L1_Q1"
                            last_module = activity_id.split("_")[0]  # "M1"
                            if last_module == target_module:
                                last_activity_id = activity_id
                                # Also extract lessonId for fallback
                                last_lesson = log.get("lessonId")
                                if not last_lesson and "_" in activity_id:
                                    # Extract from "M1_L1_Q1" -> "1.1"
                                    parts = activity_id.split("_")
                                    if len(parts) >= 2:
                                        lesson_num = parts[1].replace("L", "")
                                        module_num = target_module.replace("M", "")
                                        last_lesson = f"{module_num}.{lesson_num}"
                                if last_lesson:
                                    last_lesson_id = last_lesson
                                break
            
            # Get next activity in sequence for the target module
            # Pass both activity_id and lesson_id for better tracking
            chosen = get_next_activity_in_sequence(
                target_module,
                last_activity_id=last_activity_id,
                last_lesson_id=last_lesson_id
            )
            
            # If no sequence-based activity found, fall back to difficulty/type matching
            if chosen is None:
                activity_type_map = {
                    ("reading", "text"): "image_to_word",
                    ("reading", "audio"): "one_step_instruction",
                    ("math", "text"): "counting",
                    ("math", "visual"): "visual_addition",
                }
                
                activity_type = activity_type_map.get((reco.topic, reco.modality), "image_to_word")
                
                # Filter by module first, then by type and difficulty
                module_activities = get_activities_by_module(target_module)
                for activity in module_activities:
                    if (
                        activity.type == activity_type
                        and activity.difficulty == reco.difficulty
                    ):
                        chosen = activity
                        break
                
                # Final fallback: first activity in module
                if chosen is None and module_activities:
                    chosen = module_activities[0]

            # Convert Pydantic model to dict for JSON response
            if chosen:
                return chosen.dict() if hasattr(chosen, 'dict') else chosen.model_dump()
        except Exception as e:
            print(f"Error using new schema, falling back to legacy: {e}")
            import traceback
            traceback.print_exc()
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
    # Use model_dump() for Pydantic v2, fallback to dict() for v1
    doc = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
    doc["timestamp"] = datetime.utcnow()

    # 🔹 Run pretrained NLP (or simple version) on feedback text
    if payload.feedbackText:
        sentiment_score, confusion_flag = nlp_engine.analyze_feedback(
            payload.feedbackText
        )
        doc["sentimentScore"] = sentiment_score
        doc["confusionFlag"] = confusion_flag
        
        # Log NLP analysis for performance tracking
        await log_nlp_analysis(
            db,
            payload.userId,
            payload.feedbackText,
            sentiment_score,
            confusion_flag
        )

    await interactions.insert_one(doc)

    return {"success": True}

