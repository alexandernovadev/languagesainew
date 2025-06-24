import { Verb, VerbField, InputFields, GameConfig, GameSession } from "./types";
import { irregularVerbs } from "./data";

export function getRandomField(): VerbField {
  const fields: VerbField[] = ["infinitive", "past", "participle"];
  return fields[Math.floor(Math.random() * fields.length)];
}

export function generateInputFields(verbs: Verb[]): InputFields {
  const fields: InputFields = {};
  verbs.forEach((verb) => {
    fields[verb.id] = getRandomField();
  });
  return fields;
}

export function checkAnswer(
  userAnswer: string | undefined,
  correctAnswer: string,
  field: VerbField
): boolean {
  return userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase();
}

// Game configuration utilities
export function getVerbsForGame(config: GameConfig): Verb[] {
  let selectedVerbs = [...irregularVerbs];
  
  // Shuffle if requested
  if (config.shuffle) {
    selectedVerbs = shuffleArray(selectedVerbs);
  }
  
  // Limit total verbs
  if (config.totalVerbs < irregularVerbs.length) {
    selectedVerbs = selectedVerbs.slice(0, config.totalVerbs);
  }
  
  return selectedVerbs;
}

export function generateInputFieldsByDifficulty(
  verbs: Verb[],
  difficulty: GameConfig["difficulty"]
): InputFields {
  const fields: InputFields = {};
  
  verbs.forEach((verb) => {
    switch (difficulty) {
      case "easy":
        fields[verb.id] = "infinitive";
        break;
      case "medium":
        fields[verb.id] = Math.random() < 0.5 ? "infinitive" : "past";
        break;
      case "hard":
        fields[verb.id] = getRandomField();
        break;
    }
  });
  
  return fields;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Session management
export function createGameSession(config: GameConfig): GameSession {
  return {
    id: generateSessionId(),
    config,
    startTime: new Date(),
    currentPage: 1,
    userAnswers: {},
    checkedAnswers: {},
    inputFields: {},
    showAnswers: false,
    completed: false,
  };
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateScore(
  checkedAnswers: { [key: number]: boolean },
  totalAnswers: number
): number {
  const correctAnswers = Object.values(checkedAnswers).filter(Boolean).length;
  return Math.round((correctAnswers / totalAnswers) * 100);
}

// Local storage utilities
export function saveGameSession(session: GameSession): void {
  try {
    localStorage.setItem(`verbs_game_session_${session.id}`, JSON.stringify(session));
  } catch (error) {
    console.error("Error saving game session:", error);
  }
}

export function loadGameSession(sessionId: string): GameSession | null {
  try {
    const saved = localStorage.getItem(`verbs_game_session_${sessionId}`);
    if (saved) {
      const session = JSON.parse(saved);
      // Convert string dates back to Date objects
      session.startTime = new Date(session.startTime);
      if (session.lastPlayed) {
        session.lastPlayed = new Date(session.lastPlayed);
      }
      return session;
    }
  } catch (error) {
    console.error("Error loading game session:", error);
  }
  return null;
}

export function getActiveGameSession(): GameSession | null {
  try {
    const keys = Object.keys(localStorage);
    const sessionKeys = keys.filter(key => key.startsWith('verbs_game_session_'));
    
    for (const key of sessionKeys) {
      const session = loadGameSession(key.replace('verbs_game_session_', ''));
      if (session && !session.completed) {
        return session;
      }
    }
  } catch (error) {
    console.error("Error getting active game session:", error);
  }
  return null;
}

export function clearGameSession(sessionId: string): void {
  try {
    localStorage.removeItem(`verbs_game_session_${sessionId}`);
  } catch (error) {
    console.error("Error clearing game session:", error);
  }
}
