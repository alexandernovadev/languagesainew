export interface Expression {
  _id: string;
  expression: string;
  definition: string;
  examples?: string[];
  type?: string[];
  context?: string;
  difficulty?: "easy" | "medium" | "hard";
  img?: string;
  language: string;
  spanish?: {
    definition: string;
    expression: string;
  };
  chat?: ChatMessage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
