"""
MongoDB helper utilities using Motor (async).
"""

import os
from typing import Optional

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "neuro_learn")

_client: Optional[AsyncIOMotorClient] = None


async def get_client() -> AsyncIOMotorClient:
  """Lazy-init a single shared Motor client."""
  global _client
  if _client is None:
    _client = AsyncIOMotorClient(MONGODB_URI)
  return _client


async def get_db() -> AsyncIOMotorDatabase:
  client = await get_client()
  return client[MONGODB_DB]


def close_client() -> None:
  global _client
  if _client is not None:
    _client.close()
    _client = None

