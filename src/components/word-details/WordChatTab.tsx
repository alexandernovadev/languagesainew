import { Word } from "@/models/Word";
import { useWordStore } from "@/lib/store/useWordStore";
import { useResultHandler } from "@/hooks/useResultHandler";
import { useChatLogic } from "@/components/chat";
import { ChatMessage } from "@/components/chat/types";
import { createChatMessage, clearChatWithToast } from "@/components/chat/helpers";
import {
  ChatMessage as ChatMessageComponent,
  ChatInput,
  StreamingMessage,
} from "@/components/chat";
import { useEffect } from "react";

interface WordChatTabProps {
  word: Word;
  preloadedChat?: ChatMessage[];  // 🔄 Chat precargado
  isPreloading?: boolean;         // 🔄 Estado de precarga
}

export function WordChatTab({ word, preloadedChat, isPreloading }: WordChatTabProps) {
  const { streamChatMessage, getChatHistory, clearChatHistory } = useWordStore();
  
  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  // Usar el hook personalizado para la lógica del chat
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    isStreaming,
    setIsStreaming,
    streamingMessage,
    setStreamingMessage,
    messagesEndRef,
  } = useChatLogic(
    word,
    word._id,
    getChatHistory,
    preloadedChat || word.chat  // 🔄 Usar chat precargado si está disponible
  );

  // 🔄 Si tenemos chat precargado, usarlo inmediatamente
  useEffect(() => {
    if (preloadedChat && preloadedChat.length > 0) {
      setMessages(preloadedChat);
    }
  }, [preloadedChat, setMessages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !word) return;

    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage("");

    // Add user message immediately
    const userMessage = createChatMessage("user", message);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      let fullMessage = "";

      // Start streaming
      await streamChatMessage(word._id, message, (chunk: string) => {
        fullMessage += chunk;
        setStreamingMessage(fullMessage);
      });

      // Add final assistant message
      const assistantMessage = createChatMessage("assistant", fullMessage);
      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleClearChat = async () => {
    await clearChatWithToast(
      clearChatHistory,
      word._id,
      setMessages,
      handleApiResult
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 🔄 Indicador de precarga */}
      {isPreloading && (
        <div className="p-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Cargando historial del chat...
          </div>
        </div>
      )}

      {/* Historial de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto [&>*]:m-0 [&>*]:p-0">
        {/* Mensajes del chat */}
        {Array.isArray(messages) &&
          messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
              enableMarkdown={true}
            />
          ))}

        {/* Mensaje streaming */}
        {isStreaming && (
          <StreamingMessage streamingMessage={streamingMessage} enableMarkdown={true} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para nueva pregunta */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        placeholder="Pregunta algo sobre esta palabra..."
        isLoading={isLoading}
        hasMessages={messages.length > 0}
      />
    </div>
  );
}
