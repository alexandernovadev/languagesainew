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
  createdAt?: string;
  updatedAt?: string;
}
