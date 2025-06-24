import { Word } from "../models/Word";
import { getAuthHeaders } from "@/utils/services";
import { api } from "./api";

export const wordService = {
  async getWords(page: number, limit: number, wordUser?: string) {
    try {
      const url = `/api/words?page=${page}&limit=${limit}${
        wordUser ? `&wordUser=${wordUser}` : ""
      }`;
      const res = await api.get(url, { headers: getAuthHeaders() });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getWordById(id: string) {
    try {
      const res = await api.get(`/api/words/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getWordByName(word: string) {
    try {
      const res = await api.get(`/api/words/word/${word}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async createWord(wordData: Omit<Word, "_id">) {
    try {
      const res = await api.post(`/api/words`, wordData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateWord(id: string, wordData: Partial<Word>) {
    try {
      const res = await api.put(`/api/words/${id}`, wordData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateWordLevel(id: string, level: string) {
    try {
      const res = await api.put(
        `/api/words/${id}/level`,
        { level },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async incrementWordSeen(id: string) {
    try {
      const res = await api.put(
        `/api/words/${id}/increment-seen`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async deleteWord(id: string) {
    try {
      const res = await api.delete(`/api/words/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getRecentHardOrMediumWords() {
    try {
      const res = await api.get(`/api/words/get-cards-anki`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async generateWordJSON(prompt: string, language = "en") {
    try {
      const res = await api.post(
        `/api/ai/generate-wordJson`,
        { prompt, language },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  // AI Methods for updating word content
  async updateWordExamples(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    try {
      const res = await api.put(
        `/api/ai/generate-word-examples/${wordId}`,
        { word, language, oldExamples },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateWordCodeSwitching(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    try {
      const res = await api.put(
        `/api/ai/generate-code-switching/${wordId}`,
        { word, language, oldExamples },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateWordSynonyms(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    try {
      const res = await api.put(
        `/api/ai/generate-code-synonyms/${wordId}`,
        { word, language, oldExamples },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateWordTypes(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) {
    try {
      const res = await api.put(
        `/api/ai/generate-word-wordtypes/${wordId}`,
        { word, language, oldExamples },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateWordImage(wordId: string, word: string, imgOld: string = "") {
    try {
      const res = await api.post(
        `/api/ai/generate-image/${wordId}`,
        { word, imgOld },
        {
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async exportWords() {
    try {
      const res = await api.get(`/api/words/export-json`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },
};
