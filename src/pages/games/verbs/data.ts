import verbsData from "@/lib/data/verbsPaticiple.json";
import { Verb, GameConfig } from "./types";

export const irregularVerbs: Verb[] = verbsData.map((verb, idx) => ({
  id: idx + 1,
  infinitive: verb["Verb"],
  past: verb["Past"],
  participle: verb["Past Participle (PP)"],
  meaning: verb["Spanish"],
}));

export const ITEMS_PER_PAGE = 7;

// Default game configuration
export const DEFAULT_GAME_CONFIG: GameConfig = {
  shuffle: false,
  itemsPerPage: 7,
  totalVerbs: 50,
  difficulty: "medium",
  timeLimit: undefined,
};

// Available configuration options
export const GAME_CONFIG_OPTIONS = {
  itemsPerPage: [5, 7, 10, 15],
  totalVerbs: [25, 50, 75, 100, irregularVerbs.length],
  difficulty: [
    { value: "easy", label: "Fácil", description: "Solo infinitivos" },
    { value: "medium", label: "Medio", description: "Infinitivos y pasados" },
    { value: "hard", label: "Difícil", description: "Todos los campos" },
  ],
  timeLimit: [
    { value: undefined, label: "Sin límite" },
    { value: 5, label: "5 minutos" },
    { value: 10, label: "10 minutos" },
    { value: 15, label: "15 minutos" },
  ],
} as const;
