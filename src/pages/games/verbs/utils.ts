import { Verb, VerbField, InputFields, GameConfig, GameSession } from "./types";
import { irregularVerbs } from "./data";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function getRandomField(): VerbField {
  const fields: VerbField[] = ["infinitive", "past", "participle"];
  return fields[Math.floor(Math.random() * fields.length)];
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

// Date formatting utilities
export function formatDateToSpanish(date: Date): string {
  const formattedDate = format(date, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  return capitalizeFirstLetter(formattedDate);
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Game statistics utilities
export function calculateGameDuration(startTime: Date | string): number {
  const startDate =
    typeof startTime === "string" ? new Date(startTime) : startTime;
  return Math.round((new Date().getTime() - startDate.getTime()) / 1000 / 60);
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600 bg-green-50 dark:bg-green-950";
  if (score >= 70) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950";
  if (score >= 50) return "text-orange-600 bg-orange-50 dark:bg-orange-950";
  return "text-red-600 bg-red-50 dark:bg-red-950";
}

export function getScoreIcon(score: number): string {
  if (score >= 90) return "🏆";
  if (score >= 70) return "⭐";
  if (score >= 50) return "📈";
  return "📚";
}

export function getScoreMessage(score: number): string {
  if (score >= 90) return "¡Excelente! Eres un maestro de los verbos";
  if (score >= 70) return "¡Muy bien! Sigues mejorando";
  if (score >= 50) return "¡Buen trabajo! Sigue practicando";
  return "¡No te rindas! La práctica hace al maestro";
}
