// Shared static content for modules, activities, and badges.
export const modules = [
  {
    id: 'module-1',
    title: 'Understanding Instructions',
    description: 'Learn to follow and understand different types of instructions',
    icon: '📋',
    color: 'primary',
    progress: 40,
    activitiesCompleted: 4,
    totalActivities: 10,
  },
  {
    id: 'module-2',
    title: 'Basic Numbers & Logic',
    description: 'Practice counting, patterns, and simple problem solving',
    icon: '🔢',
    color: 'success',
    progress: 20,
    activitiesCompleted: 2,
    totalActivities: 10,
  },
  {
    id: 'module-3',
    title: 'Focus & Routine Skills',
    description: 'Build concentration and develop helpful daily routines',
    icon: '🎯',
    color: 'accent',
    progress: 60,
    activitiesCompleted: 6,
    totalActivities: 10,
  },
];

export const activities = [
  {
    id: 'activity-1-1',
    moduleId: 'module-1',
    title: 'Match the Word',
    instruction: 'Look at the picture and choose the word that matches',
    questionNumber: 1,
    totalQuestions: 5,
    type: 'multiple-choice',
    options: ['Apple', 'Banana', 'Orange', 'Grape'],
    correctAnswer: 0,
  },
  {
    id: 'activity-1-2',
    moduleId: 'module-1',
    title: 'Match the Word',
    instruction: 'Look at the picture and choose the word that matches',
    questionNumber: 2,
    totalQuestions: 5,
    type: 'multiple-choice',
    options: ['Cat', 'Dog', 'Bird', 'Fish'],
    correctAnswer: 1,
  },
  {
    id: 'activity-2-1',
    moduleId: 'module-2',
    title: 'Count the Objects',
    instruction: 'How many stars do you see?',
    questionNumber: 1,
    totalQuestions: 5,
    type: 'multiple-choice',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
  },
  {
    id: 'activity-2-2',
    moduleId: 'module-2',
    title: 'Complete the Pattern',
    instruction: 'Which shape comes next in the pattern?',
    questionNumber: 2,
    totalQuestions: 5,
    type: 'multiple-choice',
    options: ['Circle', 'Square', 'Triangle', 'Star'],
    correctAnswer: 0,
  },
  {
    id: 'activity-3-1',
    moduleId: 'module-3',
    title: 'Daily Routine Order',
    instruction: 'What do you do first in the morning?',
    questionNumber: 1,
    totalQuestions: 5,
    type: 'multiple-choice',
    options: ['Eat breakfast', 'Wake up', 'Go to school', 'Brush teeth'],
    correctAnswer: 1,
  },
  {
    id: 'activity-3-2',
    moduleId: 'module-3',
    title: 'Focus Challenge',
    instruction: 'Find the item that is different',
    questionNumber: 2,
    totalQuestions: 5,
    type: 'multiple-choice',
    options: ['Red circle', 'Red circle', 'Blue circle', 'Red circle'],
    correctAnswer: 2,
  },
];

export const badges = [
  {
    id: 'badge-1',
    title: 'First Steps',
    description: 'Complete your first activity',
    icon: '👟',
    earned: true,
  },
  {
    id: 'badge-2',
    title: 'Quick Learner',
    description: 'Complete 5 activities in one day',
    icon: '⚡',
    earned: true,
  },
  {
    id: 'badge-3',
    title: 'Focus Master',
    description: 'Complete all Focus & Routine activities',
    icon: '🎯',
    earned: false,
  },
  {
    id: 'badge-4',
    title: 'Number Ninja',
    description: 'Get perfect score in Numbers & Logic',
    icon: '🥷',
    earned: false,
  },
  {
    id: 'badge-5',
    title: 'Instruction Expert',
    description: 'Complete all Understanding Instructions activities',
    icon: '📚',
    earned: false,
  },
  {
    id: 'badge-6',
    title: 'Star Student',
    description: 'Earn 50 stars',
    icon: '⭐',
    earned: false,
  },
];

export const computeStars = () => {
  return modules.reduce((acc, module) => acc + module.activitiesCompleted * 3, 0);
};



