import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useResultHandler } from "@/hooks/useResultHandler";
import { translationService, type TranslationChat } from "@/services/translationService";

export function useTranslationChats() {
  const { handleApiResult } = useResultHandler();
  const [chats, setChats] = useState<TranslationChat[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const loadChats = async () => {
    setLoading(true);
    try {
      const result = await translationService.getChats();
      // Ensure result is always an array
      setChats(Array.isArray(result) ? result : []);
    } catch (error) {
      handleApiResult(error, "Translation Chats");
      // Set empty array on error
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async () => {
    try {
      const newChat = await translationService.createChat();
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat.id);
      
      toast.success("New chat created");
      
      return newChat.id;
    } catch (error) {
      handleApiResult(error, "Chat Creation");
    }
  };

  const getChatDetails = async (chatId: string) => {
    try {
      const result = await translationService.getChatDetails(chatId);
      return result;
    } catch (error) {
      handleApiResult(error, "Chat Details");
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await translationService.deleteChat(chatId);
      
      // Remove from local state
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // Clear active chat if it was the deleted one
      if (activeChat === chatId) {
        setActiveChat(null);
      }
      
      toast.success("Chat deleted successfully");
      
    } catch (error) {
      handleApiResult(error, "Chat Deletion");
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  return {
    chats,
    loading,
    activeChat,
    setActiveChat,
    createChat,
    getChatDetails,
    loadChats,
    deleteChat
  };
}
