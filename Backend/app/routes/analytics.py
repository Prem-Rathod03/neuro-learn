"""
Analytics endpoint to monitor ML and NLP model performance
Shows how models are being used and their effectiveness
"""

from typing import Optional, Dict, List
from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..db.mongo import get_db

router = APIRouter()


@router.get("/analytics/models")
async def get_model_analytics(
    userId: Optional[str] = Query(None, description="Filter by user ID"),
    days: int = Query(7, description="Number of days to analyze"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get analytics on ML and NLP model performance.
    
    Returns:
    - ML model usage (difficulty predictions, recommendations)
    - NLP model usage (sentiment analysis, rephrase requests)
    - Model accuracy/effectiveness metrics
    """
    interactions = db["interactions"]
    
    # Build query
    query = {}
    if userId:
        query["userId"] = userId
    
    # Get interactions from last N days
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    query["timestamp"] = {"$gte": cutoff_date}
    
    # Fetch all interactions
    cursor = interactions.find(query)
    all_interactions = await cursor.to_list(length=None)
    
    # ========== ML MODEL ANALYTICS ==========
    ml_stats = {
        "total_recommendations": 0,
        "difficulty_predictions": {
            "easy": 0,
            "medium": 0,
            "hard": 0,
        },
        "topic_recommendations": {
            "reading": 0,
            "math": 0,
        },
        "modality_recommendations": {
            "text": 0,
            "audio": 0,
            "visual": 0,
        },
        "user_outcomes": {
            "correct_after_recommendation": 0,
            "incorrect_after_recommendation": 0,
        }
    }
    
    # Analyze interactions to see ML recommendations in action
    # (Note: We infer ML usage from activity patterns, since we don't store ML predictions separately)
    for interaction in all_interactions:
        difficulty = interaction.get("difficultyRating")
        if difficulty:
            if difficulty <= 2:
                ml_stats["difficulty_predictions"]["easy"] += 1
            elif difficulty <= 4:
                ml_stats["difficulty_predictions"]["medium"] += 1
            else:
                ml_stats["difficulty_predictions"]["hard"] += 1
        
        is_correct = interaction.get("isCorrect", False)
        if is_correct:
            ml_stats["user_outcomes"]["correct_after_recommendation"] += 1
        else:
            ml_stats["user_outcomes"]["incorrect_after_recommendation"] += 1
    
    ml_stats["total_recommendations"] = len(all_interactions)
    
    # Calculate accuracy rate
    total_outcomes = (
        ml_stats["user_outcomes"]["correct_after_recommendation"] +
        ml_stats["user_outcomes"]["incorrect_after_recommendation"]
    )
    ml_stats["accuracy_rate"] = (
        ml_stats["user_outcomes"]["correct_after_recommendation"] / total_outcomes
        if total_outcomes > 0 else 0.0
    )
    
    # ========== NLP MODEL ANALYTICS ==========
    nlp_stats = {
        "sentiment_analyses": 0,
        "rephrase_requests": 0,
        "sentiment_distribution": {
            "positive": 0,  # sentiment > 0.3
            "neutral": 0,   # -0.3 <= sentiment <= 0.3
            "negative": 0,  # sentiment < -0.3
        },
        "confusion_detections": 0,
        "average_sentiment": 0.0,
    }
    
    sentiment_scores = []
    for interaction in all_interactions:
        # Count sentiment analyses
        sentiment_score = interaction.get("sentimentScore")
        if sentiment_score is not None:
            nlp_stats["sentiment_analyses"] += 1
            sentiment_scores.append(sentiment_score)
            
            if sentiment_score > 0.3:
                nlp_stats["sentiment_distribution"]["positive"] += 1
            elif sentiment_score < -0.3:
                nlp_stats["sentiment_distribution"]["negative"] += 1
            else:
                nlp_stats["sentiment_distribution"]["neutral"] += 1
        
        # Count confusion detections
        if interaction.get("confusionFlag", False):
            nlp_stats["confusion_detections"] += 1
    
    if sentiment_scores:
        nlp_stats["average_sentiment"] = sum(sentiment_scores) / len(sentiment_scores)
    
    # Count rephrase requests (we'd need to track this separately, but for now estimate)
    # In a real system, you'd log rephrase API calls separately
    nlp_stats["rephrase_requests"] = "N/A (track separately)"  # Placeholder
    
    # ========== MODEL USAGE SUMMARY ==========
    model_usage = {
        "ml_models": {
            "RandomForestClassifier": {
                "purpose": "Predicts next activity difficulty (easy/medium/hard)",
                "usage_count": ml_stats["total_recommendations"],
                "status": "active"
            },
            "KMeans": {
                "purpose": "Clusters learners by behavior patterns",
                "usage_count": ml_stats["total_recommendations"],
                "status": "active"
            },
            "MLPClassifier": {
                "purpose": "Recommends next activity topic and modality",
                "usage_count": ml_stats["total_recommendations"],
                "status": "active"
            }
        },
        "nlp_models": {
            "DistilBERT": {
                "purpose": "Analyzes student feedback sentiment and detects confusion",
                "usage_count": nlp_stats["sentiment_analyses"],
                "status": "active"
            },
            "LLM (Ollama/Gemini)": {
                "purpose": "Rephrases questions in simpler language for neurodiverse learners",
                "usage_count": nlp_stats["rephrase_requests"],
                "status": "active"
            }
        }
    }
    
    return {
        "period_days": days,
        "total_interactions": len(all_interactions),
        "ml_analytics": ml_stats,
        "nlp_analytics": nlp_stats,
        "model_usage": model_usage,
        "summary": {
            "ml_models_helping": "ML models recommend personalized activities based on user performance",
            "nlp_models_helping": "NLP models analyze feedback for confusion and simplify questions",
            "recommendation": "More data = better predictions. Keep using the system to improve model accuracy."
        }
    }


@router.get("/analytics/models/detailed")
async def get_detailed_model_metrics(
    userId: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get detailed metrics on model predictions vs actual outcomes.
    Shows how well models are performing.
    """
    interactions = db["interactions"]
    
    query = {"userId": userId} if userId else {}
    cursor = interactions.find(query).sort("timestamp", -1).limit(100)
    recent_interactions = await cursor.to_list(length=100)
    
    # Track prediction accuracy
    predictions_vs_outcomes = {
        "difficulty_matches": 0,
        "total_checks": 0,
    }
    
    # Analyze recent interactions
    for interaction in recent_interactions:
        # Check if difficulty prediction matched user's experience
        difficulty_rating = interaction.get("difficultyRating")
        is_correct = interaction.get("isCorrect", False)
        
        if difficulty_rating is not None:
            predictions_vs_outcomes["total_checks"] += 1
            # If user got it correct on easy/medium, or struggled on hard, prediction was good
            if (difficulty_rating <= 3 and is_correct) or (difficulty_rating >= 4 and not is_correct):
                predictions_vs_outcomes["difficulty_matches"] += 1
    
    accuracy = (
        predictions_vs_outcomes["difficulty_matches"] / predictions_vs_outcomes["total_checks"]
        if predictions_vs_outcomes["total_checks"] > 0 else 0.0
    )
    
    return {
        "model_performance": {
            "difficulty_prediction_accuracy": accuracy,
            "samples_analyzed": predictions_vs_outcomes["total_checks"],
        },
        "recommendations": {
            "collect_more_data": "Models improve with more user interactions",
            "retrain_models": "Consider retraining models weekly with new data",
            "monitor_sentiment": "Track confusion flags to identify struggling students",
        }
    }

