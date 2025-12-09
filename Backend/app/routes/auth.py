import base64
from typing import Optional, List

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, EmailStr

from ..db.mongo import get_db

router = APIRouter()


class RegisterRequest(BaseModel):
  name: str
  email: EmailStr
  password: str
  neuroFlags: Optional[List[str]] = None  # e.g. ["ADHD", "Dyslexia", "ASD"]
  # Keep neuroType for backward compatibility, but prefer neuroFlags
  neuroType: Optional[str] = None


class LoginRequest(BaseModel):
  email: EmailStr
  password: str


def _hash_password(password: str) -> str:
  return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(password: str, hashed: str) -> bool:
  return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def _make_token(user_id: str) -> str:
  raw = f"{user_id}"
  return base64.urlsafe_b64encode(raw.encode("utf-8")).decode("utf-8")


def _public_user(doc: dict) -> dict:
  doc = dict(doc)
  doc.pop("password", None)
  return doc


@router.post("/register")
async def register(payload: RegisterRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
  users = db["users"]
  existing = await users.find_one({"email": payload.email})
  if existing:
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")

  hashed = _hash_password(payload.password)
  # Use neuroFlags if provided, otherwise fall back to neuroType as single-item array
  neuro_flags = payload.neuroFlags if payload.neuroFlags else ([payload.neuroType] if payload.neuroType else [])
  user_doc = {
    "name": payload.name,
    "email": payload.email,
    "password": hashed,
    "neuroFlags": neuro_flags,
    # Keep neuroType for backward compatibility (use first flag if available)
    "neuroType": neuro_flags[0] if neuro_flags else payload.neuroType,
  }
  result = await users.insert_one(user_doc)
  user_doc["_id"] = str(result.inserted_id)
  token = _make_token(user_doc["_id"])
  return {"success": True, "token": token, "user": _public_user(user_doc)}


@router.post("/login")
async def login(payload: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
  users = db["users"]
  user_doc = await users.find_one({"email": payload.email})
  if not user_doc or not _verify_password(payload.password, user_doc.get("password", "")):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

  user_doc["_id"] = str(user_doc["_id"])
  token = _make_token(user_doc["_id"])
  return {"success": True, "token": token, "user": _public_user(user_doc)}

