import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./types";

// Hook personalizado para la lógica del chat
export function useChatLogic<T>(
  item: T,
  itemId: string,
  getChatHistory: (id: string) => Promise<ChatMessage[]>,
  fallbackChat?: ChatMessage[]
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (itemId) {
        // 🔄 Si ya tenemos fallbackChat con datos, usarlo inmediatamente
        if (fallbackChat && fallbackChat.length > 0) {
          setMessages(fallbackChat);
          return; // No hacer llamada HTTP si ya tenemos datos
        }

        try {
          const chatHistory = await getChatHistory(itemId);
          // Ensure we always set an array
          setMessages(Array.isArray(chatHistory) ? chatHistory : []);
        } catch (error) {
          console.error("Error loading chat history:", error);
          // Fallback to fallbackChat if available
          setMessages(Array.isArray(fallbackChat) ? fallbackChat : []);
        }
      }
    };

    loadChatHistory();
  }, [itemId, getChatHistory, fallbackChat]);

  // Auto-scroll to bottom when new messages are added or streaming
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, isStreaming]);

  return {
    messages,
    inputValue,
    isLoading,
    isStreaming,
    streamingMessage,
    messagesEndRef,
    
    setInputValue,
    setIsLoading,
    setIsStreaming,
    setStreamingMessage,
    setMessages,
  };
}
