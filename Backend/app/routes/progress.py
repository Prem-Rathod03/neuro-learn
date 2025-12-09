from typing import Optional

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..db.mongo import get_db

router = APIRouter()


@router.get("/progress")
async def get_progress(userId: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
  interactions = db["interactions"]
  flt = {"userId": userId} if userId else {}
  attempts = await interactions.count_documents(flt)
  correct = await interactions.count_documents({**flt, "isCorrect": True})
  accuracy = (correct / attempts) if attempts else 0.0
  return {"overallAccuracy": accuracy, "attempts": attempts}

