import { Word } from "../models/Word";
import { getAuthHeaders } from "./utils/headers";
import { api } from "./api";

export const wordService = {
  async getWords(page: number, limit: number, wordUser?: string) {
    const url = `/api/words?page=${page}&limit=${limit}${
      wordUser ? `&wordUser=${wordUser}` : ""
    }`;
    const res = await api.get(url, { headers: getAuthHeaders() });
    return res.data;
  },

  async getWordById(id: string) {
    const res = await api.get(`/api/words/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  async getWordByName(word: string) {
    const res = await api.get(`/api/words/word/${word}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async createWord(wordData: Omit<Word, "_id">) {
    const res = await api.post(`/api/words`, wordData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async updateWord(id: string, wordData: Partial<Word>) {
    const res = await api.put(`/api/words/${id}`, wordData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async updateWordLevel(id: string, level: string) {
    const res = await api.put(
      `/api/words/${id}/level`,
      { level },
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },

  async incrementWordSeen(id: string) {
    const res = await api.put(
      `/api/words/${id}/increment-seen`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },

  async deleteWord(id: string) {
    const res = await api.delete(`/api/words/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async getRecentHardOrMediumWords() {
    const res = await api.get(`/api/words/get-cards-anki`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async generateWordJSON(prompt: string, language = "en") {
    const res = await api.post(
      `/api/ai/generate-wordJson`,
      { prompt, language },
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },

  // AI Methods for updating word content
  async updateWordExamples(wordId: string, word: string, language: string, oldExamples: string[]) {
    const res = await api.put(
      `/api/ai/generate-word-examples/${wordId}`,
      { word, language, oldExamples },
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },

  async updateWordCodeSwitching(wordId: string, word: string, language: string, oldExamples: string[]) {
    const res = await api.put(
      `/api/ai/generate-code-switching/${wordId}`,
      { word, language, oldExamples },
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },

  async updateWordSynonyms(wordId: string, word: string, language: string, oldExamples: string[]) {
    const res = await api.put(
      `/api/ai/generate-code-synonyms/${wordId}`,
      { word, language, oldExamples },
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },

  async updateWordTypes(wordId: string, word: string, language: string, oldExamples: string[]) {
    const res = await api.put(
      `/api/ai/generate-word-wordtypes/${wordId}`,
      { word, language, oldExamples },
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },

  async updateWordImage(wordId: string, word: string, imgOld: string = "") {
    const res = await api.post(
      `/api/ai/generate-image/${wordId}`,
      { word, imgOld },
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },
};
