export type WordSelectionType = "last10" | "hard10" | "medium10" | "easy10";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IWordChat {
  _id: string;
  userId: string;
  title: string;
  wordIds: string[];
  wordTexts?: string[];
  wordSelectionType: WordSelectionType;
  wordsUsedInConversation: string[];
  messages: IChatMessage[];
  corrections?: Record<string, string>;
  language: string;
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string;
}
