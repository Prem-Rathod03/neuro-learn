"""
Activity Framework - Backend Pydantic models
Maps to TypeScript ActivityItem interface
"""

from typing import Optional, List, Literal
from pydantic import BaseModel

# Type definitions
ActivityType = Literal[
    "image_to_word",
    "one_step_instruction",
    "two_step_sequence",
    "counting",
    "visual_addition",
    "pattern",
    "comparison",
    "logic_choice",
    "sequence_ordering",
    "focus_filter"
]

ModuleId = Literal["M1", "M2", "M3"]
LessonId = Literal["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3.1", "3.2"]
Difficulty = Literal["easy", "medium", "hard"]
NeuroType = Literal["Dyslexia", "ADHD", "ASD"]


class ActivityOption(BaseModel):
    """Single choice/answer option"""
    id: str
    label: str
    isCorrect: bool
    ttsText: Optional[str] = None
    imageUrl: Optional[str] = None
    imageAlt: Optional[str] = None
    tags: Optional[List[str]] = None


class ActivityAccessibility(BaseModel):
    """Accessibility metadata for neurodiversity support"""
    recommendedFor: List[NeuroType]
    enableTtsOnHover: Optional[bool] = False
    showProgressBar: Optional[bool] = False
    avoidMetaphors: Optional[bool] = True
    consistentFeedback: Optional[bool] = True


class ActivityItem(BaseModel):
    """Core schema for each question/task"""
    id: str
    moduleId: ModuleId
    lessonId: LessonId
    type: ActivityType

    # What the student sees / hears
    instruction: str
    instructionTts: Optional[str] = None
    stimulusImageUrl: Optional[str] = None
    stimulusImageAlt: Optional[str] = None
    stimulusEmoji: Optional[str] = None
    stimulusDescription: Optional[str] = None

    # For multi-step sequences
    steps: Optional[List[str]] = None

    options: List[ActivityOption]

    # Difficulty & tracking
    difficulty: Difficulty
    maxTimeSeconds: Optional[int] = None
    targetCategory: Optional[str] = None

    # Accessibility / neurodiversity hints for UI
    accessibility: ActivityAccessibility

    class Config:
        json_schema_extra = {
            "example": {
                "id": "M1_L1_Q1",
                "moduleId": "M1",
                "lessonId": "1.1",
                "type": "image_to_word",
                "instruction": "Match the picture to the correct word.",
                "instructionTts": "Look at the picture and click the word that matches.",
                "stimulusImageUrl": "/images/module1/lesson1/pig.png",
                "stimulusImageAlt": "A pink pig standing on grass",
                "stimulusDescription": "A pink pig",
                "difficulty": "easy",
                "options": [
                    {
                        "id": "A",
                        "label": "Pig",
                        "isCorrect": True,
                        "ttsText": "pig"
                    },
                    {
                        "id": "B",
                        "label": "Big",
                        "isCorrect": False,
                        "ttsText": "big"
                    }
                ],
                "accessibility": {
                    "recommendedFor": ["Dyslexia"],
                    "enableTtsOnHover": True,
                    "showProgressBar": False,
                    "avoidMetaphors": True,
                    "consistentFeedback": True
                }
            }
        }

