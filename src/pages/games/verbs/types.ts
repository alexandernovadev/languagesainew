export interface Verb {
  id: number;
  infinitive: string;
  past: string;
  participle: string;
  meaning: string;
}

export type VerbField = "infinitive" | "past" | "participle";

export interface UserAnswers {
  [key: number]: { infinitive?: string; past?: string; participle?: string };
}

export interface CheckedAnswers {
  [key: number]: boolean;
}

export interface InputFields {
  [key: number]: VerbField;
}

// Game configuration types
export interface GameConfig {
  shuffle: boolean;
  itemsPerPage: number;
  totalVerbs: number;
  difficulty: "easy" | "medium" | "hard";
  timeLimit?: number; // in minutes, optional
}

export interface GameSession {
  id: string;
  config: GameConfig;
  startTime: Date;
  currentPage: number;
  userAnswers: UserAnswers;
  checkedAnswers: CheckedAnswers;
  inputFields: InputFields;
  showAnswers: boolean;
  completed: boolean;
  score?: number;
}
