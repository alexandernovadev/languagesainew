import { create } from 'zustand';
import { toast } from 'sonner';
import {
  translationService,
  type TranslationConfig,
  type PreloadedConfigs,
  type TranslationChat,
} from '@/services/translationService';

export interface Message {
  id: string;
  type: "generated_text" | "user_translation" | "ai_feedback";
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface TranslationTrainerState {
  configs: PreloadedConfigs | null;
  configsLoading: boolean;

  chats: TranslationChat[];
  chatsLoading: boolean;
  activeChat: string | null;

  generatedText: string;
  generatedTextId: string;
  textGenerationLoading: boolean;
  currentGenerationConfig: TranslationConfig | null;

  messages: Message[];
}

interface TranslationTrainerActions {
  loadConfigs: () => Promise<void>;

  loadChats: () => Promise<void>;
  createChat: () => Promise<string | undefined>;
  setActiveChat: (chatId: string | null) => void;
  deleteChat: (chatId: string) => Promise<void>;
  
  generateText: (newConfig: TranslationConfig, chatId?: string) => Promise<void>;
  clearGeneratedText: () => void;

  addMessage: (message: Message) => void;
  loadChatMessages: (chatId: string) => Promise<void>;
  clearMessages: () => void;
  setGeneratedTextAndId: (text: string, id: string, config: TranslationConfig | null) => void;
  setCurrentGenerationConfig: (config: TranslationConfig | null) => void;
  updateChatConfig: (chatId: string, config: TranslationConfig) => Promise<void>;
}

type TranslationTrainerStore = TranslationTrainerState & TranslationTrainerActions;

export const useTranslationTrainerStore = create<TranslationTrainerStore>((set, get) => ({
  configs: null,
  configsLoading: false,
  chats: [],
  chatsLoading: false,
  activeChat: null,
  generatedText: '',
  generatedTextId: '',
  textGenerationLoading: false,
  currentGenerationConfig: null,
  messages: [],

  loadConfigs: async () => {
    set({ configsLoading: true });
    try {
      const result = await translationService.getConfigs();
      set({ configs: result.data });
      toast.success('Configuration loaded successfully');
    } catch (error: any) {
      toast.error(`Failed to load configs: ${error.message || 'Unknown error'}`);
      set({ configs: null });
    } finally {
      set({ configsLoading: false });
    }
  },

  loadChats: async () => {
    set({ chatsLoading: true });
    try {
      const result = await translationService.getChats();
      set({ chats: Array.isArray(result) ? result : [] });
    } catch (error: any) {
      toast.error(`Failed to load chats: ${error.message || 'Unknown error'}`);
      set({ chats: [] });
    } finally {
      set({ chatsLoading: false });
    }
  },

  createChat: async () => {
    try {
      const newChat = await translationService.createChat();
      set((state) => ({ chats: [newChat, ...state.chats], activeChat: newChat.id }));
      toast.success('New chat created');
      get().clearGeneratedText(); // Clear generated text for the new chat
      return newChat.id;
    } catch (error: any) {
      toast.error(`Failed to create chat: ${error.message || 'Unknown error'}`);
    }
  },

  setActiveChat: (chatId) => {
    set({ activeChat: chatId });
    get().clearGeneratedText();
    get().loadChatMessages(chatId || '');
  },

  deleteChat: async (chatId) => {
    try {
      await translationService.deleteChat(chatId);
      set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chatId),
        activeChat: state.activeChat === chatId ? null : state.activeChat,
      }));
      toast.success('Chat deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete chat: ${error.message || 'Unknown error'}`);
    }
  },

  generateText: async (newConfig, chatId) => {
    set({ textGenerationLoading: true, generatedText: '', generatedTextId: '', currentGenerationConfig: newConfig });
    try {
      const newTextId = `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      set({ generatedTextId: newTextId });

      await translationService.generateTextStream(newConfig, (chunk, receivedTextId) => {
        set((state) => ({ generatedText: state.generatedText + chunk }));
        if (receivedTextId) {
          set({ generatedTextId: receivedTextId });
        }
      }, chatId, newTextId);

      toast.success('Text generated successfully');

      // After successful generation, update the chat's config in the backend
      if (chatId) {
        get().updateChatConfig(chatId, newConfig);
      }

    } catch (error: any) {
      toast.error(`Failed to generate text: ${error.message || 'Unknown error'}`);
    } finally {
      set({ textGenerationLoading: false });
    }
  },

  clearGeneratedText: () => {
    set({ generatedText: '', generatedTextId: '', currentGenerationConfig: null });
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  loadChatMessages: async (chatId) => {
    set({ messages: [] }); // Clear messages when loading a new chat
    if (!chatId) return;

    try {
      const chatDetails = await translationService.getChatDetails(chatId);
      if (chatDetails && chatDetails.messages) {
        set({ messages: chatDetails.messages });

        // Set currentGenerationConfig from chatDetails if available
        if (chatDetails.config) {
          get().setCurrentGenerationConfig(chatDetails.config);
        } else {
          get().setCurrentGenerationConfig(null); // Clear if no config in chat
        }

        // Find the latest generated text and update store state
        const latestGeneratedText = chatDetails.messages
          .filter((msg: Message) => msg.type === "generated_text")
          .sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        if (latestGeneratedText) {
          set({
            generatedText: latestGeneratedText.content,
            generatedTextId: latestGeneratedText.id,
            currentGenerationConfig: latestGeneratedText.metadata?.config || null,
          });
        } else {
          // If no generated text found, clear current generated text state
          get().clearGeneratedText();
        }

      } else {
        set({ messages: [] });
        get().clearGeneratedText(); // Also clear if no messages
      }
    } catch (error: any) {
      toast.error(`Failed to load chat messages: ${error.message || 'Unknown error'}`);
      set({ messages: [] });
      get().clearGeneratedText(); // Clear on error too
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setGeneratedTextAndId: (text, id, config) => {
    set({
      generatedText: text,
      generatedTextId: id,
      currentGenerationConfig: config,
    });
  },

  setCurrentGenerationConfig: (config) => {
    set({ currentGenerationConfig: config });
  },

  updateChatConfig: async (chatId, config) => {
    try {
      await translationService.updateChatConfig(chatId, config);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, config } : chat
        ),
      }));
      toast.success('Chat configuration updated');
    } catch (error: any) {
      toast.error(`Failed to update chat config: ${error.message || 'Unknown error'}`);
    }
  },
}));
