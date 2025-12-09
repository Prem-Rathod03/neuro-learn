/**
 * Example Activity Items following the new schema
 * These can be stored in MongoDB or served from the backend
 */

import { ActivityItem } from '@/types/activity';

export const exampleActivities: ActivityItem[] = [
  // ============================================================================
  // Module 1: Language & Instructions
  // ============================================================================
  
  // Lesson 1.1 - Match Picture to Word (Pig)
  {
    id: "M1_L1_Q1",
    moduleId: "M1",
    lessonId: "1.1",
    type: "image_to_word",
    instruction: "Match the picture to the correct word.",
    instructionTts: "Look at the picture and click the word that matches.",
    stimulusImageUrl: "/images/module1/lesson1/pig.png",
    stimulusImageAlt: "A pink pig standing on grass",
    stimulusDescription: "A pink pig",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Pig",
        isCorrect: true,
        ttsText: "pig"
      },
      {
        id: "B",
        label: "Big",
        isCorrect: false,
        ttsText: "big"
      },
      {
        id: "C",
        label: "Dig",
        isCorrect: false,
        ttsText: "dig"
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

  // Lesson 1.2 - One-Step Instruction (Click the Sad Boy)
  {
    id: "M1_L2_Q1",
    moduleId: "M1",
    lessonId: "1.2",
    type: "one_step_instruction",
    instruction: "Click the sad boy.",
    instructionTts: "Click the sad boy.",
    difficulty: "easy",
    options: [
      {
        id: "A",
        label: "Happy Boy",
        isCorrect: false,
        imageUrl: "/images/module1/lesson2/happy_boy.png",
        imageAlt: "A boy smiling happily",
        ttsText: "Happy boy",
        tags: ["emotion:happy"]
      },
      {
        id: "B",
        label: "Sad Boy",
        isCorrect: true,
        imageUrl: "/images/module1/lesson2/sad_boy.png",
        imageAlt: "A boy with a sad face and tears",
        ttsText: "Sad boy",
        tags: ["emotion:sad", "target"]
      },
      {
        id: "C",
        label: "Excited Boy",
        isCorrect: false,
        imageUrl: "/images/module1/lesson2/excited_boy.png",
        imageAlt: "A boy jumping with excitement",
        ttsText: "Excited boy",
        tags: ["emotion:excited"]
      }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia", "ASD"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // Lesson 1.3 - Two-Step Sequence (Spoon then Fork)
  {
    id: "M1_L3_Q1",
    moduleId: "M1",
    lessonId: "1.3",
    type: "two_step_sequence",
    instruction: "First click the spoon, then click the fork.",
    instructionTts: "First click the spoon, then click the fork.",
    steps: [
      "First click the spoon.",
      "Then click the fork."
    ],
    difficulty: "medium",
    options: [
      {
        id: "spoon",
        label: "Spoon",
        imageUrl: "/images/module1/lesson3/spoon.png",
        imageAlt: "A metal spoon",
        isCorrect: true,
        ttsText: "Spoon"
      },
      {
        id: "fork",
        label: "Fork",
        imageUrl: "/images/module1/lesson3/fork.png",
        imageAlt: "A metal fork",
        isCorrect: true,
        ttsText: "Fork"
      },
      {
        id: "plate",
        label: "Plate",
        imageUrl: "/images/module1/lesson3/plate.png",
        imageAlt: "A white plate",
        isCorrect: false,
        ttsText: "Plate"
      }
    ],
    accessibility: {
      recommendedFor: ["ASD", "ADHD"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // ============================================================================
  // Module 2: Numeracy & Logic
  // ============================================================================

  // Lesson 2.1 - Counting (1 Butterfly)
  {
    id: "M2_L1_Q1",
    moduleId: "M2",
    lessonId: "2.1",
    type: "counting",
    instruction: "How many butterflies do you see?",
    instructionTts: "How many butterflies do you see?",
    stimulusEmoji: "🦋",
    stimulusDescription: "one butterfly",
    difficulty: "easy",
    options: [
      { id: "1", label: "1", isCorrect: true, ttsText: "one" },
      { id: "2", label: "2", isCorrect: false, ttsText: "two" },
      { id: "0", label: "0", isCorrect: false, ttsText: "zero" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia", "ADHD"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // Lesson 2.2 - Visual Addition (3 + 2 = ?)
  {
    id: "M2_L2_Q1",
    moduleId: "M2",
    lessonId: "2.2",
    type: "visual_addition",
    instruction: "Count the apples. How many are there?",
    instructionTts: "Count the apples. How many are there?",
    stimulusImageUrl: "/images/module2/lesson2/apples_5.png",
    stimulusImageAlt: "Three red apples on the left, two green apples on the right",
    stimulusDescription: "Three red apples and two green apples",
    difficulty: "easy",
    options: [
      { id: "3", label: "3", isCorrect: false, ttsText: "three" },
      { id: "5", label: "5", isCorrect: true, ttsText: "five" },
      { id: "6", label: "6", isCorrect: false, ttsText: "six" }
    ],
    accessibility: {
      recommendedFor: ["Dyslexia", "ADHD"],
      enableTtsOnHover: true,
      showProgressBar: false,
      avoidMetaphors: true,
      consistentFeedback: true
    }
  },

  // ============================================================================
  // Module 3: Focus & Sequencing
  // ============================================================================

  // Lesson 3.2 - Focus Filter (Green Things)
  {
    id: "M3_L2_Q1",
    moduleId: "M3",
    lessonId: "3.2",
    type: "focus_filter",
    instruction: "You have 30 seconds. Only click green things.",
    instructionTts: "You have thirty seconds. Only click green things.",
    targetCategory: "Green Things",
    maxTimeSeconds: 30,
    difficulty: "medium",
    options: [
      {
        id: "green_leaf",
        label: "🌿",
        isCorrect: true,
        ttsText: "Green leaf",
        tags: ["green", "target"]
      },
      {
        id: "green_ball",
        label: "🟢",
        isCorrect: true,
        ttsText: "Green circle",
        tags: ["green", "target"]
      },
      {
        id: "red_ball",
        label: "🔴",
        isCorrect: false,
        ttsText: "Red circle",
        tags: ["red", "distractor"]
      },
      {
        id: "blue_ball",
        label: "🔵",
        isCorrect: false,
        ttsText: "Blue circle",
        tags: ["blue", "distractor"]
      }
    ],
    accessibility: {
      recommendedFor: ["ADHD"],
      enableTtsOnHover: false,
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
  return exampleActivities.filter(
    activity => activity.moduleId === moduleId && activity.lessonId === lessonId
  );
}

