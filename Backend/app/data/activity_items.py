"""
Example Activity Items - Can be stored in MongoDB or served directly
These match the ActivityItem schema
"""

from typing import Optional, List
from ..models.activity import ActivityItem, ActivityOption, ActivityAccessibility

# Example activities following the new schema
EXAMPLE_ACTIVITIES = [
    # Module 1, Lesson 1.1 - Match Picture to Word (Pig)
    ActivityItem(
        id="M1_L1_Q1",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/pig.png",
        stimulusImageAlt="A pink pig standing on grass",
        stimulusDescription="A pink pig",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Pig", isCorrect=True, ttsText="pig"),
            ActivityOption(id="B", label="Big", isCorrect=False, ttsText="big"),
            ActivityOption(id="C", label="Dig", isCorrect=False, ttsText="dig"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),

    # Module 1, Lesson 1.2 - One-Step Instruction (Click the Sad Boy)
    ActivityItem(
        id="M1_L2_Q1",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Click the sad boy.",
        instructionTts="Click the sad boy.",
        difficulty="easy",
        options=[
            ActivityOption(
                id="A",
                label="Happy Boy",
                isCorrect=False,
                imageUrl="/images/module1/lesson2/happy_boy.png",
                imageAlt="A boy smiling happily",
                ttsText="Happy boy",
                tags=["emotion:happy"]
            ),
            ActivityOption(
                id="B",
                label="Sad Boy",
                isCorrect=True,
                imageUrl="/images/module1/lesson2/sad_boy.png",
                imageAlt="A boy with a sad face and tears",
                ttsText="Sad boy",
                tags=["emotion:sad", "target"]
            ),
            ActivityOption(
                id="C",
                label="Excited Boy",
                isCorrect=False,
                imageUrl="/images/module1/lesson2/excited_boy.png",
                imageAlt="A boy jumping with excitement",
                ttsText="Excited boy",
                tags=["emotion:excited"]
            ),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia", "ASD"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),

    # Module 2, Lesson 2.1 - Counting (1 Butterfly)
    ActivityItem(
        id="M2_L1_Q1",
        moduleId="M2",
        lessonId="2.1",
        type="counting",
        instruction="How many butterflies do you see?",
        instructionTts="How many butterflies do you see?",
        stimulusEmoji="🦋",
        stimulusDescription="one butterfly",
        difficulty="easy",
        options=[
            ActivityOption(id="1", label="1", isCorrect=True, ttsText="one"),
            ActivityOption(id="2", label="2", isCorrect=False, ttsText="two"),
            ActivityOption(id="0", label="0", isCorrect=False, ttsText="zero"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia", "ADHD"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),

    # Module 3, Lesson 3.2 - Focus Filter (Green Things)
    ActivityItem(
        id="M3_L2_Q1",
        moduleId="M3",
        lessonId="3.2",
        type="focus_filter",
        instruction="You have 30 seconds. Only click green things.",
        instructionTts="You have thirty seconds. Only click green things.",
        targetCategory="Green Things",
        maxTimeSeconds=30,
        difficulty="medium",
        options=[
            ActivityOption(
                id="green_leaf",
                label="🌿",
                isCorrect=True,
                ttsText="Green leaf",
                tags=["green", "target"]
            ),
            ActivityOption(
                id="green_ball",
                label="🟢",
                isCorrect=True,
                ttsText="Green circle",
                tags=["green", "target"]
            ),
            ActivityOption(
                id="red_ball",
                label="🔴",
                isCorrect=False,
                ttsText="Red circle",
                tags=["red", "distractor"]
            ),
            ActivityOption(
                id="blue_ball",
                label="🔵",
                isCorrect=False,
                ttsText="Blue circle",
                tags=["blue", "distractor"]
            ),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["ADHD"],
            enableTtsOnHover=False,
            showProgressBar=True,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
]


def get_activity_by_id(activity_id: str) -> Optional[ActivityItem]:
    """Get activity by ID"""
    for activity in EXAMPLE_ACTIVITIES:
        if activity.id == activity_id:
            return activity
    return None


def get_activities_by_lesson(module_id: str, lesson_id: str) -> List[ActivityItem]:
    """Get activities by module and lesson"""
    return [
        activity
        for activity in EXAMPLE_ACTIVITIES
        if activity.moduleId == module_id and activity.lessonId == lesson_id
    ]

