// Language options for exam explanations
export const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' }
];

// Suggested topic categories
export const TOPIC_CATEGORIES = {
  grammar: {
    title: 'Gramática',
    icon: '📚',
    topics: ['Present Simple', 'Past Perfect', 'Conditionals', 'Passive Voice', 'Modal Verbs', 'Phrasal Verbs']
  },
  vocabulary: {
    title: 'Vocabulario',
    icon: '📖',
    topics: ['Business English', 'Travel Vocabulary', 'Food & Cooking', 'Technology Terms', 'Health & Medicine', 'Academic Words']
  },
  skills: {
    title: 'Habilidades',
    icon: '🎯',
    topics: ['Reading Comprehension', 'Listening Skills', 'Writing Essays', 'Speaking Practice', 'Pronunciation', 'Conversation']
  },
  themes: {
    title: 'Temas',
    icon: '🌍',
    topics: ['Daily Life', 'Work & Career', 'Education', 'Environment', 'Culture', 'Entertainment']
  }
};

// Exam generation tips
export const EXAM_GENERATION_TIPS = [
  'Sé específico con el tema (ej: "verbos irregulares en presente" en lugar de "gramática")',
  'Combina diferentes tipos de preguntas para variedad',
  'Ajusta la dificultad según el nivel CEFR seleccionado',
  'Usa entre 10-20 preguntas para un examen equilibrado'
];

// Question type colors for charts and visualizations
export const QUESTION_TYPE_CHART_COLORS = {
  multiple_choice: 'bg-yellow-500',
  fill_blank: 'bg-yellow-500',
  true_false: 'bg-yellow-500',
  translate: 'bg-yellow-500',
  writing: 'bg-yellow-500'
};

// Default exam configuration
export const DEFAULT_EXAM_CONFIG = {
  numberOfQuestions: 10,
  difficulty: 3,
  level: 'B1',
  userLang: 'es',
  types: ['multiple_choice', 'fill_blank', 'true_false']
};

// Validation limits
export const EXAM_VALIDATION_LIMITS = {
  minQuestions: 1,
  maxQuestions: 50,
  minDifficulty: 1,
  maxDifficulty: 5
};

// Progress thresholds for generation
export const PROGRESS_THRESHOLDS = {
  INITIAL: 0,
  ANALYZING: 25,
  GENERATING: 50,
  CREATING: 75,
  FINALIZING: 100
}; 