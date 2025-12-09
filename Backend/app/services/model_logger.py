"""
Service to log ML and NLP model predictions for performance tracking
"""

from typing import Dict, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase


async def log_ml_prediction(
    db: AsyncIOMotorDatabase,
    userId: Optional[str],
    features: Dict,
    prediction: Dict,  # {topic, difficulty, modality}
    actual_outcome: Optional[Dict] = None,  # {isCorrect, timeTaken, etc.}
):
    """
    Log ML model prediction for later performance analysis.
    """
    predictions_col = db["ml_predictions"]
    
    doc = {
        "userId": userId,
        "timestamp": datetime.utcnow(),
        "features": features,
        "prediction": prediction,
        "actual_outcome": actual_outcome,
    }
    
    await predictions_col.insert_one(doc)


async def log_nlp_analysis(
    db: AsyncIOMotorDatabase,
    userId: Optional[str],
    text: str,
    sentiment_score: float,
    confusion_flag: bool,
):
    """
    Log NLP sentiment analysis for tracking.
    """
    nlp_logs_col = db["nlp_analyses"]
    
    doc = {
        "userId": userId,
        "timestamp": datetime.utcnow(),
        "text": text,
        "sentiment_score": sentiment_score,
        "confusion_flag": confusion_flag,
    }
    
    await nlp_logs_col.insert_one(doc)


async def log_rephrase_request(
    db: AsyncIOMotorDatabase,
    userId: Optional[str],
    original_question: str,
    simplified_question: str,
    neurotype: Optional[str],
):
    """
    Log rephrase requests to track LLM usage.
    """
    rephrase_logs_col = db["rephrase_requests"]
    
    doc = {
        "userId": userId,
        "timestamp": datetime.utcnow(),
        "original_question": original_question,
        "simplified_question": simplified_question,
        "neurotype": neurotype,
        "was_simplified": original_question != simplified_question,
    }
    
    await rephrase_logs_col.insert_one(doc)

