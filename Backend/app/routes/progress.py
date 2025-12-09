from typing import Optional, Dict, List
from collections import defaultdict

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..db.mongo import get_db

router = APIRouter()


@router.get("/progress")
async def get_progress(userId: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get overall progress statistics"""
    interactions = db["interactions"]
    flt = {"userId": userId} if userId else {}
    attempts = await interactions.count_documents(flt)
    correct = await interactions.count_documents({**flt, "isCorrect": True})
    accuracy = (correct / attempts) if attempts else 0.0
    return {"overallAccuracy": accuracy, "attempts": attempts}


@router.get("/progress/modules")
async def get_module_progress(userId: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get progress per module based on CORRECT answers only.
    Progress starts at 0 for new users and only counts questions answered correctly.
    """
    interactions = db["interactions"]
    
    # Count total activities per module from the activity_items data
    try:
        from ..data.activity_items import EXAMPLE_ACTIVITIES
        module_totals: Dict[str, int] = defaultdict(int)
        for activity in EXAMPLE_ACTIVITIES:
            module_totals[activity.moduleId] += 1
    except ImportError:
        # Fallback if import fails
        module_totals = {
            "M1": 23,
            "M2": 2,
            "M3": 1,
        }
    
    # If no userId, return 0 progress for all modules
    if not userId:
        result = {}
        for module_id in ["M1", "M2", "M3"]:
            result[module_id] = {
                "activitiesCompleted": 0,
                "totalActivities": module_totals.get(module_id, 10),
                "progress": 0,
            }
        return result
    
    # Get all CORRECT interactions for this user
    flt = {"userId": userId, "isCorrect": True}  # Only count correct answers
    cursor = interactions.find(flt)
    interactions_list = await cursor.to_list(length=None)
    
    # Count unique activities answered CORRECTLY per module
    module_counts: Dict[str, set] = defaultdict(set)  # module -> set of unique activity IDs
    
    for interaction in interactions_list:
        activity_id = interaction.get("activityId", "")
        if activity_id.startswith("M"):
            # Extract module ID (M1, M2, M3)
            module_id = activity_id.split("_")[0]  # e.g., "M1" from "M1_L1_Q1"
            module_counts[module_id].add(activity_id)
    
    result = {}
    for module_id in ["M1", "M2", "M3"]:
        correct_completed = len(module_counts.get(module_id, set()))
        total = module_totals.get(module_id, 10)
        progress_percent = round((correct_completed / total) * 100, 1) if total > 0 else 0
        
        # Cap progress at 100% (in case user completed more than available activities)
        progress_percent = min(progress_percent, 100.0)
        
        # Also cap completed count to total
        correct_completed = min(correct_completed, total)
        
        result[module_id] = {
            "activitiesCompleted": correct_completed,
            "totalActivities": total,
            "progress": progress_percent,
        }
    
    return result

