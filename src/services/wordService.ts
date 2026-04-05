import { HttpClient } from "./api/HttpClient";
import { Word } from "../models/Word";
import { WordFilters } from "@/shared/components/forms/word-filters/types";
import { useUserStore } from "@/lib/store/user-store";

/**
 * Word Service - Extends HttpClient for centralized error handling & logging
 * Provides all word-related API operations
 */
class WordService extends HttpClient {
  constructor() {
    super();
  }

  // ========== CRUD Operations ==========

  /**
   * Get paginated list of words with filters
   */
  async getWords(
    page: number,
    limit: number,
    filters?: Partial<WordFilters>
  ): Promise<any> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const url = `/api/words?${params.toString()}`;
    return this.get(url);
  }

  /**
   * Get word by ID
   */
  async getWordById(id: string): Promise<Word> {
    return this.get(`/api/words/${id}`);
  }

  /**
   * Get word by name (for lookup)
   */
  async getWordByName(word: string): Promise<any> {
    const encoded = encodeURIComponent(word);
    return this.get(`/api/words/${encoded}/word`);
  }

  /**
   * Create new word
   */
  async createWord(wordData: Omit<Word, "_id">): Promise<Word> {
    return this.post("/api/words", wordData);
  }

  /**
   * Update word
   */
  async updateWord(id: string, wordData: Partial<Word>): Promise<Word> {
    return this.put(`/api/words/${id}`, wordData);
  }

  /**
   * Update word difficulty level
   */
  async updateWordDifficulty(id: string, difficulty: string): Promise<any> {
    return this.put(`/api/words/${id}/difficulty`, { difficulty });
  }

  /**
   * Increment word view count
   */
  async incrementWordSeen(id: string): Promise<any> {
    return this.put(`/api/words/${id}/increment-seen`, {});
  }

  /**
   * Delete word
   */
  async deleteWord(id: string): Promise<any> {
    return this.delete(`/api/words/${id}`);
  }

  // ========== Study Methods ==========

  /**
   * Get Anki cards for study
   */
  async getAnkiCards(options: {
    mode?: "random" | "review";
    limit?: number;
    difficulty?: string[];
    type?: string[];
  } = {}): Promise<any> {
    const params = new URLSearchParams();

    if (options.mode) params.append("mode", options.mode);
    params.append(
      "limit",
      (options.limit && options.limit > 0 ? options.limit : 30).toString()
    );

    const difficulty = options.difficulty?.length
      ? options.difficulty
      : ["hard", "medium"];
    params.append("difficulty", difficulty.join(","));

    if (options.type?.length) {
      params.append("type", options.type.join(","));
    }

    const url = `/api/words/anki-cards${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.get(url);
  }

  /**
   * Get words by type (optimized)
   */
  async getWordsByTypeOptimized(options: {
    type: string;
    limit?: number;
    wordUser?: string;
    fields?: string;
  }): Promise<any> {
    const params = new URLSearchParams();

    params.append("type", options.type);
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.wordUser) params.append("wordUser", options.wordUser);
    if (options.fields) params.append("fields", options.fields);

    const url = `/api/words/by-type-optimized?${params.toString()}`;
    return this.get(url);
  }

  // ========== AI Generation Methods ==========

  async generateWord(word: string, language = "en", provider?: string) {
    const body: Record<string, unknown> = { word, language };
    if (provider) body.provider = provider;
    return this.post(`/api/words/generate`, body);
  }

  async generateWordExamples(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[] = [],
    provider?: string
  ) {
    const body: Record<string, unknown> = { word, language, oldExamples };
    if (provider) body.provider = provider;
    return this.post(`/api/words/${wordId}/generate-examples`, body);
  }

  async generateWordCodeSwitching(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[] = [],
    provider?: string
  ) {
    const body: Record<string, unknown> = { word, language, oldExamples };
    if (provider) body.provider = provider;
    return this.post(`/api/words/${wordId}/generate-code-switching`, body);
  }

  async generateWordSynonyms(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[] = [],
    provider?: string
  ) {
    const body: Record<string, unknown> = { word, language, oldExamples };
    if (provider) body.provider = provider;
    return this.post(`/api/words/${wordId}/generate-synonyms`, body);
  }

  async generateWordTypes(
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[] = [],
    provider?: string
  ) {
    const body: Record<string, unknown> = { word, language, oldExamples };
    if (provider) body.provider = provider;
    return this.post(`/api/words/${wordId}/generate-types`, body);
  }

  async generateWordImage(wordId: string, word: string, imgOld: string = "") {
    return this.post(`/api/words/${wordId}/generate-image`, { word, imgOld });
  }

  // ========== Import/Export Methods ==========

  async exportWords() {
    return this.get(`/api/words/export-file`);
  }

  async importWords(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(`/api/words/import-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // ========== Chat Methods ==========

  async addChatMessage(wordId: string, message: string) {
    return this.post(`/api/words/${wordId}/chat`, { message });
  }

  /**
   * Stream chat message (uses native Fetch API for streaming)
   */
  async streamChatMessage(wordId: string, message: string): Promise<ReadableStream<Uint8Array> | null> {
    const baseURL = import.meta.env.VITE_BACK_URL;
    const url = `${baseURL}/api/words/${wordId}/chat/stream`;

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to stream chat message: ${response.status} ${errorText}`
      );
    }

    return response.body;
  }

  async getChatHistory(wordId: string) {
    return this.get(`/api/words/${wordId}/chat`);
  }

  async clearChatHistory(wordId: string) {
    return this.delete(`/api/words/${wordId}/chat`);
  }
}

/**
 * Singleton instance - use this everywhere
 */
export const wordService = new WordService();
