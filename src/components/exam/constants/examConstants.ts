// Language options for exam explanations
export const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
];

// Suggested topic categories - 100% Grammar focused
export const TOPIC_CATEGORIES = {
  verbTenses: {
    title: "Tiempos Verbales",
    icon: "⏰",
    topics: [
      "Present Simple",
      "Present Continuous",
      "Present Perfect",
      "Present Perfect Continuous",
      "Past Simple",
      "Past Continuous",
      "Past Perfect",
      "Past Perfect Continuous",
      "Future Simple (Will)",
      "Future with Going To",
      "Future Continuous",
      "Future Perfect",
      "Future Perfect Continuous",
    ],
  },
  modals: {
    title: "Verbos Modales",
    icon: "🔧",
    topics: [
      "Modal Verbs (Can, Could, May, Might)",
      "Modal Verbs (Must, Should, Ought To)",
      "Modal Verbs (Will, Would, Shall)",
      "Modal Perfect (Must Have, Should Have)",
      "Modal Continuous (Must Be, Should Be)",
    ],
  },
  conditionals: {
    title: "Condicionales",
    icon: "🔄",
    topics: [
      "Zero Conditional",
      "First Conditional",
      "Second Conditional",
      "Third Conditional",
      "Mixed Conditionals",
    ],
  },
  passiveVoice: {
    title: "Voz Pasiva",
    icon: "📝",
    topics: [
      "Passive Voice - Present",
      "Passive Voice - Past",
      "Passive Voice - Future",
      "Passive Voice - Perfect Tenses",
      "Passive Voice - Modal Verbs",
    ],
  },
  reportedSpeech: {
    title: "Estilo Indirecto",
    icon: "💬",
    topics: [
      "Reported Speech - Statements",
      "Reported Speech - Questions",
      "Reported Speech - Commands",
      "Reported Speech - Time Expressions",
    ],
  },
  articles: {
    title: "Artículos",
    icon: "📰",
    topics: [
      "Definite Article (The)",
      "Indefinite Articles (A/An)",
      "Zero Article",
      "Articles with Countable/Uncountable",
    ],
  },
  nouns: {
    title: "Sustantivos",
    icon: "🏷️",
    topics: [
      "Countable and Uncountable Nouns",
      "Plural Forms",
      "Possessive Nouns",
      "Compound Nouns",
      "Collective Nouns",
    ],
  },
  pronouns: {
    title: "Pronombres",
    icon: "👤",
    topics: [
      "Personal Pronouns",
      "Possessive Pronouns",
      "Reflexive Pronouns",
      "Demonstrative Pronouns",
      "Indefinite Pronouns",
      "Relative Pronouns",
      "Interrogative Pronouns",
    ],
  },
  adjectives: {
    title: "Adjetivos",
    icon: "🎨",
    topics: [
      "Comparative Adjectives",
      "Superlative Adjectives",
      "Adjective Order",
      "Participial Adjectives",
      "Compound Adjectives",
    ],
  },
  adverbs: {
    title: "Adverbios",
    icon: "⚡",
    topics: [
      "Adverbs of Frequency",
      "Adverbs of Manner",
      "Adverbs of Time",
      "Adverbs of Place",
      "Adverbs of Degree",
      "Comparative and Superlative Adverbs",
    ],
  },
  prepositions: {
    title: "Preposiciones",
    icon: "📍",
    topics: [
      "Prepositions of Time",
      "Prepositions of Place",
      "Prepositions of Movement",
      "Prepositions with Verbs",
      "Prepositions with Adjectives",
    ],
  },
  conjunctions: {
    title: "Conjunciones",
    icon: "🔗",
    topics: [
      "Coordinating Conjunctions",
      "Subordinating Conjunctions",
      "Correlative Conjunctions",
      "Conjunctive Adverbs",
    ],
  },
  verbs: {
    title: "Verbos",
    icon: "🏃",
    topics: [
      "Regular Verbs",
      "Irregular Verbs",
      "Phrasal Verbs",
      "Gerunds and Infinitives",
      "Participles (Present/Past)",
      "Causative Verbs (Have/Get/Make)",
    ],
  },
  advancedStructures: {
    title: "Estructuras Avanzadas",
    icon: "🧠",
    topics: [
      "Inversion",
      "Cleft Sentences",
      "Emphatic Structures",
      "Ellipsis",
      "Substitution",
      "Inverted Conditionals",
      "Reduced Relative Clauses",
      "Non-finite Clauses",
      "Absolute Phrases",
      "Appositives",
    ],
  },
};

// Exam generation tips
export const EXAM_GENERATION_TIPS = [
  'Sé específico con el tema (ej: "viajes de negocios" en lugar de "trabajo")',
  "Selecciona 3-5 temas de gramática para una distribución equilibrada",
  "Combina diferentes tipos de preguntas para variedad y evaluación completa",
  "Ajusta la dificultad según el nivel CEFR seleccionado",
  "Usa entre 10-20 preguntas para un examen equilibrado",
  "Los temas de gramática se incluirán obligatoriamente en el examen",
  "El tema principal determina el contexto, la gramática define las estructuras",
  "Para exámenes avanzados, selecciona temas de gramática más complejos",
];

// Question type colors for charts and visualizations
export const QUESTION_TYPE_CHART_COLORS = {
  multiple_choice: "bg-yellow-500",
  fill_blank: "bg-yellow-500",
  true_false: "bg-yellow-500",
  translate: "bg-yellow-500",
  writing: "bg-yellow-500",
};

// Default exam configuration
export const DEFAULT_EXAM_CONFIG = {
  numberOfQuestions: 10,
  difficulty: 3,
  level: "B1",
  userLang: "es",
  types: ["multiple_choice", "fill_blank", "true_false"],
};

// Validation limits
export const EXAM_VALIDATION_LIMITS = {
  minQuestions: 1,
  maxQuestions: 50,
  minDifficulty: 1,
  maxDifficulty: 5,
  maxGrammarTopics: 10,
};

// Progress thresholds for generation
export const PROGRESS_THRESHOLDS = {
  INITIAL: 0,
  ANALYZING: 25,
  GENERATING: 50,
  CREATING: 75,
  FINALIZING: 100,
};
