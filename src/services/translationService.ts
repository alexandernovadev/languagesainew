import { api } from "./api";

// Types
export interface TranslationConfig {
  minWords?: number;
  maxWords?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  sourceLanguage?: 'spanish' | 'english' | 'portuguese';
  targetLanguage?: 'spanish' | 'english' | 'portuguese';
  mustUseWords?: string[];
  grammarTopics?: string[];
  topic?: string;
}

export interface TranslationChat {
  id: string;
  name: string;
  userId: string;
  config?: TranslationConfig;
  lastActivity: string;
  createdAt: string;
  messageCount: number;
  lastScore?: number;
}

export interface GeneratedText {
  id: string;
  text: string;
  config: TranslationConfig;
  wordCount: number;
  createdAt: string;
}

export interface TranslationAnalysis {
  score: number;
  correctTranslation: string;
  feedback: string;
  errors: Array<{
    type: 'grammar' | 'vocabulary' | 'structure' | 'spelling';
    message: string;
    severity: 'minor' | 'moderate' | 'major';
  }>;
}

export interface PreloadedConfigs {
  userWords: {
    nouns: any[];
    verbs: any[];
    adjectives: any[];
    adverbs: any[];
    others: any[];
  };
  recentWords: any[];
  grammarTopics: Array<{
    id: string;
    name: string;
    description: string;
    difficulty: string;
    icon: string;
  }>;
  defaultConfigs: {
    minWords: number;
    maxWords: number;
    difficulties: string[];
    languages: string[];
    topics: string[];
    translationModes: Array<{
      id: string;
      sourceLanguage: string;
      targetLanguage: string;
      label: string;
    }>;
  };
}

export const translationService = {
  async getConfigs(): Promise<PreloadedConfigs> {
    const res = await api.get('/api/translation/configs');
    return res.data;
  },

  async analyzeTranslation(data: {
    originalText: string;
    userTranslation: string;
    textId?: string;
    chatId?: string;
    sourceLanguage?: string;
    targetLanguage?: string;
  }): Promise<TranslationAnalysis> {
    const res = await api.post('/api/translation/translate', data);
    return res.data;
  },

  async getChats(): Promise<TranslationChat[]> {
    const res = await api.get('/api/translation/chats');
    return res.data;
  },

  async createChat(): Promise<TranslationChat> {
    const res = await api.post('/api/translation/chat');
    return res.data;
  },

  async getChatDetails(chatId: string) {
    const res = await api.get(`/api/translation/chat/${chatId}`);
    return res.data;
  },

  async deleteChat(chatId: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/api/translation/chat/${chatId}`);
    return res.data;
  },

  // Streaming request with fetch (following project pattern)
  async generateTextStream(
    config: TranslationConfig, 
    onChunk: (chunk: string, textId: string) => void,
    chatId?: string,
    textId?: string
  ): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_BACK_URL}/api/translation/generate-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('user-storage')
          ? { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-storage') || '{}').state?.token}` }
          : {}),
      },
      body: JSON.stringify({ config, chatId }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate text');
    }

    if (!response.body) {
      throw new Error('No response body for text generation stream');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value || new Uint8Array(), { stream: true });
      if (chunkValue) onChunk(chunkValue, textId || '');
    }
  }
};
