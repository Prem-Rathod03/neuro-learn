# backend/app/services/feature_builder.py

from typing import List, Dict, Any


def build_features(logs: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Build feature vector from past interaction logs.
    
    logs: list of interaction documents from MongoDB
    Returns: dict with aggregated features for ML models
    """
    if not logs:
        # Return defaults if no history
        return {
            "avg_accuracy": 0.0,
            "avg_time": 30.0,
            "avg_difficulty_rating": 3.0,
            "avg_focus_rating": 3.0,
            "avg_attention_score": 0.8,
            "avg_sentiment": 0.0,
            "confusion_rate": 0.0,
        }

    # Extract numeric fields
    correct_count = sum(1 for log in logs if log.get("isCorrect", False))
    total_count = len(logs)
    avg_accuracy = correct_count / total_count if total_count > 0 else 0.0

    times = [log.get("timeTaken", 0.0) for log in logs if log.get("timeTaken")]
    avg_time = sum(times) / len(times) if times else 30.0

    diff_ratings = [log.get("difficultyRating", 3) for log in logs if log.get("difficultyRating")]
    avg_difficulty_rating = sum(diff_ratings) / len(diff_ratings) if diff_ratings else 3.0

    focus_ratings = [log.get("focusRating", 3) for log in logs if log.get("focusRating")]
    avg_focus_rating = sum(focus_ratings) / len(focus_ratings) if focus_ratings else 3.0

    attention_scores = [log.get("attentionScore", 0.8) for log in logs if log.get("attentionScore") is not None]
    avg_attention_score = sum(attention_scores) / len(attention_scores) if attention_scores else 0.8

    # NLP features: sentiment and confusion
    sentiment_scores = [log.get("sentimentScore", 0.0) for log in logs if log.get("sentimentScore") is not None]
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.0

    confusion_flags = [log.get("confusionFlag", False) for log in logs if log.get("confusionFlag") is not None]
    confusion_count = sum(1 for flag in confusion_flags if flag)
    confusion_rate = confusion_count / len(logs) if logs else 0.0

    return {
        "avg_accuracy": avg_accuracy,
        "avg_time": avg_time,
        "avg_difficulty_rating": avg_difficulty_rating,
        "avg_focus_rating": avg_focus_rating,
        "avg_attention_score": avg_attention_score,
        "avg_sentiment": avg_sentiment,
        "confusion_rate": confusion_rate,
    }
