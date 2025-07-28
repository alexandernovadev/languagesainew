export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Word {
  _id: string;
  word: string;
  definition: string;
  examples?: string[];
  type?: string[];
  IPA?: string;
  seen?: number;
  img?: string;
  level?: "easy" | "medium" | "hard";
  sinonyms?: string[];
  codeSwitching?: string[];
  language: string;
  spanish?: {
    definition: string;
    word: string;
  };
  chat?: ChatMessage[];
  createdAt?: string;
  updatedAt?: string;
  // Campos para sistema de repaso inteligente
  lastReviewed?: string;
  nextReview?: string;
  reviewCount?: number;
  difficulty?: number; // 1-5, donde 1 es muy fácil y 5 es muy difícil
  interval?: number; // Intervalo en días para el próximo repaso
  easeFactor?: number; // Factor de facilidad (similar a Anki)
}
