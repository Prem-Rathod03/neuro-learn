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
        stimulusImageAlt="A pink pig",
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
    # M1_L1_Q2 - Van
    ActivityItem(
        id="M1_L1_Q2",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/van.png",
        stimulusImageAlt="A blue van on the road",
        stimulusDescription="A blue van",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Van", isCorrect=True, ttsText="van"),
            ActivityOption(id="B", label="Fan", isCorrect=False, ttsText="fan"),
            ActivityOption(id="C", label="Man", isCorrect=False, ttsText="man"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q3 - Net
    ActivityItem(
        id="M1_L1_Q3",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/net.png",
        stimulusImageAlt="A fishing net",
        stimulusDescription="A fishing net",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Net", isCorrect=True, ttsText="net"),
            ActivityOption(id="B", label="Wet", isCorrect=False, ttsText="wet"),
            ActivityOption(id="C", label="Pet", isCorrect=False, ttsText="pet"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q4 - Box
    ActivityItem(
        id="M1_L1_Q4",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/box.png",
        stimulusImageAlt="A brown box",
        stimulusDescription="A brown box",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Box", isCorrect=True, ttsText="box"),
            ActivityOption(id="B", label="Fox", isCorrect=False, ttsText="fox"),
            ActivityOption(id="C", label="Ox", isCorrect=False, ttsText="ox"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q5 - Pin
    ActivityItem(
        id="M1_L1_Q5",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/pin.png",
        stimulusImageAlt="A safety pin",
        stimulusDescription="A safety pin",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Pin", isCorrect=True, ttsText="pin"),
            ActivityOption(id="B", label="Pan", isCorrect=False, ttsText="pan"),
            ActivityOption(id="C", label="Pen", isCorrect=False, ttsText="pen"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q6 - Map
    ActivityItem(
        id="M1_L1_Q6",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/map.png",
        stimulusImageAlt="A folded map",
        stimulusDescription="A folded map",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Map", isCorrect=True, ttsText="map"),
            ActivityOption(id="B", label="Lap", isCorrect=False, ttsText="lap"),
            ActivityOption(id="C", label="Nap", isCorrect=False, ttsText="nap"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q7 - Bus
    ActivityItem(
        id="M1_L1_Q7",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/bus.png",
        stimulusImageAlt="A yellow bus",
        stimulusDescription="A yellow bus",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Bus", isCorrect=True, ttsText="bus"),
            ActivityOption(id="B", label="Bug", isCorrect=False, ttsText="bug"),
            ActivityOption(id="C", label="Bun", isCorrect=False, ttsText="bun"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q8 - Leg
    ActivityItem(
        id="M1_L1_Q8",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/leg.png",
        stimulusImageAlt="A human leg",
        stimulusDescription="A human leg",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Leg", isCorrect=True, ttsText="leg"),
            ActivityOption(id="B", label="Log", isCorrect=False, ttsText="log"),
            ActivityOption(id="C", label="Egg", isCorrect=False, ttsText="egg"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q9 - Pot
    ActivityItem(
        id="M1_L1_Q9",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/pot.png",
        stimulusImageAlt="A cooking pot",
        stimulusDescription="A cooking pot",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Pot", isCorrect=True, ttsText="pot"),
            ActivityOption(id="B", label="Hot", isCorrect=False, ttsText="hot"),
            ActivityOption(id="C", label="Dot", isCorrect=False, ttsText="dot"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q10 - Key
    ActivityItem(
        id="M1_L1_Q10",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/key.png",
        stimulusImageAlt="A metal key",
        stimulusDescription="A metal key",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Key", isCorrect=True, ttsText="key"),
            ActivityOption(id="B", label="See", isCorrect=False, ttsText="see"),
            ActivityOption(id="C", label="Bee", isCorrect=False, ttsText="bee"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q11 - Hat
    ActivityItem(
        id="M1_L1_Q11",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/hat.png",
        stimulusImageAlt="A black hat",
        stimulusDescription="A black hat",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Hat", isCorrect=True, ttsText="hat"),
            ActivityOption(id="B", label="Cat", isCorrect=False, ttsText="cat"),
            ActivityOption(id="C", label="Bat", isCorrect=False, ttsText="bat"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L1_Q12 - Cow
    ActivityItem(
        id="M1_L1_Q12",
        moduleId="M1",
        lessonId="1.1",
        type="image_to_word",
        instruction="Match the picture to the correct word.",
        instructionTts="Look at the picture and click the word that matches.",
        stimulusImageUrl="/images/module1/lesson1/cow.png",
        stimulusImageAlt="A farm cow",
        stimulusDescription="A farm cow",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Cow", isCorrect=True, ttsText="cow"),
            ActivityOption(id="B", label="Bow", isCorrect=False, ttsText="bow"),
            ActivityOption(id="C", label="How", isCorrect=False, ttsText="how"),
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
                ttsText="happy boy",
                tags=["emotion:happy"]
            ),
            ActivityOption(
                id="B",
                label="Sad Boy",
                isCorrect=True,
                imageUrl="/images/module1/lesson2/sad_boy.png",
                imageAlt="A boy with a sad face and tears",
                ttsText="sad boy",
                tags=["emotion:sad", "target"]
            ),
            ActivityOption(
                id="C",
                label="Excited Boy",
                isCorrect=False,
                imageUrl="/images/module1/lesson2/excited_boy.png",
                imageAlt="A boy jumping with excitement",
                ttsText="excited boy",
                tags=["emotion:excited"]
            ),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q2 - Empty Glass
    ActivityItem(
        id="M1_L2_Q2",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Select the empty glass.",
        instructionTts="Select the empty glass.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Full", isCorrect=False, ttsText="full glass", imageUrl="/images/module1/lesson2/full_glass.png", imageAlt="A full glass"),
            ActivityOption(id="B", label="Half", isCorrect=False, ttsText="half glass", imageUrl="/images/module1/lesson2/half_glass.png", imageAlt="A half-full glass"),
            ActivityOption(id="C", label="Empty", isCorrect=True, ttsText="empty glass", imageUrl="/images/module1/lesson2/empty_glass.png", imageAlt="An empty glass"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q3 - Broken Egg
    ActivityItem(
        id="M1_L2_Q3",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Click the broken egg.",
        instructionTts="Click the broken egg.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Whole", isCorrect=False, ttsText="whole egg", imageUrl="/images/module1/lesson2/whole_egg.png", imageAlt="A whole egg"),
            ActivityOption(id="B", label="Broken", isCorrect=True, ttsText="broken egg", imageUrl="/images/module1/lesson2/broken_egg.png", imageAlt="A broken egg"),
            ActivityOption(id="C", label="Fried", isCorrect=False, ttsText="fried egg", imageUrl="/images/module1/lesson2/fried_egg.png", imageAlt="A fried egg"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q4 - Yellow Duck
    ActivityItem(
        id="M1_L2_Q4",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Find the yellow duck.",
        instructionTts="Find the yellow duck.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="White", isCorrect=False, ttsText="white duck", imageUrl="/images/module1/lesson2/white_duck.png", imageAlt="A white duck"),
            ActivityOption(id="B", label="Yellow", isCorrect=True, ttsText="yellow duck", imageUrl="/images/module1/lesson2/yellow_duck.png", imageAlt="A yellow duck"),
            ActivityOption(id="C", label="Brown", isCorrect=False, ttsText="brown duck", imageUrl="/images/module1/lesson2/brown_duck.png", imageAlt="A brown duck"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q5 - Open Door
    ActivityItem(
        id="M1_L2_Q5",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Click the open door.",
        instructionTts="Click the open door.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Closed", isCorrect=False, ttsText="closed door", imageUrl="/images/module1/lesson2/closed_door.png", imageAlt="A closed door"),
            ActivityOption(id="B", label="Open", isCorrect=True, ttsText="open door", imageUrl="/images/module1/lesson2/open_door.png", imageAlt="An open door"),
            ActivityOption(id="C", label="Locked", isCorrect=False, ttsText="locked door", imageUrl="/images/module1/lesson2/locked_door.png", imageAlt="A locked door"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q6 - Cold Ice Cream
    ActivityItem(
        id="M1_L2_Q6",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Select the cold ice cream.",
        instructionTts="Select the cold ice cream.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Hot soup", isCorrect=False, ttsText="hot soup", imageUrl="/images/module1/lesson2/hot_soup.png", imageAlt="Hot soup"),
            ActivityOption(id="B", label="Warm tea", isCorrect=False, ttsText="warm tea", imageUrl="/images/module1/lesson2/warm_tea.png", imageAlt="Warm tea"),
            ActivityOption(id="C", label="Cold ice cream", isCorrect=True, ttsText="cold ice cream", imageUrl="/images/module1/lesson2/cold_ice_cream.png", imageAlt="Cold ice cream"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q7 - Flying Animal
    ActivityItem(
        id="M1_L2_Q7",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Click the animal flying.",
        instructionTts="Click the animal flying.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Sitting bird", isCorrect=False, ttsText="sitting bird", imageUrl="/images/module1/lesson2/sitting_bird.png", imageAlt="A bird sitting"),
            ActivityOption(id="B", label="Flying bird", isCorrect=True, ttsText="flying bird", imageUrl="/images/module1/lesson2/flying_bird.png", imageAlt="A bird flying"),
            ActivityOption(id="C", label="Sleeping bird", isCorrect=False, ttsText="sleeping bird", imageUrl="/images/module1/lesson2/sleeping_bird.png", imageAlt="A bird sleeping"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q8 - Triangle
    ActivityItem(
        id="M1_L2_Q8",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Find the triangle.",
        instructionTts="Find the triangle.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Circle", isCorrect=False, ttsText="circle", imageUrl="/images/module1/lesson2/circle.png", imageAlt="A circle"),
            ActivityOption(id="B", label="Square", isCorrect=False, ttsText="square", imageUrl="/images/module1/lesson2/square.png", imageAlt="A square"),
            ActivityOption(id="C", label="Triangle", isCorrect=True, ttsText="triangle", imageUrl="/images/module1/lesson2/triangle.png", imageAlt="A triangle"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q9 - Dirty Shirt
    ActivityItem(
        id="M1_L2_Q9",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Click the dirty shirt.",
        instructionTts="Click the dirty shirt.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Clean", isCorrect=False, ttsText="clean shirt", imageUrl="/images/module1/lesson2/clean_shirt.png", imageAlt="A clean shirt"),
            ActivityOption(id="B", label="Dirty", isCorrect=True, ttsText="dirty shirt", imageUrl="/images/module1/lesson2/dirty_shirt.png", imageAlt="A dirty shirt"),
            ActivityOption(id="C", label="New", isCorrect=False, ttsText="new shirt", imageUrl="/images/module1/lesson2/new_shirt.png", imageAlt="A new shirt"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),
    # M1_L2_Q10 - Tallest Tree
    ActivityItem(
        id="M1_L2_Q10",
        moduleId="M1",
        lessonId="1.2",
        type="one_step_instruction",
        instruction="Select the tallest tree.",
        instructionTts="Select the tallest tree.",
        difficulty="easy",
        options=[
            ActivityOption(id="A", label="Bush", isCorrect=False, ttsText="bush", imageUrl="/images/module1/lesson2/bush.png", imageAlt="A bush"),
            ActivityOption(id="B", label="Small tree", isCorrect=False, ttsText="small tree", imageUrl="/images/module1/lesson2/small_tree.png", imageAlt="A small tree"),
            ActivityOption(id="C", label="Tall tree", isCorrect=True, ttsText="tall tree", imageUrl="/images/module1/lesson2/tall_tree.png", imageAlt="A tall tree"),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["Dyslexia"],
            enableTtsOnHover=True,
            showProgressBar=False,
            avoidMetaphors=True,
            consistentFeedback=True
        )
    ),

    # Module 1, Lesson 1.3 - Two-Step Sequence (Spoon then Fork)
    ActivityItem(
        id="M1_L3_Q1",
        moduleId="M1",
        lessonId="1.3",
        type="two_step_sequence",
        instruction="First click the spoon, then click the fork.",
        instructionTts="First click the spoon, then click the fork.",
        steps=[
            "First click the spoon.",
            "Then click the fork."
        ],
        difficulty="medium",
        options=[
            ActivityOption(
                id="spoon",
                label="Spoon",
                imageUrl="/images/module1/lesson3/spoon.png",
                imageAlt="A metal spoon",
                isCorrect=True,
                ttsText="Spoon"
            ),
            ActivityOption(
                id="fork",
                label="Fork",
                imageUrl="/images/module1/lesson3/fork.png",
                imageAlt="A metal fork",
                isCorrect=True,
                ttsText="Fork"
            ),
            ActivityOption(
                id="plate",
                label="Plate",
                imageUrl="/images/module1/lesson3/plate.png",
                imageAlt="A white plate",
                isCorrect=False,
                ttsText="Plate"
            ),
        ],
        accessibility=ActivityAccessibility(
            recommendedFor=["ASD", "ADHD"],
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

    # Module 2, Lesson 2.2 - Visual Addition (3 + 2 = 5)
    ActivityItem(
        id="M2_L2_Q1",
        moduleId="M2",
        lessonId="2.2",
        type="visual_addition",
        instruction="Count the apples. How many are there?",
        instructionTts="Count the apples. How many are there?",
        stimulusImageUrl="/images/module2/lesson2/apples_5.png",
        stimulusImageAlt="Three red apples on the left, two green apples on the right",
        stimulusDescription="Three red apples and two green apples",
        difficulty="easy",
        options=[
            ActivityOption(id="3", label="3", isCorrect=False, ttsText="three"),
            ActivityOption(id="5", label="5", isCorrect=True, ttsText="five"),
            ActivityOption(id="6", label="6", isCorrect=False, ttsText="six"),
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


def get_activities_by_module(module_id: str) -> List[ActivityItem]:
    """Get all activities for a specific module, sorted by lessonId"""
    activities = [
        activity
        for activity in EXAMPLE_ACTIVITIES
        if activity.moduleId == module_id
    ]
    # Sort by lessonId (convert to float for proper numeric sorting: 1.1, 1.2, 1.3, etc.)
    activities.sort(key=lambda a: float(a.lessonId))
    return activities


def get_next_activity_in_sequence(module_id: str, last_activity_id: Optional[str] = None, last_lesson_id: Optional[str] = None) -> Optional[ActivityItem]:
    """
    Get the next activity in sequence for a module.
    Tracks both lesson and specific activity within lesson.
    
    Args:
        module_id: Module ID (M1, M2, M3)
        last_activity_id: Last completed activity ID (e.g., "M1_L1_Q1")
        last_lesson_id: Last completed lesson ID (e.g., "1.1") - used as fallback
    
    Returns:
        Next activity in sequence, or None if no more activities
    """
    module_activities = get_activities_by_module(module_id)
    if not module_activities:
        return None
    
    # Sort all activities by lessonId, then by id (for consistent ordering within lessons)
    module_activities.sort(key=lambda a: (float(a.lessonId), a.id))
    
    # If no last activity, return first activity
    if not last_activity_id:
        return module_activities[0] if module_activities else None
    
    # Find the index of the last completed activity
    last_index = -1
    for i, activity in enumerate(module_activities):
        if activity.id == last_activity_id:
            last_index = i
            break
    
    # If last activity not found, try to find by lesson
    if last_index == -1 and last_lesson_id:
        for i, activity in enumerate(module_activities):
            if activity.lessonId == last_lesson_id:
                last_index = i
                break
    
    # If still not found, return first activity
    if last_index == -1:
        return module_activities[0] if module_activities else None
    
    # Get next activity (next in list)
    next_index = last_index + 1
    
    # If we've reached the end, return None (don't loop back)
    if next_index >= len(module_activities):
        return None  # End of module reached
    
    return module_activities[next_index]

