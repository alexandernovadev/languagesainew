import { Word } from "../models/Word";
import { handleResponse } from "./utils/handleResponse";
import { getAuthHeaders } from "./utils/headers";
import { api } from './api';

export const wordService = {
  getWords: async (page: number, limit: number, wordUser?: string) => {
    const url = `/api/words?page=${page}&limit=${limit}${
      wordUser ? `&wordUser=${wordUser}` : ""
    }`;
    const { data } = await api.get(url);
    return handleResponse(data);
  },

  getWordById: async (id: string) => {
    const response = await api.get(`/api/words/${id}`);
    return handleResponse(response.data);
  },

  getWordByName: async (word: string) => {
    const response = await api.get(`/api/words/word/${word}`);
    return handleResponse(response.data);
  },

  createWord: async (wordData: Omit<Word, "_id">) => {
    const response = await api.post(`/api/words`, wordData, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response.data);
  },

  updateWord: async (id: string, wordData: Partial<Word>) => {
    const response = await api.put(`/api/words/${id}`, wordData, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response.data);
  },

  updateWordLevel: async (id: string, level: string) => {
    const response = await api.put(`/api/words/${id}/level`, { level }, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response.data);
  },

  incrementWordSeen: async (id: string) => {
    const response = await api.put(`/api/words/${id}/increment-seen`, {}, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response.data);
  },

  deleteWord: async (id: string) => {
    const response = await api.delete(`/api/words/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response.data);
  },

  getRecentHardOrMediumWords: async () => {
    const response = await api.get(`/api/words/get-cards-anki`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response.data);
  },

  generateWordJSON: async (prompt: string, language = "en") => {
    const response = await api.post(`/api/ai/generate-wordJson`, { prompt, language }, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response.data);
  },
};
