import { api } from "./api";
import { Expression, ChatMessage } from "../models/Expression";

export const expressionService = {
  // Get expressions with filters
  getExpressions: (filters?: any) => 
    api.get("/api/expressions", { params: filters }),

  // Get expression by ID
  getExpressionById: (id: string) => 
    api.get(`/api/expressions/${id}`),

  // Create expression
  createExpression: (data: Partial<Expression>) => 
    api.post("/api/expressions", data),

  // Update expression
  updateExpression: (id: string, data: Partial<Expression>) => 
    api.put(`/api/expressions/${id}`, data),

  // Delete expression
  deleteExpression: (id: string) => 
    api.delete(`/api/expressions/${id}`),

  // Get expressions by type
  getExpressionsByType: (type: string, limit?: number, search?: string) => 
    api.get(`/api/expressions/by-type/${type}`, { 
      params: { limit, search } 
    }),

  // Get expressions only (for performance)
  getExpressionsOnly: (filters?: any) => 
    api.get("/api/expressions/expressions-only", { params: filters }),

  // Export expressions
  exportExpressions: () => 
    api.get("/api/expressions/export/json"),

  // Import expressions
  importExpressions: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/expressions/import/json", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Chat methods
  addChatMessage: (expressionId: string, message: string) => 
    api.post(`/api/expressions/${expressionId}/chat`, { message }),

  getChatHistory: (expressionId: string) => 
    api.get(`/api/expressions/${expressionId}/chat`),

  clearChatHistory: (expressionId: string) => 
    api.delete(`/api/expressions/${expressionId}/chat`),
}; 