import { useState, useEffect, useCallback } from "react";
import { chatService } from "@/services/chatService";
import type { IWordChat } from "@/types/models/Chat";
import { toast } from "sonner";

export function useChats() {
  const [chats, setChats] = useState<IWordChat[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const result = await chatService.list(currentPage, limit);
      setChats(result.data || []);
      setTotalPages(result.pages ?? Math.max(1, Math.ceil((result.total || 0) / limit)));
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Error al cargar chats");
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const deleteChat = useCallback(async (id: string): Promise<boolean> => {
    try {
      await chatService.delete(id);
      toast.success("Chat eliminado");
      await fetchChats();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al eliminar");
      return false;
    }
  }, [fetchChats]);

  return {
    chats,
    loading,
    currentPage,
    totalPages,
    deleteChat,
    refreshChats: fetchChats,
  };
}
