/**
 * Activity Framework - Consistent structure for all activity types
 * Supports: image, text, emoji, sequence activities
 * Includes TTS/audio support and neurodiversity-specific tweaks
 */

export type ActivityType =
  | "image_to_word"          // Lesson 1.1: Match picture to word
  | "one_step_instruction"   // Lesson 1.2: Single instruction
  | "two_step_sequence"      // Lesson 1.3: Two-step sequence
  | "counting"               // Lesson 2.1: Count objects
  | "visual_addition"        // Lesson 2.2: Visual math
  | "pattern"                // Lesson 2.3: Patterns
  | "comparison"             // Lesson 2.3: Comparisons
  | "logic_choice"           // Lesson 2.3: Logic choices
  | "sequence_ordering"      // Lesson 3.1: Drag & drop sequences
  | "focus_filter";          // Lesson 3.2: Focus tasks (click targets)

export type ModuleId = "M1" | "M2" | "M3";
export type LessonId = "1.1" | "1.2" | "1.3" | "2.1" | "2.2" | "2.3" | "3.1" | "3.2";
export type Difficulty = "easy" | "medium" | "hard";
export type NeuroType = "Dyslexia" | "ADHD" | "ASD";

/**
 * Activity Option - represents a single choice/answer option
 */
export interface ActivityOption {
  id: string;              // "A", "B", "opt1", etc.
  label: string;           // What we show (text or emoji, like "Pig" or "🦋 🦋")
  isCorrect: boolean;      // true/false
  ttsText?: string;        // What TTS should say (plain text)
  imageUrl?: string;       // If option is an image
  imageAlt?: string;       // Description of the image for screen readers/TTS
  tags?: string[];         // e.g. ["target", "distractor", "bird", "green"]
}

/**
 * Accessibility metadata for neurodiversity support
 */
export interface ActivityAccessibility {
  recommendedFor: NeuroType[];
  enableTtsOnHover?: boolean;     // e.g. for Dyslexia word tasks
  showProgressBar?: boolean;      // e.g. for ADHD focus sprint
  avoidMetaphors?: boolean;       // Always true for ASD
  consistentFeedback?: boolean;   // Always true for ASD modules
}

/**
 * Activity Item - Core schema for each question/task
 */
export interface ActivityItem {
  id: string;                 // "M1_L1_Q1"
  moduleId: ModuleId;
  lessonId: LessonId;
  type: ActivityType;

  // What the student sees / hears
  instruction: string;        // Onscreen text: "Click the sad boy."
  instructionTts?: string;    // Spoken version (can be simpler)
  stimulusImageUrl?: string;  // If there is a main picture
  stimulusImageAlt?: string; // What that image means in text
  stimulusEmoji?: string;     // For emoji-only stimuli if needed
  stimulusDescription?: string; // Human-readable: "a pink pig", "three pizzas"

  // For multi-step sequences
  steps?: string[];           // ["First click the Spoon", "then click the Fork"]

  options: ActivityOption[];  // Choices, with correct marking

  // Difficulty & tracking
  difficulty: Difficulty;
  maxTimeSeconds?: number;    // For timed tasks like focus sprint
  targetCategory?: string;    // e.g. "Green Things", "Birds" (for focus tasks)

  // Accessibility / neurodiversity hints for UI
  accessibility: ActivityAccessibility;
}

/**
 * Helper type for backward compatibility with existing Activity interface
 */
export interface Activity {
  activityId: string;
  topic: string;
  difficulty: Difficulty | string;
  modality: "text" | "audio" | "visual" | string;
  question: string;
  passage?: string;
  options?: string[];
}

