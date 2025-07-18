import { Question } from "../models/Question";

export const sampleQuestions: Question[] = [
  {
    _id: "1",
    text: "What is the correct form of the verb 'to be' in the present tense for 'I'?",
    type: "multiple_choice",
    level: "A1",
    difficulty: 1,
    options: [
      { value: "A", label: "am", isCorrect: true },
      { value: "B", label: "is", isCorrect: false },
      { value: "C", label: "are", isCorrect: false },
      { value: "D", label: "be", isCorrect: false },
    ],
    correctAnswers: ["A"],
    explanation: "The correct form of 'to be' for the first person singular (I) is 'am'.",
    tags: ["grammar", "present_tense", "verb_to_be"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    _id: "2",
    text: "Complete the sentence: 'The new operational manual _____ (approve) by Peru last week.'",
    type: "fill_blank",
    level: "B1",
    difficulty: 2,
    options: [
      { value: "A", label: "approved", isCorrect: true },
      { value: "B", label: "has approved", isCorrect: false },
      { value: "C", label: "approves", isCorrect: false },
      { value: "D", label: "will approve", isCorrect: false }
    ],
    correctAnswers: ["A"],
    explanation: "The correct form is 'approved' in passive voice past tense. The sentence uses passive voice structure: subject + was/were + past participle.",
    tags: ["grammar", "passive_voice", "past_tense"],
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z"
  },
  {
    _id: "3",
    text: "Is this sentence grammatically correct: 'I am going to the store yesterday.'",
    type: "true_false",
    level: "A2",
    difficulty: 2,
    options: [
      { value: "A", label: "True", isCorrect: false },
      { value: "B", label: "False", isCorrect: true },
    ],
    correctAnswers: ["B"],
    explanation: "The sentence is incorrect because 'yesterday' indicates past time, but 'am going' is present continuous tense.",
    tags: ["grammar", "past_tense", "present_continuous"],
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z"
  },
  {
    _id: "4",
    text: "Translate the word 'house' to Spanish.",
    type: "translate",
    level: "A1",
    difficulty: 1,
    correctAnswers: ["casa"],
    explanation: "The Spanish translation of 'house' is 'casa'.",
    tags: ["vocabulary", "translation", "basic_words"],
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z"
  },
  {
    _id: "5",
    text: "Write a short paragraph about your daily routine.",
    type: "writing",
    level: "A2",
    difficulty: 2,
    correctAnswers: ["Sample response about daily routine"],
    explanation: "This is a writing exercise to practice describing daily activities in English.",
    tags: ["writing", "daily_routines", "present_tense"],
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z"
  },
  {
    _id: "6",
    text: "Which of the following are irregular verbs?",
    type: "multiple_choice",
    level: "B1",
    difficulty: 3,
    options: [
      { value: "A", label: "go, see, take", isCorrect: true },
      { value: "B", label: "walk, talk, work", isCorrect: false },
      { value: "C", label: "play, study, learn", isCorrect: false },
      { value: "D", label: "help, open, close", isCorrect: false },
    ],
    correctAnswers: ["A"],
    explanation: "Go, see, and take are irregular verbs because they don't follow the regular -ed pattern for past tense.",
    tags: ["grammar", "irregular_verbs", "past_tense"],
    createdAt: "2024-01-06T00:00:00.000Z",
    updatedAt: "2024-01-06T00:00:00.000Z"
  },

  {
    _id: "8",
    text: "Are these sentences grammatically correct: 'I have been to Paris. I have gone to Paris.'",
    type: "true_false",
    level: "B2",
    difficulty: 4,
    options: [
      { value: "A", label: "Both are correct", isCorrect: false },
      { value: "B", label: "Only the first is correct", isCorrect: true },
      { value: "C", label: "Only the second is correct", isCorrect: false },
      { value: "D", label: "Neither is correct", isCorrect: false },
    ],
    correctAnswers: ["B"],
    explanation: "'I have been to Paris' is correct (experience). 'I have gone to Paris' is incorrect in this context.",
    tags: ["grammar", "present_perfect", "been_vs_gone"],
    createdAt: "2024-01-08T00:00:00.000Z",
    updatedAt: "2024-01-08T00:00:00.000Z"
  },
  {
    _id: "9",
    text: "Complete the sentence: 'If it rains tomorrow, I _____ at home.'",
    type: "fill_blank",
    level: "B1",
    difficulty: 2,
    correctAnswers: ["will stay", "stay"],
    explanation: "This is a first conditional sentence. Both 'will stay' and 'stay' are acceptable in this context.",
    tags: ["grammar", "conditionals", "future_tense"],
    createdAt: "2024-01-09T00:00:00.000Z",
    updatedAt: "2024-01-09T00:00:00.000Z"
  },
  {
    _id: "10",
    text: "Complete the sentence: 'I'm going _____ the store.'",
    type: "fill_blank",
    level: "A2",
    difficulty: 2,
    options: [
      { value: "A", label: "to", isCorrect: true },
      { value: "B", label: "at", isCorrect: false },
      { value: "C", label: "in", isCorrect: false },
      { value: "D", label: "on", isCorrect: false }
    ],
    correctAnswers: ["A"],
    explanation: "The correct preposition is 'to' when indicating movement towards a destination.",
    tags: ["grammar", "prepositions", "movement"],
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z"
  },
  {
    _id: "11",
    text: "Translate the phrase 'I would like to' to Spanish.",
    type: "translate",
    level: "A2",
    difficulty: 2,
    correctAnswers: ["me gustaría", "quisiera"],
    explanation: "Both 'me gustaría' and 'quisiera' are correct translations of 'I would like to' in Spanish.",
    tags: ["vocabulary", "translation", "polite_expressions"],
    createdAt: "2024-01-11T00:00:00.000Z",
    updatedAt: "2024-01-11T00:00:00.000Z"
  },
  {
    _id: "10",
    text: "Write a short email to a friend inviting them to a party.",
    type: "writing",
    level: "B1",
    difficulty: 3,
    correctAnswers: ["Sample email invitation"],
    explanation: "This writing exercise helps practice informal email writing and invitation language.",
    tags: ["writing", "email", "invitations", "informal_style"],
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z"
  },
]; 