import { Word } from "../models/Word";
import { api } from "./api";
import { WordFilters } from "@/components/forms/word-filters/types";

export const wordService = {
  async getWords(page: number, limit: number, filters?: Partial<WordFilters>) {
    // Construir query params
    const params = new URLSearchParams();
    
    // Parámetros básicos
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Agregar filtros si existen
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
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
    const res = await api.put(
      `/api/words/${id}/level`,
      { level }
    );
    return res.data;
  },

  async incrementWordSeen(id: string) {
    const res = await api.put(
      `/api/words/${id}/increment-seen`,
      {}
    );
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
      quality
    });
    return res.data;
  },

  async getReviewStats() {
    const res = await api.get(`/api/words/get-review-stats`);
    return res.data;
  },

  async generateWordJSON(prompt: string, language = "en") {
    const res = await api.post(
      `/api/ai/generate-wordJson`,
      { prompt, language }
    );
    return res.data;
  },

  async importWords(file: File, duplicateStrategy: string, batchSize: number, validateOnly: boolean) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("duplicateStrategy", duplicateStrategy);
    formData.append("batchSize", batchSize.toString());
    formData.append("validateOnly", validateOnly.toString());

    const res = await api.post(`/api/words/import-json`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  async updateWordExamples(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    const res = await api.put(
      `/api/ai/update-word-examples`,
      { wordId, word, language, oldExamples }
    );
    return res.data;
  },

  async updateWordCodeSwitching(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    const res = await api.put(
      `/api/ai/update-word-code-switching`,
      { wordId, word, language, oldExamples }
    );
    return res.data;
  },

  async updateWordSynonyms(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    const res = await api.put(
      `/api/ai/update-word-synonyms`,
      { wordId, word, language, oldExamples }
    );
    return res.data;
  },

  async updateWordTypes(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    const res = await api.put(
      `/api/ai/update-word-types`,
      { wordId, word, language, oldExamples }
    );
    return res.data;
  },

  async updateWordImage(wordId: string, word: string, imgOld: string = "") {
    const res = await api.post(
      `/api/ai/generate-image/${wordId}`,
      { word, imgOld }
    );
    return res.data;
  },

  async exportWords() {
    const res = await api.get(`/api/words/export-json`);
    return res.data;
  },
};
