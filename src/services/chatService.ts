import { api } from "./api";
import type { IWordChat, WordSelectionType } from "@/types/models/Chat";

export const chatService = {
  async list(page = 1, limit = 20) {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    const res = await api.get(`/api/chats?${params.toString()}`);
    const data = res.data?.data ?? res.data;
    return data as { data: IWordChat[]; total: number; page: number; pages: number };
  },

  async create(wordSelectionType: WordSelectionType, language = "en") {
    const res = await api.post("/api/chats", { wordSelectionType, language });
    return res.data?.data ?? res.data as IWordChat;
  },

  async getById(id: string) {
    const res = await api.get(`/api/chats/${id}`);
    return res.data?.data ?? res.data as IWordChat;
  },

  async addMessage(id: string, content: string) {
    const res = await api.post(`/api/chats/${id}/messages`, { content });
    return res.data?.data ?? res.data as IWordChat;
  },

  async requestCorrection(id: string, messageIndex: number) {
    const res = await api.post(`/api/chats/${id}/correct`, { messageIndex });
    return res.data?.data ?? res.data as IWordChat;
  },

  async delete(id: string) {
    await api.delete(`/api/chats/${id}`);
  },
};
