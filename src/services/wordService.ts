import { Word } from "../models/Word";
import { api } from "./api";
import { WordFilters } from "@/components/forms/word-filters/types";
import { useUserStore } from "@/lib/store/user-store";

export const wordService = {
  async getWords(page: number, limit: number, filters?: Partial<WordFilters>) {
    // Construir query params
    const params = new URLSearchParams();

    // Parámetros básicos
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    // Agregar filtros si existen
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const url = `/api/words?${params.toString()}`;
    const res = await api.get(url);
    return res.data;
  },

  async getWordById(id: string) {
    const res = await api.get(`/api/words/${id}`);
    return res.data;
  },

  async getWordByName(word: string) {
    const res = await api.get(`/api/words/${word}/word`);
    return res.data;
  },

  async createWord(wordData: Omit<Word, "_id">) {
    const res = await api.post(`/api/words`, wordData);
    return res.data;
  },

  async updateWord(id: string, wordData: Partial<Word>) {
    const res = await api.put(`/api/words/${id}`, wordData);
    return res.data;
  },

  // Renamed and updated
  async updateWordDifficulty(id: string, difficulty: string) {
    const res = await api.put(`/api/words/${id}/difficulty`, { difficulty });
    return res.data;
  },

  async incrementWordSeen(id: string) {
    const res = await api.put(`/api/words/${id}/increment-seen`, {});
    return res.data;
  },

  async deleteWord(id: string) {
    const res = await api.delete(`/api/words/${id}`);
    return res.data;
  },

  // Método unificado para obtener tarjetas Anki
  async getAnkiCards(options: {
    mode?: 'random' | 'review';
    limit?: number;
    difficulty?: string[];
  } = {}) {
    const params = new URLSearchParams();
    
    if (options.mode) params.append('mode', options.mode);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.difficulty) params.append('difficulty', options.difficulty.join(','));

    const url = `/api/words/anki-cards${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await api.get(url);
    return res.data;
  },

  // --- AI Generation methods (updated) ---
  async generateWord(word: string, language = "en", provider = "openai") {
    const res = await api.post(`/api/words/generate`, { word, language, provider });
    return res.data;
  },
  async generateWordExamples(wordId: string, word: string, language: string, oldExamples: string[] = [], provider = "openai") {
    const res = await api.post(`/api/words/${wordId}/generate-examples`, { word, language, oldExamples, provider });
    return res.data;
  },
  async generateWordCodeSwitching(wordId: string, word: string, language: string, oldExamples: string[] = [], provider = "openai") {
    const res = await api.post(`/api/words/${wordId}/generate-code-switching`, { word, language, oldExamples, provider });
    return res.data;
  },
  async generateWordSynonyms(wordId: string, word: string, language: string, oldExamples: string[] = [], provider = "openai") {
    const res = await api.post(`/api/words/${wordId}/generate-synonyms`, { word, language, oldExamples, provider });
    return res.data;
  },
  async generateWordTypes(wordId: string, word: string, language: string, oldExamples: string[] = [], provider = "openai") {
    const res = await api.post(`/api/words/${wordId}/generate-types`, { word, language, oldExamples, provider });
    return res.data;
  },
  async generateWordImage(wordId: string, word: string, imgOld: string = "") {
    const res = await api.post(`/api/words/${wordId}/generate-image`, { word, imgOld });
    return res.data;
  },
  // --- END AI Generation ---

  async exportWords() {
    const res = await api.get(`/api/words/export-file`);
    return res.data;
  },

  async importWords(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/api/words/import-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Chat methods
  addChatMessage: (wordId: string, message: string) =>
    api.post(`/api/words/${wordId}/chat`, { message }),

  streamChatMessage: async (wordId: string, message: string) => {
    const baseURL = import.meta.env.VITE_BACK_URL;
    const url = `${baseURL}/api/words/${wordId}/chat/stream`;

    console.log("🔄 Streaming to:", url);

    // Get auth headers without Content-Type for streaming
    const authToken = useUserStore.getState().token;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Stream error:", response.status, errorText);
      throw new Error(
        `Failed to stream chat message: ${response.status} ${errorText}`
      );
    }

    return response.body;
  },

  getChatHistory: (wordId: string) => api.get(`/api/words/${wordId}/chat`),

  clearChatHistory: (wordId: string) => api.delete(`/api/words/${wordId}/chat`),
};
