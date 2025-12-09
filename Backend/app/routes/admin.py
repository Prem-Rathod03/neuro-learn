"""
Admin analytics endpoint for monitoring ML/NLP model performance
Provides detailed logs, user-based analytics, and visualization data
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..db.mongo import get_db

router = APIRouter()


@router.get("/admin/ml-logs")
async def get_ml_logs(
    userId: Optional[str] = Query(None, description="Filter by user ID"),
    limit: int = Query(50, description="Number of logs to return"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get ML model prediction logs with user filtering.
    Returns detailed prediction data for monitoring.
    """
    predictions_col = db["ml_predictions"]
    
    query = {}
    if userId:
        query["userId"] = userId
    
    # Get predictions sorted by timestamp (newest first)
    cursor = predictions_col.find(query).sort("timestamp", -1).limit(limit)
    predictions = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for pred in predictions:
        pred["_id"] = str(pred["_id"])
        if "timestamp" in pred:
            pred["timestamp"] = pred["timestamp"].isoformat()
    
    return {
        "total": len(predictions),
        "logs": predictions
    }


@router.get("/admin/nlp-logs")
async def get_nlp_logs(
    userId: Optional[str] = Query(None, description="Filter by user ID"),
    limit: int = Query(50, description="Number of logs to return"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get NLP analysis logs with user filtering.
    Returns sentiment analysis and confusion detection data.
    """
    nlp_col = db["nlp_analyses"]
    
    query = {}
    if userId:
        query["userId"] = userId
    
    cursor = nlp_col.find(query).sort("timestamp", -1).limit(limit)
    analyses = await cursor.to_list(length=limit)
    
    for analysis in analyses:
        analysis["_id"] = str(analysis["_id"])
        if "timestamp" in analysis:
            analysis["timestamp"] = analysis["timestamp"].isoformat()
    
    return {
        "total": len(analyses),
        "logs": analyses
    }


@router.get("/admin/accuracy-trends")
async def get_accuracy_trends(
    userId: Optional[str] = Query(None, description="Filter by user ID"),
    days: int = Query(7, description="Number of days to analyze"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get accuracy trends over time for visualization.
    Returns daily accuracy rates.
    """
    interactions = db["interactions"]
    
    # Calculate start date
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = {"timestamp": {"$gte": start_date}}
    if userId:
        query["userId"] = userId
    
    # Aggregate by day
    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$timestamp"
                    }
                },
                "total": {"$sum": 1},
                "correct": {
                    "$sum": {
                        "$cond": [{"$eq": ["$isCorrect", True]}, 1, 0]
                    }
                }
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    result = await interactions.aggregate(pipeline).to_list(None)
    
    # Calculate accuracy for each day
    trends = []
    for day in result:
        accuracy = (day["correct"] / day["total"]) * 100 if day["total"] > 0 else 0
        trends.append({
            "date": day["_id"],
            "accuracy": round(accuracy, 2),
            "total": day["total"],
            "correct": day["correct"]
        })
    
    return {
        "period_days": days,
        "trends": trends
    }


@router.get("/admin/user-stats")
async def get_user_stats(
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get statistics for all users.
    Returns user-wise performance metrics.
    """
    interactions = db["interactions"]
    
    # Aggregate by user
    pipeline = [
        {
            "$group": {
                "_id": "$userId",
                "total_activities": {"$sum": 1},
                "correct_answers": {
                    "$sum": {
                        "$cond": [{"$eq": ["$isCorrect", True]}, 1, 0]
                    }
                },
                "avg_time": {"$avg": "$timeTaken"},
                "avg_difficulty": {"$avg": "$difficultyRating"},
                "avg_focus": {"$avg": "$focusRating"},
                "last_activity": {"$max": "$timestamp"}
            }
        },
        {"$sort": {"total_activities": -1}}
    ]
    
    result = await interactions.aggregate(pipeline).to_list(None)
    
    # Calculate accuracy and format
    users = []
    for user in result:
        accuracy = (user["correct_answers"] / user["total_activities"]) * 100 if user["total_activities"] > 0 else 0
        users.append({
            "userId": user["_id"] or "Anonymous",
            "totalActivities": user["total_activities"],
            "correctAnswers": user["correct_answers"],
            "accuracy": round(accuracy, 2),
            "avgTime": round(user.get("avg_time", 0), 2),
            "avgDifficulty": round(user.get("avg_difficulty", 0), 2),
            "avgFocus": round(user.get("avg_focus", 0), 2),
            "lastActivity": user["last_activity"].isoformat() if user.get("last_activity") else None
        })
    
    return {
        "total_users": len(users),
        "users": users
    }


@router.get("/admin/model-performance")
async def get_model_performance(
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get overall model performance metrics.
    Shows how well ML models are predicting.
    """
    predictions_col = db["ml_predictions"]
    interactions_col = db["interactions"]
    nlp_col = db["nlp_analyses"]
    
    # Count total predictions
    total_ml_predictions = await predictions_col.count_documents({})
    total_nlp_analyses = await nlp_col.count_documents({})
    total_interactions = await interactions_col.count_documents({})
    
    # Get difficulty distribution
    difficulty_pipeline = [
        {
            "$group": {
                "_id": "$difficultyRating",
                "count": {"$sum": 1}
            }
        }
    ]
    
    difficulty_dist = await interactions_col.aggregate(difficulty_pipeline).to_list(None)
    
    # Get confusion rate
    confused_count = await interactions_col.count_documents({"confusionFlag": True})
    confusion_rate = (confused_count / total_interactions * 100) if total_interactions > 0 else 0
    
    # Get overall accuracy
    correct_count = await interactions_col.count_documents({"isCorrect": True})
    overall_accuracy = (correct_count / total_interactions * 100) if total_interactions > 0 else 0
    
    return {
        "ml_predictions": total_ml_predictions,
        "nlp_analyses": total_nlp_analyses,
        "total_interactions": total_interactions,
        "overall_accuracy": round(overall_accuracy, 2),
        "confusion_rate": round(confusion_rate, 2),
        "difficulty_distribution": {
            str(item["_id"]): item["count"] for item in difficulty_dist if item["_id"] is not None
        }
    }


@router.get("/admin/recent-activity")
async def get_recent_activity(
    limit: int = Query(20, description="Number of recent activities"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get recent user activities for real-time monitoring.
    """
    interactions = db["interactions"]
    
    cursor = interactions.find({}).sort("timestamp", -1).limit(limit)
    activities = await cursor.to_list(length=limit)
    
    for activity in activities:
        activity["_id"] = str(activity["_id"])
        if "timestamp" in activity:
            activity["timestamp"] = activity["timestamp"].isoformat()
    
    return {
        "total": len(activities),
        "activities": activities
    }

