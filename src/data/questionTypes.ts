export const questionTypes = [
  {
    value: "single_choice",
    label: "Selección Única",
    description: "Pregunta con una sola opción correcta"
  },
  {
    value: "multiple_choice",
    label: "Selección Múltiple",
    description: "Pregunta con varias opciones de respuesta"
  },
  {
    value: "fill_blank",
    label: "Completar Espacios",
    description: "Completar espacios en blanco en un texto"
  },
  {
    value: "translate",
    label: "Traducción",
    description: "Traducir palabras o frases"
  },
  {
    value: "true_false",
    label: "Verdadero/Falso",
    description: "Pregunta de verdadero o falso"
  },
  {
    value: "writing",
    label: "Escritura",
    description: "Ejercicio de escritura libre"
  }
];

export const questionLevels = [
  {
    value: "A1",
    label: "A1 - Principiante",
    description: "Nivel básico de principiante"
  },
  {
    value: "A2",
    label: "A2 - Elemental",
    description: "Nivel elemental"
  },
  {
    value: "B1",
    label: "B1 - Intermedio",
    description: "Nivel intermedio"
  },
  {
    value: "B2",
    label: "B2 - Intermedio Alto",
    description: "Nivel intermedio alto"
  },
  {
    value: "C1",
    label: "C1 - Avanzado",
    description: "Nivel avanzado"
  },
  {
    value: "C2",
    label: "C2 - Maestría",
    description: "Nivel de maestría"
  }
];

export const questionDifficulties = [
  {
    value: 1,
    label: "Muy Fácil",
    description: "Nivel de dificultad muy bajo"
  },
  {
    value: 2,
    label: "Fácil",
    description: "Nivel de dificultad bajo"
  },
  {
    value: 3,
    label: "Medio",
    description: "Nivel de dificultad medio"
  },
  {
    value: 4,
    label: "Difícil",
    description: "Nivel de dificultad alto"
  },
  {
    value: 5,
    label: "Muy Difícil",
    description: "Nivel de dificultad muy alto"
  }
];

export const commonTopics = [
  // Tiempos Verbales
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
  
  // Verbos Modales
  "Modal Verbs (Can, Could, May, Might)",
  "Modal Verbs (Must, Should, Ought To)",
  "Modal Verbs (Will, Would, Shall)",
  "Modal Perfect (Must Have, Should Have)",
  "Modal Continuous (Must Be, Should Be)",
  
  // Condicionales
  "Zero Conditional",
  "First Conditional",
  "Second Conditional",
  "Third Conditional",
  "Mixed Conditionals",
  
  // Voz Pasiva
  "Passive Voice - Present",
  "Passive Voice - Past",
  "Passive Voice - Future",
  "Passive Voice - Perfect Tenses",
  "Passive Voice - Modal Verbs",
  
  // Estilo Indirecto
  "Reported Speech - Statements",
  "Reported Speech - Questions",
  "Reported Speech - Commands",
  "Reported Speech - Time Expressions",
  
  // Artículos
  "Definite Article (The)",
  "Indefinite Articles (A/An)",
  "Zero Article",
  "Articles with Countable/Uncountable",
  
  // Sustantivos
  "Countable and Uncountable Nouns",
  "Plural Forms",
  "Possessive Nouns",
  "Compound Nouns",
  "Collective Nouns",
  
  // Pronombres
  "Personal Pronouns",
  "Possessive Pronouns",
  "Reflexive Pronouns",
  "Demonstrative Pronouns",
  "Indefinite Pronouns",
  "Relative Pronouns",
  "Interrogative Pronouns",
  
  // Adjetivos
  "Comparative Adjectives",
  "Superlative Adjectives",
  "Adjective Order",
  "Participial Adjectives",
  "Compound Adjectives",
  
  // Adverbios
  "Adverbs of Frequency",
  "Adverbs of Manner",
  "Adverbs of Time",
  "Adverbs of Place",
  "Adverbs of Degree",
  "Comparative and Superlative Adverbs",
  
  // Preposiciones
  "Prepositions of Time",
  "Prepositions of Place",
  "Prepositions of Movement",
  "Prepositions with Verbs",
  "Prepositions with Adjectives",
  
  // Conjunciones
  "Coordinating Conjunctions",
  "Subordinating Conjunctions",
  "Correlative Conjunctions",
  "Conjunctive Adverbs",
  
  // Verbos
  "Regular Verbs",
  "Irregular Verbs",
  "Phrasal Verbs",
  "Gerunds and Infinitives",
  "Participles (Present/Past)",
  "Causative Verbs (Have/Get/Make)",
  
  // Estructuras Especiales
  "Inversion",
  "Cleft Sentences",
  "Emphatic Structures",
  "Ellipsis",
  "Substitution",
  
  // Preguntas
  "Yes/No Questions",
  "Wh-Questions",
  "Tag Questions",
  "Indirect Questions",
  
  // Negación
  "Negative Forms",
  "Double Negatives",
  "Negative Questions",
  
  // Conectores y Transiciones
  "Linking Words",
  "Transitional Phrases",
  "Discourse Markers",
  
  // Puntuación
  "Commas",
  "Semicolons and Colons",
  "Apostrophes",
  "Quotation Marks",
  
  // Estructuras Avanzadas
  "Inverted Conditionals",
  "Reduced Relative Clauses",
  "Non-finite Clauses",
  "Absolute Phrases",
  "Appositives"
];

export const commonTags = [
  "grammar",
  "vocabulary",
  "pronunciation",
  "reading",
  "listening",
  "writing",
  "speaking",
  "culture",
  "business",
  "travel",
  "technology",
  "health",
  "education",
  "entertainment",
  "sports",
  "cooking",
  "family",
  "work",
  "hobbies",
  "weather",
  "present_tense",
  "past_tense",
  "future_tense",
  "irregular_verbs",
  "phrasal_verbs",
  "idioms",
  "collocations",
  "prepositions",
  "articles",
  "adjectives",
  "adverbs",
  "conjunctions",
  "conditionals",
  "passive_voice",
  "reported_speech",
  "modal_verbs"
]; 