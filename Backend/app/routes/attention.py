import base64
import io
from typing import Optional

from fastapi import APIRouter, HTTPException
from PIL import Image

from ..services.attention_model import predict_attention

router = APIRouter()


@router.post("/attention")
def attention(image: str):
  """
  Accepts a base64-encoded image string, returns an attention score between 0 and 1.
  """
  try:
    img_bytes = base64.b64decode(image.split(",")[-1])
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
  except Exception:
    raise HTTPException(status_code=400, detail="Invalid image payload")

  score: Optional[float] = predict_attention(img)
  if score is None:
    raise HTTPException(status_code=500, detail="Attention model not available")

  return {"attention_score": float(score)}

