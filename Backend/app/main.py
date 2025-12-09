from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import activity, auth, progress, rephrase, attention, analytics, admin, tts
from .db.mongo import close_client

# Load environment variables from .env file
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
  # Nothing to start on boot for now; close DB client on shutdown.
  yield
  close_client()


app = FastAPI(title="Neurodiverse Learning Backend", lifespan=lifespan)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(activity.router, prefix="/api/activity", tags=["activity"])
app.include_router(progress.router, prefix="/api", tags=["progress"])
app.include_router(rephrase.router, prefix="/api", tags=["rephrase"])
app.include_router(attention.router, prefix="/api", tags=["attention"])
app.include_router(analytics.router, prefix="/api", tags=["analytics"])
app.include_router(admin.router, prefix="/api", tags=["admin"])
app.include_router(tts.router, prefix="/api", tags=["tts"])


@app.get("/")
async def root():
  return {"message": "backend running"}

