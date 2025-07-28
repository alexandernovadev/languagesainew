// Grammar topics available for exam generation
export const GRAMMAR_TOPICS = {
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
  basicGrammar: {
    title: "Gramática Básica",
    icon: "📚",
    topics: [
      "Subject-Verb Agreement",
      "Basic Word Order",
      "Questions (Yes/No Questions)",
      "Questions (Wh-Questions)",
      "Negatives and Negation",
      "There is/There are",
      "Have got/Has got",
      "This/That/These/Those",
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
  basicPrepositions: {
    title: "Preposiciones Básicas",
    icon: "📍",
    topics: [
      "In, On, At (Time)",
      "In, On, At (Place)",
      "In, On, At (Transport)",
      "By, With, From",
      "To, For, Of",
      "Common Prepositional Phrases",
    ],
  },
  prepositions: {
    title: "Preposiciones Avanzadas",
    icon: "🎯",
    topics: [
      "Prepositions of Time",
      "Prepositions of Place",
      "Prepositions of Movement",
      "Prepositions with Verbs",
      "Prepositions with Adjectives",
      "Complex Prepositional Phrases",
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
  vocabulary: {
    title: "Vocabulario y Expresiones",
    icon: "📖",
    topics: [
      "Common Expressions",
      "Idioms and Phrases",
      "Collocations",
      "Phrasal Verbs",
      "Word Formation",
      "Synonyms and Antonyms",
      "Formal vs Informal Language",
      "Academic Vocabulary",
    ],
  },
  communication: {
    title: "Comunicación y Funciones",
    icon: "💬",
    topics: [
      "Making Requests",
      "Giving Advice",
      "Expressing Opinions",
      "Agreeing and Disagreeing",
      "Making Suggestions",
      "Expressing Preferences",
      "Describing People and Things",
      "Talking about the Future",
    ],
  },
  integratedSkills: {
    title: "Habilidades Integradas",
    icon: "🎯",
    topics: [
      "Reading Comprehension",
      "Listening Comprehension",
      "Writing Skills",
      "Speaking Skills",
      "Critical Thinking",
      "Context Clues",
      "Inference Skills",
      "Text Analysis",
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

// Flatten all topics for easier access
export const ALL_GRAMMAR_TOPICS = Object.values(GRAMMAR_TOPICS).flatMap(
  (category) =>
    category.topics.map((topic) => ({
      value: topic,
      label: topic,
      category: category.title,
      icon: category.icon,
    }))
);

// Get topics by category
export const getTopicsByCategory = (categoryKey: string) => {
  return (
    GRAMMAR_TOPICS[categoryKey as keyof typeof GRAMMAR_TOPICS]?.topics || []
  );
};

// Get all category keys
export const getCategoryKeys = () => Object.keys(GRAMMAR_TOPICS);

// Get category info
export const getCategoryInfo = (categoryKey: string) => {
  return GRAMMAR_TOPICS[categoryKey as keyof typeof GRAMMAR_TOPICS];
};
