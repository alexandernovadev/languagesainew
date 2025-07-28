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

  async updateWordLevel(id: string, level: string) {
    const res = await api.put(`/api/words/${id}/level`, { level });
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

  async getRecentHardOrMediumWords() {
    const res = await api.get(`/api/words/get-cards-anki`);
    return res.data;
  },

  // Nuevos métodos para sistema de repaso inteligente
  async getWordsForReview(limit: number = 20) {
    const res = await api.get(`/api/words/get-words-for-review?limit=${limit}`);
    return res.data;
  },

  async updateWordReview(wordId: string, difficulty: number, quality: number) {
    const res = await api.post(`/api/words/${wordId}/update-review`, {
      difficulty,
      quality,
    });
    return res.data;
  },

  async getReviewStats() {
    const res = await api.get(`/api/words/get-review-stats`);
    return res.data;
  },

  async generateWordJSON(prompt: string, language = "en") {
    const res = await api.post(`/api/ai/generate-wordJson`, {
      prompt,
      language,
    });
    return res.data;
  },

  // NUEVO: Método optimizado para WordsSelector
  async getWordsByTypeOptimized(
    type: string,
    limit: number = 10,
    search?: string
  ) {
    const params = new URLSearchParams();
    params.append("type", type);
    params.append("limit", limit.toString());
    params.append("fields", "word"); // Solo traer el campo word

    if (search) {
      params.append("wordUser", search);
    }

    const url = `/api/words/by-type-optimized?${params.toString()}`;
    const res = await api.get(url);
    return res.data.data; // Devolver el array de palabras
  },

  // NUEVO: Método para obtener solo palabras (sin objetos completos)
  async getWordsOnly(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<WordFilters>
  ) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    params.append("fields", "word"); // Solo traer el campo word

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const url = `/api/words/words-only?${params.toString()}`;
    const res = await api.get(url);
    return res.data.data; // Devolver el array de palabras
  },

  async updateWordExamples(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) {
    const res = await api.post(`/api/ai/update-word-examples`, {
      wordId,
      word,
      language,
      oldExamples,
    });
    return res.data;
  },

  async updateWordCodeSwitching(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) {
    const res = await api.post(`/api/ai/update-word-code-switching`, {
      wordId,
      word,
      language,
      oldExamples,
    });
    return res.data;
  },

  async updateWordSynonyms(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) {
    const res = await api.post(`/api/ai/update-word-synonyms`, {
      wordId,
      word,
      language,
      oldExamples,
    });
    return res.data;
  },

  async updateWordTypes(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) {
    const res = await api.post(`/api/ai/update-word-types`, {
      wordId,
      word,
      language,
      oldExamples,
    });
    return res.data;
  },

  async updateWordImage(wordId: string, word: string, imgOld: string = "") {
    const res = await api.post(`/api/ai/update-word-image`, {
      wordId,
      word,
      imgOld,
    });
    return res.data;
  },

  async exportWords() {
    const res = await api.get(`/api/words/export/json`);
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
