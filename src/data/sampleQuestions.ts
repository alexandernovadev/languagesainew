import { Question } from "../models/Question";

export const sampleQuestions: Question[] = [
  {
    _id: "1",
    text: "What is the correct form of the verb 'to be' in present tense for 'he'?",
    type: "multiple_choice",
    isSingleAnswer: true,
    level: "A1",
    topic: "Present Tense",
    difficulty: 2,
    options: [
      { value: "am", label: "am", isCorrect: false },
      { value: "is", label: "is", isCorrect: true },
      { value: "are", label: "are", isCorrect: false },
      { value: "be", label: "be", isCorrect: false }
    ],
    correctAnswers: ["is"],
    explanation: "The verb 'to be' in present tense for third person singular (he/she/it) is 'is'.",
    tags: ["grammar", "present_tense", "verb_to_be"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    _id: "2",
    text: "Complete the sentence: 'I _____ to the store yesterday.'",
    type: "fill_blank",
    isSingleAnswer: true,
    level: "A2",
    topic: "Past Tense",
    difficulty: 3,
    options: [
      { value: "go", label: "go", isCorrect: false },
      { value: "went", label: "went", isCorrect: true },
      { value: "gone", label: "gone", isCorrect: false },
      { value: "going", label: "going", isCorrect: false }
    ],
    correctAnswers: ["went"],
    explanation: "The past tense of 'go' is 'went'.",
    tags: ["grammar", "past_tense", "irregular_verbs"],
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z"
  },
  {
    _id: "3",
    text: "Translate 'Hello, how are you?' to Spanish.",
    type: "translate",
    isSingleAnswer: false,
    level: "A1",
    topic: "Greetings",
    difficulty: 1,
    correctAnswers: ["Hola, ¿cómo estás?", "Hola, ¿cómo te va?", "Hola, ¿qué tal?"],
    explanation: "There are several ways to say 'Hello, how are you?' in Spanish.",
    tags: ["vocabulary", "greetings", "translation"],
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z"
  },
  {
    _id: "4",
    text: "The capital of France is Paris. True or False?",
    type: "true_false",
    isSingleAnswer: true,
    level: "A1",
    topic: "Geography",
    difficulty: 1,
    options: [
      { value: "true", label: "True", isCorrect: true },
      { value: "false", label: "False", isCorrect: false }
    ],
    correctAnswers: ["true"],
    explanation: "Paris is indeed the capital city of France.",
    tags: ["geography", "culture", "facts"],
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z"
  },
  {
    _id: "5",
    text: "Write a short paragraph (3-4 sentences) about your favorite hobby.",
    type: "writing",
    isSingleAnswer: false,
    level: "B1",
    topic: "Personal Information",
    difficulty: 4,
    correctAnswers: [],
    explanation: "This is a free writing exercise. There are no specific correct answers.",
    tags: ["writing", "personal", "hobbies"],
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z"
  },
  {
    _id: "6",
    text: "Which of the following are correct uses of the present perfect tense?",
    type: "multiple_choice",
    isSingleAnswer: false,
    level: "B2",
    topic: "Present Perfect",
    difficulty: 4,
    options: [
      { value: "I have been to Paris", label: "I have been to Paris", isCorrect: true },
      { value: "I went to Paris yesterday", label: "I went to Paris yesterday", isCorrect: false },
      { value: "I have lived here for 5 years", label: "I have lived here for 5 years", isCorrect: true },
      { value: "I am going to Paris tomorrow", label: "I am going to Paris tomorrow", isCorrect: false }
    ],
    correctAnswers: ["I have been to Paris", "I have lived here for 5 years"],
    explanation: "Present perfect is used for experiences and actions that started in the past and continue to the present.",
    tags: ["grammar", "present_perfect", "tenses"],
    createdAt: "2024-01-06T00:00:00.000Z",
    updatedAt: "2024-01-06T00:00:00.000Z"
  },
  {
    _id: "7",
    text: "Fill in the blanks: 'The weather _____ nice today, but it _____ rain tomorrow.'",
    type: "fill_blank",
    isSingleAnswer: false,
    level: "B1",
    topic: "Weather Vocabulary",
    difficulty: 3,
    options: [
      { value: "is", label: "is", isCorrect: true },
      { value: "will", label: "will", isCorrect: true },
      { value: "was", label: "was", isCorrect: false },
      { value: "going to", label: "going to", isCorrect: false }
    ],
    correctAnswers: ["is", "will"],
    explanation: "We use 'is' for present state and 'will' for future prediction.",
    tags: ["vocabulary", "weather", "future_tense"],
    createdAt: "2024-01-07T00:00:00.000Z",
    updatedAt: "2024-01-07T00:00:00.000Z"
  },
  {
    _id: "8",
    text: "What does the idiom 'break a leg' mean?",
    type: "multiple_choice",
    isSingleAnswer: true,
    level: "C1",
    topic: "Idioms",
    difficulty: 5,
    options: [
      { value: "To actually break your leg", label: "To actually break your leg", isCorrect: false },
      { value: "Good luck", label: "Good luck", isCorrect: true },
      { value: "To work hard", label: "To work hard", isCorrect: false },
      { value: "To be tired", label: "To be tired", isCorrect: false }
    ],
    correctAnswers: ["Good luck"],
    explanation: "'Break a leg' is a theatrical idiom that means 'good luck'.",
    tags: ["idioms", "culture", "theater"],
    createdAt: "2024-01-08T00:00:00.000Z",
    updatedAt: "2024-01-08T00:00:00.000Z"
  }
]; 