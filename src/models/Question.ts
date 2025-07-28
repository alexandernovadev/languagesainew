export interface QuestionOption {
  value: string;
  label: string;
  isCorrect: boolean;
}

export interface QuestionMedia {
  audio?: string;
  image?: string;
  video?: string;
}

export interface Question {
  _id: string;
  text: string;
  type:
    | "single_choice"
    | "multiple_choice"
    | "fill_blank"
    | "translate"
    | "true_false"
    | "writing";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  topic?: string;
  difficulty: number; // 1-5
  options?: QuestionOption[];
  correctAnswers: string[];
  explanation?: string;
  tags?: string[];
  media?: QuestionMedia;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionInput {
  text: string;
  type:
    | "single_choice"
    | "multiple_choice"
    | "fill_blank"
    | "translate"
    | "true_false"
    | "writing";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  topic?: string;
  difficulty: number; // 1-5
  options?: QuestionOption[];
  correctAnswers: string[];
  explanation?: string;
  tags?: string[];
  media?: QuestionMedia;
}

export interface QuestionFilters {
  level?: string;
  type?: string;
  topic?: string;
  tags?: string;
  difficulty?: string;
  hasMedia?: string;
  sortBy?: "createdAt" | "updatedAt" | "text" | "level" | "type" | "difficulty";
  sortOrder?: "asc" | "desc";
  createdAfter?: string;
  createdBefore?: string;
}

export interface QuestionStats {
  total: number;
  byLevel: Record<string, number>;
  byType: Record<string, number>;
  withMedia: number;
}
