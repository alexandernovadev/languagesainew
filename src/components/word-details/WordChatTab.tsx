import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2 } from "lucide-react";
import { Word } from "@/models/Word";
import type { ChatMessage } from "@/models/Word";
import { useWordStore } from "@/lib/store/useWordStore";
import { TypingAnimation } from "@/components/common/TypingAnimation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface WordChatTabProps {
  word: Word;
}

export function WordChatTab({ word }: WordChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(word?.chat || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const { streamChatMessage, actionLoading } = useWordStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added or streaming
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, isStreaming]);

  // Opciones por defecto organizadas por categorías
  const questionCategories = [
    {
      title: "Ejemplos",
      icon: "💡",
      questions: ["Dame ejemplos de uso", "Úsala en una conversación"],
    },
    {
      title: "Contexto",
      icon: "🎯",
      questions: ["¿Cuándo se usa?", "¿Es formal o informal?"],
    },
    {
      title: "Detalles",
      icon: "📚",
      questions: ["Explícame más a detalle", "Dame sinónimos"],
    },
  ];

  const handleDefaultQuestion = async (question: string) => {
    setInputValue(question);
    await handleSendMessage(question);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !word) return;

    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage("");

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

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
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: fullMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error al enviar el mensaje");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const clearChat = async () => {
    try {
      await useWordStore.getState().clearChatHistory(word._id);
      setMessages([]);
      toast.success("Chat limpiado");
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Historial de mensajes */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Opciones por defecto dentro del chat */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {questionCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="text-center">
                  <div className="mb-2">
                    <div className="text-lg mb-1">{category.icon}</div>
                    <h5 className="text-sm font-medium text-muted-foreground">
                      {category.title}
                    </h5>
                  </div>
                  <div className="space-y-2">
                    {category.questions.map((question, questionIndex) => (
                      <Button
                        key={`${categoryIndex}-${questionIndex}`}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDefaultQuestion(question)}
                        disabled={isLoading}
                        className="w-full h-auto text-xs p-2 text-center leading-tight hover:bg-accent"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensajes del chat */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Mensaje streaming */}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="w-full p-3 rounded-lg bg-muted/30">
              {streamingMessage ? (
                <div className="text-sm">
                  <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                </div>
              ) : (
                <TypingAnimation />
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para nueva pregunta - Sticky abajo */}
      <div className="sticky bottom-0 flex gap-2 p-2 bg-background border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pregunta algo sobre esta palabra..."
          disabled={isLoading}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={() => handleSendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
        {messages.length > 0 && (
          <Button
            variant="outline"
            onClick={clearChat}
            disabled={isLoading}
            title="Limpiar chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar un mensaje individual
function ChatMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg ${
          isUser
            ? "max-w-[80%] bg-primary/70 text-primary-foreground"
            : "w-full bg-muted/30"
        }`}
      >
        <div className="text-sm">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2">{children}</ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
