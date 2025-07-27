import { create } from "zustand";
import { Expression, ChatMessage } from "../../models/Expression";
import { expressionService } from "../../services/expressionService";
import { toast } from "sonner";

interface ExpressionStore {
  expressions: Expression[];
  loading: boolean;
  actionLoading: Record<string, boolean>;
  currentPage: number;
  totalPages: number;
  total: number;
  searchQuery: string;
  filters: Record<string, any>;

  // Actions
  getExpressions: (filters?: any) => Promise<void>;
  createExpression: (data: Partial<Expression>) => Promise<void>;
  updateExpression: (id: string, data: Partial<Expression>) => Promise<void>;
  deleteExpression: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  
  // Chat actions
  addChatMessage: (expressionId: string, message: string) => Promise<void>;
  getChatHistory: (expressionId: string) => Promise<ChatMessage[]>;
  clearChatHistory: (expressionId: string) => Promise<void>;
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

  getExpressions: async (filters = {}) => {
    set({ loading: true });
    try {
      const response = await expressionService.getExpressions({
        page: get().currentPage,
        ...get().filters,
        ...filters,
      });
      
      set({
        expressions: response.data.data,
        total: response.data.total,
        totalPages: response.data.pages,
        loading: false,
      });
    } catch (error: any) {
      console.error("Error fetching expressions:", error);
      toast.error("Error al cargar las expresiones");
      set({ loading: false });
    }
  },

  createExpression: async (data) => {
    set({ actionLoading: { create: true } });
    try {
      await expressionService.createExpression(data);
      toast.success("Expresión creada exitosamente");
      get().getExpressions();
    } catch (error: any) {
      console.error("Error creating expression:", error);
      toast.error("Error al crear la expresión");
    } finally {
      set({ actionLoading: { create: false } });
    }
  },

  updateExpression: async (id, data) => {
    set({ actionLoading: { update: true } });
    try {
      await expressionService.updateExpression(id, data);
      toast.success("Expresión actualizada exitosamente");
      get().getExpressions();
    } catch (error: any) {
      console.error("Error updating expression:", error);
      toast.error("Error al actualizar la expresión");
    } finally {
      set({ actionLoading: { update: false } });
    }
  },

  deleteExpression: async (id) => {
    set({ actionLoading: { delete: true } });
    try {
      await expressionService.deleteExpression(id);
      toast.success("Expresión eliminada exitosamente");
      get().getExpressions();
    } catch (error: any) {
      console.error("Error deleting expression:", error);
      toast.error("Error al eliminar la expresión");
    } finally {
      set({ actionLoading: { delete: false } });
    }
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().getExpressions();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().getExpressions({ expression: query });
  },

  setFilters: (filters) => {
    set({ filters, currentPage: 1 });
    get().getExpressions();
  },

  // Chat methods
  addChatMessage: async (expressionId, message) => {
    set({ actionLoading: { chat: true } });
    try {
      const response = await expressionService.addChatMessage(expressionId, message);
      
      // Update the expression in the store with new chat messages
      const { expressions } = get();
      const updatedExpressions = expressions.map(expr => 
        expr._id === expressionId 
          ? { ...expr, chat: response.data.expression.chat }
          : expr
      );
      
      set({ 
        expressions: updatedExpressions,
        actionLoading: { chat: false }
      });
    } catch (error: any) {
      console.error("Error adding chat message:", error);
      toast.error("Error al enviar el mensaje");
      set({ actionLoading: { chat: false } });
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
    set({ actionLoading: { clearChat: true } });
    try {
      await expressionService.clearChatHistory(expressionId);
      toast.success("Historial del chat limpiado");
      
      // Update the expression in the store
      const { expressions } = get();
      const updatedExpressions = expressions.map(expr => 
        expr._id === expressionId 
          ? { ...expr, chat: [] }
          : expr
      );
      
      set({ 
        expressions: updatedExpressions,
        actionLoading: { clearChat: false }
      });
    } catch (error: any) {
      console.error("Error clearing chat history:", error);
      toast.error("Error al limpiar el historial del chat");
      set({ actionLoading: { clearChat: false } });
    }
  },
})); 