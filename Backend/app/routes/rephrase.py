from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..services import nlp_engine
from ..services.model_logger import log_rephrase_request
from ..db.mongo import get_db

router = APIRouter()


class RephraseRequest(BaseModel):
    question: str
    options: Optional[List[str]] = None
    difficulty: Optional[str] = None
    neuroType: Optional[str] = None
    confusionFlag: Optional[bool] = None


class RephraseResponse(BaseModel):
    simplifiedQuestion: str
    simplifiedOptions: Optional[List[str]] = None


@router.post("/rephrase", response_model=RephraseResponse)
async def rephrase(req: RephraseRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        # Validate that question is provided
        if not req.question or not req.question.strip():
            raise HTTPException(status_code=400, detail="Question is required")
        
        print(f"Rephrase request: question={req.question[:50]}..., options={req.options}, difficulty={req.difficulty}")
        simplified_q, simplified_opts = await nlp_engine.rephrase_text(req)
        print(f"Rephrase result: {simplified_q[:50]}...")
        
        # Log rephrase request for tracking
        await log_rephrase_request(
            db,
            None,  # userId - could be extracted from auth token in future
            req.question,
            simplified_q,
            req.neuroType
        )
        
        return RephraseResponse(
            simplifiedQuestion=simplified_q,
            simplifiedOptions=simplified_opts,
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        # If it's a quota/rate limit error, return a helpful message
        if "429" in error_msg or "quota" in error_msg.lower() or "rate limit" in error_msg.lower():
            raise HTTPException(
                status_code=429, 
                detail="API quota exceeded. Please try again later or check your billing."
            )
        import traceback
        error_trace = traceback.format_exc()
        print(f"Rephrase error: {error_msg}\n{error_trace}")
        raise HTTPException(status_code=500, detail=f"Rephrase failed: {error_msg}")
