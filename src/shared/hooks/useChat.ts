import { useState, useEffect, useCallback } from "react";
import { chatService } from "@/services/chatService";
import type { IWordChat } from "@/types/models/Chat";
import { toast } from "sonner";

export function useChat(chatId: string | undefined) {
  const [chat, setChat] = useState<IWordChat | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadChat = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    try {
      const data = await chatService.getById(chatId);
      setChat(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al cargar chat");
      setChat(null);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatId || !content.trim()) return;
    setSending(true);
    try {
      const updated = await chatService.addMessage(chatId, content.trim());
      setChat(updated);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al enviar");
    } finally {
      setSending(false);
    }
  }, [chatId]);

  const correctMessage = useCallback(async (messageIndex: number) => {
    if (!chatId) return;
    try {
      const updated = await chatService.requestCorrection(chatId, messageIndex);
      setChat(updated);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al corregir");
    }
  }, [chatId]);

  return {
    chat,
    loading,
    sending,
    sendMessage,
    correctMessage,
    refreshChat: loadChat,
  };
}
