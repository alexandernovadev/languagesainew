import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameSession, GameConfig, UserAnswers, CheckedAnswers, InputFields } from "@/pages/games/verbs/types";
import { createGameSession, getVerbsForGame, generateInputFieldsByDifficulty, calculateScore } from "@/pages/games/verbs/utils";
import { DEFAULT_GAME_CONFIG } from "@/pages/games/verbs/data";

interface VerbsGameState {
  config: GameConfig;
  session: GameSession | null;
  verbs: any[];
  setConfig: (config: GameConfig) => void;
  updateConfig: (partial: Partial<GameConfig>) => void;
  resetConfig: () => void;
  startGame: (config?: GameConfig) => void;
  updateAnswers: (userAnswers: UserAnswers) => void;
  updateCheckedAnswers: (checkedAnswers: CheckedAnswers) => void;
  updateInputFields: (inputFields: InputFields) => void;
  setShowAnswers: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
  finishGame: () => void;
  resetSession: () => void;
  clearSession: () => void;
}

export const useVerbsGameStore = create<VerbsGameState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_GAME_CONFIG,
      session: null,
      verbs: [],
      setConfig: (config) => set({ config }),
      updateConfig: (partial) => set((state) => ({ config: { ...state.config, ...partial } })),
      resetConfig: () => set({ config: DEFAULT_GAME_CONFIG }),
      startGame: (config) => {
        const usedConfig = config || get().config;
        const session = createGameSession(usedConfig);
        const verbs = getVerbsForGame(usedConfig);
        const inputFields = generateInputFieldsByDifficulty(verbs, usedConfig.difficulty);
        session.inputFields = inputFields;
        set({ session, verbs, config: usedConfig });
      },
      updateAnswers: (userAnswers) => {
        set((state) => state.session ? { session: { ...state.session, userAnswers } } : {});
      },
      updateCheckedAnswers: (checkedAnswers) => {
        set((state) => state.session ? { session: { ...state.session, checkedAnswers } } : {});
      },
      updateInputFields: (inputFields) => {
        set((state) => state.session ? { session: { ...state.session, inputFields } } : {});
      },
      setShowAnswers: (show) => {
        set((state) => state.session ? { session: { ...state.session, showAnswers: show } } : {});
      },
      setCurrentPage: (page) => {
        set((state) => state.session ? { session: { ...state.session, currentPage: page } } : {});
      },
      finishGame: () => {
        set((state) => {
          if (!state.session) return {};
          const score = calculateScore(state.session.checkedAnswers, Object.keys(state.session.checkedAnswers).length);
          return { session: { ...state.session, completed: true, score } };
        });
      },
      resetSession: () => set({ session: null, verbs: [] }),
      clearSession: () => set({ session: null, verbs: [], config: DEFAULT_GAME_CONFIG }),
    }),
    {
      name: "verbs-game-session",
      partialize: (state) => ({ config: state.config, session: state.session, verbs: state.verbs }),
    }
  )
); 