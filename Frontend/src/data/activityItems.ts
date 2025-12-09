/**
 * Example Activity Items following the new schema
 * These can be stored in MongoDB or served from the backend
 */

import { ActivityItem } from '@/types/activity';

export const exampleActivities: ActivityItem[] = [
  // =========================
  // MODULE 1 — LANGUAGE
  // Lesson 1.1 — Match Picture to Word
  // =========================
  {
    id: "M1_L1_Q1",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/pig.png",
    stimulusImageAlt: "A pink pig",
    stimulusDescription: "A pink pig",
    difficulty: "easy",
    options: [
      { id: "A", label: "Pig", isCorrect: true, ttsText: "pig" },
      { id: "B", label: "Big", isCorrect: false, ttsText: "big" },
      { id: "C", label: "Dig", isCorrect: false, ttsText: "dig" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q2",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/van.png",
    stimulusImageAlt: "A blue van on the road",
    stimulusDescription: "A blue van",
    difficulty: "easy",
    options: [
      { id: "A", label: "Van", isCorrect: true, ttsText: "van" },
      { id: "B", label: "Fan", isCorrect: false, ttsText: "fan" },
      { id: "C", label: "Man", isCorrect: false, ttsText: "man" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q3",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/net.png",
    stimulusImageAlt: "A fishing net",
    stimulusDescription: "A fishing net",
    difficulty: "easy",
    options: [
      { id: "A", label: "Net", isCorrect: true, ttsText: "net" },
      { id: "B", label: "Wet", isCorrect: false, ttsText: "wet" },
      { id: "C", label: "Pet", isCorrect: false, ttsText: "pet" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q4",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/box.png",
    stimulusImageAlt: "A brown box",
    stimulusDescription: "A brown box",
    difficulty: "easy",
    options: [
      { id: "A", label: "Box", isCorrect: true, ttsText: "box" },
      { id: "B", label: "Fox", isCorrect: false, ttsText: "fox" },
      { id: "C", label: "Ox", isCorrect: false, ttsText: "ox" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q5",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/pin.png",
    stimulusImageAlt: "A safety pin",
    stimulusDescription: "A safety pin",
    difficulty: "easy",
    options: [
      { id: "A", label: "Pin", isCorrect: true, ttsText: "pin" },
      { id: "B", label: "Pan", isCorrect: false, ttsText: "pan" },
      { id: "C", label: "Pen", isCorrect: false, ttsText: "pen" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q6",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/map.png",
    stimulusImageAlt: "A folded map",
    stimulusDescription: "A folded map",
    difficulty: "easy",
    options: [
      { id: "A", label: "Map", isCorrect: true, ttsText: "map" },
      { id: "B", label: "Lap", isCorrect: false, ttsText: "lap" },
      { id: "C", label: "Nap", isCorrect: false, ttsText: "nap" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q7",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/bus.png",
    stimulusImageAlt: "A yellow bus",
    stimulusDescription: "A yellow bus",
    difficulty: "easy",
    options: [
      { id: "A", label: "Bus", isCorrect: true, ttsText: "bus" },
      { id: "B", label: "Bug", isCorrect: false, ttsText: "bug" },
      { id: "C", label: "Bun", isCorrect: false, ttsText: "bun" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q8",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/leg.png",
    stimulusImageAlt: "A human leg",
    stimulusDescription: "A human leg",
    difficulty: "easy",
    options: [
      { id: "A", label: "Leg", isCorrect: true, ttsText: "leg" },
      { id: "B", label: "Log", isCorrect: false, ttsText: "log" },
      { id: "C", label: "Egg", isCorrect: false, ttsText: "egg" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q9",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/pot.png",
    stimulusImageAlt: "A cooking pot",
    stimulusDescription: "A cooking pot",
    difficulty: "easy",
    options: [
      { id: "A", label: "Pot", isCorrect: true, ttsText: "pot" },
      { id: "B", label: "Hot", isCorrect: false, ttsText: "hot" },
      { id: "C", label: "Dot", isCorrect: false, ttsText: "dot" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q10",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/key.png",
    stimulusImageAlt: "A metal key",
    stimulusDescription: "A metal key",
    difficulty: "easy",
    options: [
      { id: "A", label: "Key", isCorrect: true, ttsText: "key" },
      { id: "B", label: "See", isCorrect: false, ttsText: "see" },
      { id: "C", label: "Bee", isCorrect: false, ttsText: "bee" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q11",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/hat.png",
    stimulusImageAlt: "A black hat",
    stimulusDescription: "A black hat",
    difficulty: "easy",
    options: [
      { id: "A", label: "Hat", isCorrect: true, ttsText: "hat" },
      { id: "B", label: "Cat", isCorrect: false, ttsText: "cat" },
      { id: "C", label: "Bat", isCorrect: false, ttsText: "bat" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L1_Q12",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/cow.png",
    stimulusImageAlt: "A farm cow",
    stimulusDescription: "A farm cow",
    difficulty: "easy",
    options: [
      { id: "A", label: "Cow", isCorrect: true, ttsText: "cow" },
      { id: "B", label: "Bow", isCorrect: false, ttsText: "bow" },
      { id: "C", label: "How", isCorrect: false, ttsText: "how" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // =========================
  // Lesson 1.2 — One-Step Instructions
  // type: instruction_to_image
  // =========================
  {
    id: "M1_L2_Q1",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Click the sad boy.",
    instructionTts: "Click the sad boy.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Select the correct image that matches the instruction.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Happy Boy",
        isCorrect: false,
        ttsText: "happy boy",
        imageUrl: "/images/module1/lesson2/happy_boy.png"
      },
      {
        id: "B",
        label: "Sad Boy",
        isCorrect: true,
        ttsText: "sad boy",
        imageUrl: "/images/module1/lesson2/sad_boy.png"
      },
      {
        id: "C",
        label: "Excited Boy",
        isCorrect: false,
        ttsText: "excited boy",
        imageUrl: "/images/module1/lesson2/excited_boy.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q2",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Select the empty glass.",
    instructionTts: "Select the empty glass.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the empty glass.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Full",
        isCorrect: false,
        ttsText: "full glass",
        imageUrl: "/images/module1/lesson2/full_glass.png"
      },
      {
        id: "B",
        label: "Half",
        isCorrect: false,
        ttsText: "half glass",
        imageUrl: "/images/module1/lesson2/half_glass.png"
      },
      {
        id: "C",
        label: "Empty",
        isCorrect: true,
        ttsText: "empty glass",
        imageUrl: "/images/module1/lesson2/empty_glass.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q3",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Click the broken egg.",
    instructionTts: "Click the broken egg.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the broken egg.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Whole",
        isCorrect: false,
        ttsText: "whole egg",
        imageUrl: "/images/module1/lesson2/whole_egg.png"
      },
      {
        id: "B",
        label: "Broken",
        isCorrect: true,
        ttsText: "broken egg",
        imageUrl: "/images/module1/lesson2/broken_egg.png"
      },
      {
        id: "C",
        label: "Fried",
        isCorrect: false,
        ttsText: "fried egg",
        imageUrl: "/images/module1/lesson2/fried_egg.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q4",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Find the yellow duck.",
    instructionTts: "Find the yellow duck.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the yellow duck.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "White",
        isCorrect: false,
        ttsText: "white duck",
        imageUrl: "/images/module1/lesson2/white_duck.png"
      },
      {
        id: "B",
        label: "Yellow",
        isCorrect: true,
        ttsText: "yellow duck",
        imageUrl: "/images/module1/lesson2/yellow_duck.png"
      },
      {
        id: "C",
        label: "Brown",
        isCorrect: false,
        ttsText: "brown duck",
        imageUrl: "/images/module1/lesson2/brown_duck.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q5",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Click the open door.",
    instructionTts: "Click the open door.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the open door.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Closed",
        isCorrect: false,
        ttsText: "closed door",
        imageUrl: "/images/module1/lesson2/closed_door.png"
      },
      {
        id: "B",
        label: "Open",
        isCorrect: true,
        ttsText: "open door",
        imageUrl: "/images/module1/lesson2/open_door.png"
      },
      {
        id: "C",
        label: "Locked",
        isCorrect: false,
        ttsText: "locked door",
        imageUrl: "/images/module1/lesson2/locked_door.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q6",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Select the cold ice cream.",
    instructionTts: "Select the cold ice cream.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the cold ice cream.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Hot soup",
        isCorrect: false,
        ttsText: "hot soup",
        imageUrl: "/images/module1/lesson2/hot_soup.png"
      },
      {
        id: "B",
        label: "Warm tea",
        isCorrect: false,
        ttsText: "warm tea",
        imageUrl: "/images/module1/lesson2/warm_tea.png"
      },
      {
        id: "C",
        label: "Cold ice cream",
        isCorrect: true,
        ttsText: "cold ice cream",
        imageUrl: "/images/module1/lesson2/cold_ice_cream.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q7",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Click the animal flying.",
    instructionTts: "Click the animal flying.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the flying animal.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Sitting bird",
        isCorrect: false,
        ttsText: "sitting bird",
        imageUrl: "/images/module1/lesson2/sitting_bird.png"
      },
      {
        id: "B",
        label: "Flying bird",
        isCorrect: true,
        ttsText: "flying bird",
        imageUrl: "/images/module1/lesson2/flying_bird.png"
      },
      {
        id: "C",
        label: "Sleeping bird",
        isCorrect: false,
        ttsText: "sleeping bird",
        imageUrl: "/images/module1/lesson2/sleeping_bird.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q8",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Find the triangle.",
    instructionTts: "Find the triangle.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the triangle.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Circle",
        isCorrect: false,
        ttsText: "circle",
        imageUrl: "/images/module1/lesson2/circle.png"
      },
      {
        id: "B",
        label: "Square",
        isCorrect: false,
        ttsText: "square",
        imageUrl: "/images/module1/lesson2/square.png"
      },
      {
        id: "C",
        label: "Triangle",
        isCorrect: true,
        ttsText: "triangle",
        imageUrl: "/images/module1/lesson2/triangle.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q9",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Click the dirty shirt.",
    instructionTts: "Click the dirty shirt.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the dirty shirt.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Clean",
        isCorrect: false,
        ttsText: "clean shirt",
        imageUrl: "/images/module1/lesson2/clean_shirt.png"
      },
      {
        id: "B",
        label: "Dirty",
        isCorrect: true,
        ttsText: "dirty shirt",
        imageUrl: "/images/module1/lesson2/dirty_shirt.png"
      },
      {
        id: "C",
        label: "New",
        isCorrect: false,
        ttsText: "new shirt",
        imageUrl: "/images/module1/lesson2/new_shirt.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L2_Q10",
    moduleId: "M1",
    lessonId: "1.2",
    type: "instruction_to_image",
    instruction: "Select the tallest tree.",
    instructionTts: "Select the tallest tree.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Choose the tallest tree.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Bush",
        isCorrect: false,
        ttsText: "bush",
        imageUrl: "/images/module1/lesson2/bush.png"
      },
      {
        id: "B",
        label: "Small tree",
        isCorrect: false,
        ttsText: "small tree",
        imageUrl: "/images/module1/lesson2/small_tree.png"
      },
      {
        id: "C",
        label: "Tall tree",
        isCorrect: true,
        ttsText: "tall tree",
        imageUrl: "/images/module1/lesson2/tall_tree.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // =========================
  // Lesson 1.3 — Two-Step Sequences
  // type: two_step_sequence
  // =========================
  {
    id: "M1_L3_Q1",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the spoon, then click the fork.",
    instructionTts: "First click the spoon, then click the fork.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: spoon then fork.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Spoon",
        isCorrect: true,
        ttsText: "spoon",
        imageUrl: "/images/module1/lesson3/spoon.png"
      },
      {
        id: "B",
        label: "Fork",
        isCorrect: true,
        ttsText: "fork",
        imageUrl: "/images/module1/lesson3/fork.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q2",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the red button, then click the green button.",
    instructionTts: "First click the red button, then click the green button.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: red button then green button.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Red button",
        isCorrect: true,
        ttsText: "red button",
        imageUrl: "/images/module1/lesson3/red_button.png"
      },
      {
        id: "B",
        label: "Green button",
        isCorrect: true,
        ttsText: "green button",
        imageUrl: "/images/module1/lesson3/green_button.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q3",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the dog, then click the house.",
    instructionTts: "First click the dog, then click the house.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: dog then house.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Dog",
        isCorrect: true,
        ttsText: "dog",
        imageUrl: "/images/module1/lesson3/dog.png"
      },
      {
        id: "B",
        label: "House",
        isCorrect: true,
        ttsText: "house",
        imageUrl: "/images/module1/lesson3/house.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q4",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the cloud, then click the rain.",
    instructionTts: "First click the cloud, then click the rain.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: cloud then rain.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Cloud",
        isCorrect: true,
        ttsText: "cloud",
        imageUrl: "/images/module1/lesson3/cloud.png"
      },
      {
        id: "B",
        label: "Rain",
        isCorrect: true,
        ttsText: "rain",
        imageUrl: "/images/module1/lesson3/rain.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q5",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the shoes, then click the socks.",
    instructionTts: "First click the shoes, then click the socks.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: shoes then socks.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Shoes",
        isCorrect: true,
        ttsText: "shoes",
        imageUrl: "/images/module1/lesson3/shoes.png"
      },
      {
        id: "B",
        label: "Socks",
        isCorrect: true,
        ttsText: "socks",
        imageUrl: "/images/module1/lesson3/socks.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q6",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the big ball, then click the small ball.",
    instructionTts: "First click the big ball, then click the small ball.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: big ball then small ball.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Big ball",
        isCorrect: true,
        ttsText: "big ball",
        imageUrl: "/images/module1/lesson3/big_ball.png"
      },
      {
        id: "B",
        label: "Small ball",
        isCorrect: true,
        ttsText: "small ball",
        imageUrl: "/images/module1/lesson3/small_ball.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q7",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the car, then click the bus.",
    instructionTts: "First click the car, then click the bus.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: car then bus.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Car",
        isCorrect: true,
        ttsText: "car",
        imageUrl: "/images/module1/lesson3/car.png"
      },
      {
        id: "B",
        label: "Bus",
        isCorrect: true,
        ttsText: "bus",
        imageUrl: "/images/module1/lesson3/bus.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q8",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the moon, then click the star.",
    instructionTts: "First click the moon, then click the star.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: moon then star.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Moon",
        isCorrect: true,
        ttsText: "moon",
        imageUrl: "/images/module1/lesson3/moon.png"
      },
      {
        id: "B",
        label: "Star",
        isCorrect: true,
        ttsText: "star",
        imageUrl: "/images/module1/lesson3/star.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q9",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the pencil, then click the paper.",
    instructionTts: "First click the pencil, then click the paper.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: pencil then paper.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Pencil",
        isCorrect: true,
        ttsText: "pencil",
        imageUrl: "/images/module1/lesson3/pencil.png"
      },
      {
        id: "B",
        label: "Paper",
        isCorrect: true,
        ttsText: "paper",
        imageUrl: "/images/module1/lesson3/paper.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M1_L3_Q10",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the girl, then click the kite.",
    instructionTts: "First click the girl, then click the kite.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Two-step sequence: girl then kite.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Girl",
        isCorrect: true,
        ttsText: "girl",
        imageUrl: "/images/module1/lesson3/girl.png"
      },
      {
        id: "B",
        label: "Kite",
        isCorrect: true,
        ttsText: "kite",
        imageUrl: "/images/module1/lesson3/kite.png"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // =========================
  // MODULE 2 — NUMERACY
  // Lesson 2.1 — Counting (1–10)
  // type: counting
  // =========================
  {
    id: "M2_L1_Q1",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🦋",
    difficulty: "easy",
    options: [
      { id: "A", label: "1", isCorrect: true, ttsText: "one" },
      { id: "B", label: "2", isCorrect: false, ttsText: "two" },
      { id: "C", label: "0", isCorrect: false, ttsText: "zero" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q2",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "✏️✏️",
    difficulty: "easy",
    options: [
      { id: "A", label: "2", isCorrect: true, ttsText: "two" },
      { id: "B", label: "3", isCorrect: false, ttsText: "three" },
      { id: "C", label: "1", isCorrect: false, ttsText: "one" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q3",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🍕🍕🍕",
    difficulty: "easy",
    options: [
      { id: "A", label: "3", isCorrect: true, ttsText: "three" },
      { id: "B", label: "4", isCorrect: false, ttsText: "four" },
      { id: "C", label: "2", isCorrect: false, ttsText: "two" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q4",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🐸🐸🐸🐸",
    difficulty: "easy",
    options: [
      { id: "A", label: "4", isCorrect: true, ttsText: "four" },
      { id: "B", label: "5", isCorrect: false, ttsText: "five" },
      { id: "C", label: "6", isCorrect: false, ttsText: "six" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q5",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "✋",
    difficulty: "easy",
    options: [
      { id: "A", label: "5", isCorrect: true, ttsText: "five" },
      { id: "B", label: "4", isCorrect: false, ttsText: "four" },
      { id: "C", label: "10", isCorrect: false, ttsText: "ten" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q6",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🥚🥚🥚🥚🥚🥚",
    difficulty: "easy",
    options: [
      { id: "A", label: "6", isCorrect: true, ttsText: "six" },
      { id: "B", label: "9", isCorrect: false, ttsText: "nine" },
      { id: "C", label: "5", isCorrect: false, ttsText: "five" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q7",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🐞🐞",
    difficulty: "easy",
    options: [
      { id: "A", label: "2", isCorrect: true, ttsText: "two" },
      { id: "B", label: "1", isCorrect: false, ttsText: "one" },
      { id: "C", label: "3", isCorrect: false, ttsText: "three" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q8",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🍬🍬🍬🍬",
    difficulty: "easy",
    options: [
      { id: "A", label: "4", isCorrect: true, ttsText: "four" },
      { id: "B", label: "2", isCorrect: false, ttsText: "two" },
      { id: "C", label: "6", isCorrect: false, ttsText: "six" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q9",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "📕📕📕",
    difficulty: "easy",
    options: [
      { id: "A", label: "3", isCorrect: true, ttsText: "three" },
      { id: "B", label: "1", isCorrect: false, ttsText: "one" },
      { id: "C", label: "5", isCorrect: false, ttsText: "five" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L1_Q10",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "Count and click the correct number.",
    instructionTts: "Count and click the correct number.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🍌",
    difficulty: "easy",
    options: [
      { id: "A", label: "1", isCorrect: true, ttsText: "one" },
      { id: "B", label: "3", isCorrect: false, ttsText: "three" },
      { id: "C", label: "2", isCorrect: false, ttsText: "two" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // =========================
  // Lesson 2.2 — Visual Addition
  // type: visual_addition
  // =========================
  {
    id: "M2_L2_Q1",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🐶 + 🐶",
    difficulty: "easy",
    options: [
      { id: "A", label: "2", isCorrect: true, ttsText: "two" },
      { id: "B", label: "1", isCorrect: false, ttsText: "one" },
      { id: "C", label: "3", isCorrect: false, ttsText: "three" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q2",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🍦🍦 + 🍦",
    difficulty: "easy",
    options: [
      { id: "A", label: "3", isCorrect: true, ttsText: "three" },
      { id: "B", label: "2", isCorrect: false, ttsText: "two" },
      { id: "C", label: "4", isCorrect: false, ttsText: "four" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q3",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🍎🍎 + 🍎🍎",
    difficulty: "easy",
    options: [
      { id: "A", label: "4", isCorrect: true, ttsText: "four" },
      { id: "B", label: "3", isCorrect: false, ttsText: "three" },
      { id: "C", label: "5", isCorrect: false, ttsText: "five" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q4",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🚗 + 🚗🚗",
    difficulty: "easy",
    options: [
      { id: "A", label: "3", isCorrect: true, ttsText: "three" },
      { id: "B", label: "2", isCorrect: false, ttsText: "two" },
      { id: "C", label: "5", isCorrect: false, ttsText: "five" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q5",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🍪🍪🍪 + 🍪",
    difficulty: "easy",
    options: [
      { id: "A", label: "4", isCorrect: true, ttsText: "four" },
      { id: "B", label: "5", isCorrect: false, ttsText: "five" },
      { id: "C", label: "6", isCorrect: false, ttsText: "six" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q6",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🔵 + 🔵🔵🔵🔵",
    difficulty: "easy",
    options: [
      { id: "A", label: "5", isCorrect: true, ttsText: "five" },
      { id: "B", label: "4", isCorrect: false, ttsText: "four" },
      { id: "C", label: "6", isCorrect: false, ttsText: "six" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q7",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🎈🎈 + 🎈🎈🎈",
    difficulty: "easy",
    options: [
      { id: "A", label: "5", isCorrect: true, ttsText: "five" },
      { id: "B", label: "4", isCorrect: false, ttsText: "four" },
      { id: "C", label: "7", isCorrect: false, ttsText: "seven" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q8",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🐱 + —",
    difficulty: "easy",
    options: [
      { id: "A", label: "1", isCorrect: true, ttsText: "one" },
      { id: "B", label: "0", isCorrect: false, ttsText: "zero" },
      { id: "C", label: "2", isCorrect: false, ttsText: "two" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q9",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "✏️ + ✏️",
    difficulty: "easy",
    options: [
      { id: "A", label: "2", isCorrect: true, ttsText: "two" },
      { id: "B", label: "3", isCorrect: false, ttsText: "three" },
      { id: "C", label: "4", isCorrect: false, ttsText: "four" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L2_Q10",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count and add the pictures. Click the correct answer.",
    instructionTts: "Count and add the pictures. Click the correct answer.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🥪🥪 + 🥪",
    difficulty: "easy",
    options: [
      { id: "A", label: "3", isCorrect: true, ttsText: "three" },
      { id: "B", label: "2", isCorrect: false, ttsText: "two" },
      { id: "C", label: "5", isCorrect: false, ttsText: "five" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // =========================
  // Lesson 2.3 — Patterns & Logic
  // =========================

  // Patterns (type: pattern_completion)
  {
    id: "M2_L3_Q1",
    moduleId: "M2",
    lessonId: "2.3",
    type: "pattern_completion",
    instruction: "Look at the pattern and choose what comes next.",
    instructionTts: "Look at the pattern and choose what comes next.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🟢🟢🔴🟢🟢 → ?",
    difficulty: "easy",
    options: [
      { id: "A", label: "🟢", isCorrect: false, ttsText: "green circle" },
      { id: "B", label: "🔴", isCorrect: true, ttsText: "red circle" },
      { id: "C", label: "⚪", isCorrect: false, ttsText: "white circle" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L3_Q2",
    moduleId: "M2",
    lessonId: "2.3",
    type: "pattern_completion",
    instruction: "Look at the pattern and choose what comes next.",
    instructionTts: "Look at the pattern and choose what comes next.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🔼🔽🔼🔽 → ?",
    difficulty: "easy",
    options: [
      { id: "A", label: "🔼", isCorrect: true, ttsText: "up triangle" },
      { id: "B", label: "🔽", isCorrect: false, ttsText: "down triangle" },
      { id: "C", label: "⬅️", isCorrect: false, ttsText: "left arrow" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L3_Q3",
    moduleId: "M2",
    lessonId: "2.3",
    type: "pattern_completion",
    instruction: "Look at the pattern and choose what comes next.",
    instructionTts: "Look at the pattern and choose what comes next.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🌞☁️🌞☁️ → ?",
    difficulty: "easy",
    options: [
      { id: "A", label: "🌞", isCorrect: true, ttsText: "sun" },
      { id: "B", label: "☁️", isCorrect: false, ttsText: "cloud" },
      { id: "C", label: "🌙", isCorrect: false, ttsText: "moon" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L3_Q4",
    moduleId: "M2",
    lessonId: "2.3",
    type: "pattern_completion",
    instruction: "Look at the pattern and choose what comes next.",
    instructionTts: "Look at the pattern and choose what comes next.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "1 2 1 2 → ?",
    difficulty: "easy",
    options: [
      { id: "A", label: "1", isCorrect: true, ttsText: "one" },
      { id: "B", label: "2", isCorrect: false, ttsText: "two" },
      { id: "C", label: "3", isCorrect: false, ttsText: "three" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L3_Q5",
    moduleId: "M2",
    lessonId: "2.3",
    type: "pattern_completion",
    instruction: "Look at the pattern and choose what comes next.",
    instructionTts: "Look at the pattern and choose what comes next.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "🐶🦴🐶🦴 → ?",
    difficulty: "easy",
    options: [
      { id: "A", label: "🐶", isCorrect: true, ttsText: "dog" },
      { id: "B", label: "🦴", isCorrect: false, ttsText: "bone" },
      { id: "C", label: "🐱", isCorrect: false, ttsText: "cat" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // Comparisons (type: comparison_choice)
  {
    id: "M2_L3_Q6",
    moduleId: "M2",
    lessonId: "2.3",
    type: "comparison_choice",
    instruction: "Which one is heavier?",
    instructionTts: "Which one is heavier?",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Feather vs Rock",
    difficulty: "easy",
    options: [
      { id: "A", label: "Feather", isCorrect: false, ttsText: "feather" },
      { id: "B", label: "Rock", isCorrect: true, ttsText: "rock" },
      { id: "C", label: "(none)", isCorrect: false, ttsText: "none" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L3_Q7",
    moduleId: "M2",
    lessonId: "2.3",
    type: "comparison_choice",
    instruction: "Which one is faster?",
    instructionTts: "Which one is faster?",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Snail vs Rabbit",
    difficulty: "easy",
    options: [
      { id: "A", label: "Snail", isCorrect: false, ttsText: "snail" },
      { id: "B", label: "Rabbit", isCorrect: true, ttsText: "rabbit" },
      { id: "C", label: "(none)", isCorrect: false, ttsText: "none" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L3_Q8",
    moduleId: "M2",
    lessonId: "2.3",
    type: "comparison_choice",
    instruction: "Which one is sweeter?",
    instructionTts: "Which one is sweeter?",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Candy vs Lemon",
    difficulty: "easy",
    options: [
      { id: "A", label: "Candy", isCorrect: true, ttsText: "candy" },
      { id: "B", label: "Lemon", isCorrect: false, ttsText: "lemon" },
      { id: "C", label: "(none)", isCorrect: false, ttsText: "none" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // Logic (type: logic_choice)
  {
    id: "M2_L3_Q9",
    moduleId: "M2",
    lessonId: "2.3",
    type: "logic_choice",
    instruction: "Which one do you wear?",
    instructionTts: "Which one do you wear?",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Wear? Shirt vs Chair",
    difficulty: "easy",
    options: [
      { id: "A", label: "Shirt", isCorrect: true, ttsText: "shirt" },
      { id: "B", label: "Chair", isCorrect: false, ttsText: "chair" },
      { id: "C", label: "(none)", isCorrect: false, ttsText: "none" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M2_L3_Q10",
    moduleId: "M2",
    lessonId: "2.3",
    type: "logic_choice",
    instruction: "Which one is a fruit?",
    instructionTts: "Which one is a fruit?",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Fruit? Apple vs Carrot",
    difficulty: "easy",
    options: [
      { id: "A", label: "Apple", isCorrect: true, ttsText: "apple" },
      { id: "B", label: "Carrot", isCorrect: false, ttsText: "carrot" },
      { id: "C", label: "(none)", isCorrect: false, ttsText: "none" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // =========================
  // MODULE 3 — EXECUTIVE FUNCTION
  // Lesson 3.1 — Sequence Ordering
  // type: sequence_ordering
  // =========================
  {
    id: "M3_L1_Q1",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Bread → Cheese → Eat",
    difficulty: "easy",
    options: [
      { id: "A", label: "Bread", isCorrect: true, ttsText: "bread" },
      { id: "B", label: "Cheese", isCorrect: true, ttsText: "cheese" },
      { id: "C", label: "Eat", isCorrect: true, ttsText: "eat" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q2",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Socks → Shoes → Tie laces",
    difficulty: "easy",
    options: [
      { id: "A", label: "Socks", isCorrect: true, ttsText: "socks" },
      { id: "B", label: "Shoes", isCorrect: true, ttsText: "shoes" },
      { id: "C", label: "Tie laces", isCorrect: true, ttsText: "tie laces" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q3",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Wet hair → Shampoo → Rinse",
    difficulty: "easy",
    options: [
      { id: "A", label: "Wet hair", isCorrect: true, ttsText: "wet hair" },
      { id: "B", label: "Shampoo", isCorrect: true, ttsText: "shampoo" },
      { id: "C", label: "Rinse", isCorrect: true, ttsText: "rinse" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q4",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Look left/right → Walk → Reach other side",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Look left/right",
        isCorrect: true,
        ttsText: "look left and right"
      },
      { id: "B", label: "Walk", isCorrect: true, ttsText: "walk" },
      {
        id: "C",
        label: "Reach other side",
        isCorrect: true,
        ttsText: "reach the other side"
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q5",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Plug in → Wait → Full battery",
    difficulty: "easy",
    options: [
      { id: "A", label: "Plug in", isCorrect: true, ttsText: "plug in" },
      { id: "B", label: "Wait", isCorrect: true, ttsText: "wait" },
      { id: "C", label: "Full battery", isCorrect: true, ttsText: "full battery" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q6",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Write → Stamp → Mail",
    difficulty: "easy",
    options: [
      { id: "A", label: "Write", isCorrect: true, ttsText: "write" },
      { id: "B", label: "Stamp", isCorrect: true, ttsText: "stamp" },
      { id: "C", label: "Mail", isCorrect: true, ttsText: "mail" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q7",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Egg → Caterpillar → Butterfly",
    difficulty: "easy",
    options: [
      { id: "A", label: "Egg", isCorrect: true, ttsText: "egg" },
      { id: "B", label: "Caterpillar", isCorrect: true, ttsText: "caterpillar" },
      { id: "C", label: "Butterfly", isCorrect: true, ttsText: "butterfly" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q8",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Morning → Afternoon → Night",
    difficulty: "easy",
    options: [
      { id: "A", label: "Morning", isCorrect: true, ttsText: "morning" },
      { id: "B", label: "Afternoon", isCorrect: true, ttsText: "afternoon" },
      { id: "C", label: "Night", isCorrect: true, ttsText: "night" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q9",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Pour juice → Drink → Wash glass",
    difficulty: "easy",
    options: [
      { id: "A", label: "Pour juice", isCorrect: true, ttsText: "pour juice" },
      { id: "B", label: "Drink", isCorrect: true, ttsText: "drink" },
      { id: "C", label: "Wash glass", isCorrect: true, ttsText: "wash glass" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L1_Q10",
    moduleId: "M3",
    lessonId: "3.1",
    type: "sequence_ordering",
    instruction: "Click the steps in the correct order.",
    instructionTts: "Click the steps in the correct order.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Dip brush → Paint → Dry",
    difficulty: "easy",
    options: [
      { id: "A", label: "Dip brush", isCorrect: true, ttsText: "dip brush" },
      { id: "B", label: "Paint", isCorrect: true, ttsText: "paint" },
      { id: "C", label: "Dry", isCorrect: true, ttsText: "dry" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // =========================
  // Lesson 3.2 — Focus Tasks (Timer)
  // type: focus_task
  // =========================
  {
    id: "M3_L2_Q1",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the green things.",
    instructionTts: "Click only the green things.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Green things. Distractors: Red, Blue.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Green things", isCorrect: true, ttsText: "green things" },
      { id: "B", label: "Red things", isCorrect: false, ttsText: "red things" },
      { id: "C", label: "Blue things", isCorrect: false, ttsText: "blue things" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q2",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the birds.",
    instructionTts: "Click only the birds.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Birds. Distractors: Dogs, Fish.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Birds", isCorrect: true, ttsText: "birds" },
      { id: "B", label: "Dogs", isCorrect: false, ttsText: "dogs" },
      { id: "C", label: "Fish", isCorrect: false, ttsText: "fish" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q3",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the squares.",
    instructionTts: "Click only the squares.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Squares. Distractors: Circles, Triangles.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Squares", isCorrect: true, ttsText: "squares" },
      { id: "B", label: "Circles", isCorrect: false, ttsText: "circles" },
      { id: "C", label: "Triangles", isCorrect: false, ttsText: "triangles" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q4",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the healthy food.",
    instructionTts: "Click only the healthy food.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Healthy food. Distractors: Junk food.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Healthy food", isCorrect: true, ttsText: "healthy food" },
      { id: "B", label: "Junk food", isCorrect: false, ttsText: "junk food" },
      { id: "C", label: "(other)", isCorrect: false, ttsText: "other" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q5",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the smiling faces.",
    instructionTts: "Click only the smiling faces.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Smiling faces. Distractors: Sad faces.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Smiling faces", isCorrect: true, ttsText: "smiling faces" },
      { id: "B", label: "Sad faces", isCorrect: false, ttsText: "sad faces" },
      { id: "C", label: "(other)", isCorrect: false, ttsText: "other" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q6",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the letters.",
    instructionTts: "Click only the letters.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Letters. Distractors: Numbers.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Letters", isCorrect: true, ttsText: "letters" },
      { id: "B", label: "Numbers", isCorrect: false, ttsText: "numbers" },
      { id: "C", label: "(other)", isCorrect: false, ttsText: "other" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q7",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the winter items.",
    instructionTts: "Click only the winter items.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Winter items. Distractors: Summer items.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Winter items", isCorrect: true, ttsText: "winter items" },
      { id: "B", label: "Summer items", isCorrect: false, ttsText: "summer items" },
      { id: "C", label: "(other)", isCorrect: false, ttsText: "other" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q8",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the toys.",
    instructionTts: "Click only the toys.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Toys. Distractors: Tools.",
    difficulty: "easy",
    options: [
      { id: "A", label: "Toys", isCorrect: true, ttsText: "toys" },
      { id: "B", label: "Tools", isCorrect: false, ttsText: "tools" },
      { id: "C", label: "(other)", isCorrect: false, ttsText: "other" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q9",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the school supplies.",
    instructionTts: "Click only the school supplies.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: School supplies. Distractors: Kitchenware.",
    difficulty: "easy",
    options: [
      { id: "A", label: "School supplies", isCorrect: true, ttsText: "school supplies" },
      { id: "B", label: "Kitchenware", isCorrect: false, ttsText: "kitchenware" },
      { id: "C", label: "(other)", isCorrect: false, ttsText: "other" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },
  {
    id: "M3_L2_Q10",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_task",
    instruction: "Click only the things with wheels.",
    instructionTts: "Click only the things with wheels.",
    stimulusImageUrl: null,
    stimulusImageAlt: null,
    stimulusDescription: "Target: Things with wheels. Distractors: Things without wheels.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Things with wheels",
        isCorrect: true,
        ttsText: "things with wheels"
      },
      {
        id: "B",
        label: "Things without wheels",
        isCorrect: false,
        ttsText: "things without wheels"
      },
      { id: "C", label: "(other)", isCorrect: false, ttsText: "other" }
    ],
    accessibility: {
      recommendedFor: ["ADHD", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: true,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  }
];

/**
 * Get activity by ID
 */
export function getActivityById(id: string): ActivityItem | undefined {
  return exampleActivities.find(activity => activity.id === id);
}

/**
 * Get activities by module and lesson
 */
export function getActivitiesByLesson(moduleId: string, lessonId: string): ActivityItem[] {
  const filtered = exampleActivities.filter(
    activity => activity.moduleId === moduleId && activity.lessonId === lessonId
  );
  console.log(`getActivitiesByLesson(${moduleId}, ${lessonId}): found ${filtered.length} activities`);
  return filtered;
}

/**
 * Get all activities by module
 */
export function getActivitiesByModule(moduleId: string): ActivityItem[] {
  return exampleActivities.filter(activity => activity.moduleId === moduleId);
}

/**
 * Get next activity in sequence for a module
 * Returns the next activity after the given activity ID, or the first activity if no ID provided
 */
export function getNextActivityInSequence(
  moduleId: string, 
  lastActivityId?: string
): ActivityItem | null {
  const moduleActivities = getActivitiesByModule(moduleId);
  if (!moduleActivities || moduleActivities.length === 0) {
    return null;
  }
  
  // Sort by lesson, then by activity ID
  moduleActivities.sort((a, b) => {
    const lessonCompare = parseFloat(a.lessonId) - parseFloat(b.lessonId);
    if (lessonCompare !== 0) return lessonCompare;
    return a.id.localeCompare(b.id);
  });
  
  // If no last activity, return first
  if (!lastActivityId) {
    return moduleActivities[0];
  }
  
  // Find the last activity index
  const lastIndex = moduleActivities.findIndex(a => a.id === lastActivityId);
  if (lastIndex === -1) {
    // Last activity not found, return first
    return moduleActivities[0];
  }
  
  // Return next activity (or null if at end)
  const nextIndex = lastIndex + 1;
  if (nextIndex >= moduleActivities.length) {
    console.log(`End of module ${moduleId} reached`);
    return null; // No more activities
  }
  
  return moduleActivities[nextIndex];
}

