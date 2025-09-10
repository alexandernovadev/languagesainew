import { api } from "./api";
import { Expression } from "../models/Expression";
import { useUserStore } from "@/lib/store/user-store";

export const expressionService = {
  // Get expressions with filters
  getExpressions: (filters?: any) =>
    api.get("/api/expressions", { params: filters }),

  // Get expression by ID
  getExpressionById: (id: string) => api.get(`/api/expressions/${id}`),

  // Create expression
  createExpression: (data: Partial<Expression>) =>
    api.post("/api/expressions", data),

  // Update expression
  updateExpression: (id: string, data: Partial<Expression>) =>
    api.put(`/api/expressions/${id}`, data),

  // Delete expression
  deleteExpression: (id: string) => api.delete(`/api/expressions/${id}`),

  // Get expressions by type
  getExpressionsByType: (type: string, limit?: number, search?: string) =>
    api.get(`/api/expressions/by-type/${type}`, {
      params: { limit, search },
    }),

  // Get expressions only (for performance)
  getExpressionsOnly: (filters?: any) =>
    api.get("/api/expressions/expressions-only", { params: filters }),

  // Export expressions
  exportExpressions: () => api.get("/api/expressions/export-file"),

  // Import expressions
  importExpressions: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/expressions/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Chat methods
  addChatMessage: (expressionId: string, message: string) =>
    api.post(`/api/expressions/${expressionId}/chat`, { message }),

  streamChatMessage: async (expressionId: string, message: string) => {
    const baseURL = import.meta.env.VITE_BACK_URL;
    const url = `${baseURL}/api/expressions/${expressionId}/chat/stream`;

    console.log("🔄 Streaming to:", url);

    // Get auth headers without Content-Type for streaming
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

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Stream error:", response.status, errorText);
      throw new Error(
        `Failed to stream chat message: ${response.status} ${errorText}`
      );
    }

    return response.body;
  },

  getChatHistory: (expressionId: string) =>
    api.get(`/api/expressions/${expressionId}/chat`),

  clearChatHistory: (expressionId: string) =>
    api.delete(`/api/expressions/${expressionId}/chat`),

  generateExpression: (
    prompt: string,
    language?: string,
    options?: any
  ) => {
    const body: any = { prompt };
    if (language) body.language = language;
    body.options = options || { provider: "openai" };
    return api.post("/api/expressions/generate", body);
  },

  // Generate AI image for an expression and update its img
  updateExpressionImage: (
    expressionId: string,
    expression: string,
    imgOld: string = ""
  ) =>
    api.post(`/api/expressions/${expressionId}/generate-image`, {
      expressionString: expression,
      imgOld,
    }),
};
