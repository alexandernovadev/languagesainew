import { create } from "zustand";
import { Expression, ChatMessage } from "../../models/Expression";
import { expressionService } from "../../services/expressionService";
import { toast } from "sonner";

interface ExpressionStore {
  // State
  expressions: Expression[];
  loading: boolean;
  actionLoading: {
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    generate?: boolean;
  };
  currentPage: number;
  totalPages: number;
  total: number;
  searchQuery: string;
  filters: any;

  // Generated expression state
  generatedExpression: Expression | null;
  isGenerating: boolean;

  // Actions
  getExpressions: (filters?: any) => Promise<void>;
  createExpression: (data: Partial<Expression>) => Promise<void>;
  updateExpression: (id: string, data: Partial<Expression>) => Promise<void>;
  deleteExpression: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: any) => void;

  // Chat actions
  addChatMessage: (expressionId: string, message: string) => Promise<void>;
  streamChatMessage: (expressionId: string, message: string, onChunk?: (chunk: string) => void) => Promise<void>;
  getChatHistory: (expressionId: string) => Promise<ChatMessage[]>;
  clearChatHistory: (expressionId: string) => Promise<void>;

  // AI Generation actions
  generateExpression: (prompt: string, options?: any) => Promise<Expression | null>;
  clearGeneratedExpression: () => void;
}

export const useExpressionStore = create<ExpressionStore>((set, get) => ({
  expressions: [],
  loading: false,
  actionLoading: {},
  currentPage: 1,
  totalPages: 1,
  total: 0,
  searchQuery: "",
  filters: {},
  generatedExpression: null,
  isGenerating: false,

  getExpressions: async (filters = {}) => {
    set({ loading: true });
    try {
      const response = await expressionService.getExpressions(filters);
      set({
        expressions: response.data.data,
        total: response.data.total,
        totalPages: response.data.pages,
        currentPage: response.data.page,
      });
    } catch (error: any) {
      console.error("Error fetching expressions:", error);
      toast.error("Error al cargar las expresiones");
    } finally {
      set({ loading: false });
    }
  },

  createExpression: async (data) => {
    set({ actionLoading: { ...get().actionLoading, create: true } });
    try {
      const response = await expressionService.createExpression(data);
      set({
        expressions: [response.data, ...get().expressions],
        actionLoading: { ...get().actionLoading, create: false },
      });
      toast.success("Expresión creada exitosamente");
    } catch (error: any) {
      console.error("Error creating expression:", error);
      toast.error("Error al crear la expresión");
      set({ actionLoading: { ...get().actionLoading, create: false } });
    }
  },

  updateExpression: async (id, data) => {
    set({ actionLoading: { ...get().actionLoading, update: true } });
    try {
      const response = await expressionService.updateExpression(id, data);
      set({
        expressions: get().expressions.map((expr) =>
          expr._id === id ? response.data : expr
        ),
        actionLoading: { ...get().actionLoading, update: false },
      });
      toast.success("Expresión actualizada exitosamente");
    } catch (error: any) {
      console.error("Error updating expression:", error);
      toast.error("Error al actualizar la expresión");
      set({ actionLoading: { ...get().actionLoading, update: false } });
    }
  },

  deleteExpression: async (id) => {
    set({ actionLoading: { ...get().actionLoading, delete: true } });
    try {
      await expressionService.deleteExpression(id);
      set({
        expressions: get().expressions.filter((expr) => expr._id !== id),
        actionLoading: { ...get().actionLoading, delete: false },
      });
      toast.success("Expresión eliminada exitosamente");
    } catch (error: any) {
      console.error("Error deleting expression:", error);
      toast.error("Error al eliminar la expresión");
      set({ actionLoading: { ...get().actionLoading, delete: false } });
    }
  },

  setPage: (page) => {
    set({ currentPage: page });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setFilters: (filters) => {
    set({ filters });
  },

  addChatMessage: async (expressionId, message) => {
    try {
      const response = await expressionService.addChatMessage(expressionId, message);
      set({
        expressions: get().expressions.map((expr) =>
          expr._id === expressionId ? response.data.expression : expr
        ),
      });
    } catch (error: any) {
      console.error("Error adding chat message:", error);
      toast.error("Error al enviar el mensaje");
    }
  },

  streamChatMessage: async (expressionId, message, onChunk) => {
    try {
      const stream = await expressionService.streamChatMessage(expressionId, message);
      
      if (!stream) {
        throw new Error('No stream received');
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        if (onChunk) {
          onChunk(chunk);
        }
      }
    } catch (error: any) {
      console.error("Error streaming chat message:", error);
      toast.error("Error al enviar el mensaje");
      throw error;
    }
  },

  getChatHistory: async (expressionId) => {
    try {
      const response = await expressionService.getChatHistory(expressionId);
      return response.data;
    } catch (error: any) {
      console.error("Error getting chat history:", error);
      toast.error("Error al cargar el historial del chat");
      return [];
    }
  },

  clearChatHistory: async (expressionId) => {
    try {
      await expressionService.clearChatHistory(expressionId);
      set({
        expressions: get().expressions.map((expr) =>
          expr._id === expressionId ? { ...expr, chat: [] } : expr
        ),
      });
      toast.success("Chat limpiado exitosamente");
    } catch (error: any) {
      console.error("Error clearing chat history:", error);
      toast.error("Error al limpiar el chat");
    }
  },

  generateExpression: async (prompt, options = {}) => {
    set({ isGenerating: true });
    try {
      const response = await expressionService.generateExpression(prompt, options);
      
      if (response.data.success) {
        const generatedExpression = response.data.data;
        set({ 
          generatedExpression,
          isGenerating: false 
        });
        toast.success("Expresión generada exitosamente");
        return generatedExpression;
      } else {
        throw new Error("Error en la generación");
      }
    } catch (error: any) {
      console.error("Error generating expression:", error);
      toast.error("Error al generar la expresión");
      set({ isGenerating: false });
      return null;
    }
  },

  clearGeneratedExpression: () => {
    set({ generatedExpression: null });
  },
})); 