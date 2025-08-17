import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2, Eye, X } from "lucide-react";
import { TypingAnimation } from "@/components/common/TypingAnimation";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";
import { useTextSelection } from "@/hooks/useTextSelection";
import { TextSelectionTooltip } from "@/components/common";
import ReactMarkdown from "react-markdown";

// Tipos genéricos para el chat
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatInterfaceProps<T> {
  item: T;
  itemId: string;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  streamingMessage: string;
  setStreamingMessage: (message: string) => void;
  onSendMessage: (message: string) => Promise<void>;
  onClearChat: () => Promise<void>;
  placeholder: string;
  enableMarkdown?: boolean;
}

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

  // Ref para el contenedor de selección de texto del chat
  const chatSelectionContainerRef = useRef<HTMLDivElement>(null);

  // Hook para manejo de selección de texto en el chat
  const { selection, hideSelection, keepVisible } = useTextSelection(
    chatSelectionContainerRef
  );

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (itemId) {
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
    chatSelectionContainerRef,
    selection,
    hideSelection,
    keepVisible,
  };
}

// Componente para las opciones por defecto del chat
export function DefaultQuestionsGrid({
  onQuestionClick,
  isLoading,
}: {
  onQuestionClick: (question: string) => void;
  isLoading: boolean;
}) {
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

  return (
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
                  onClick={() => onQuestionClick(question)}
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
  );
}

// Componente para mostrar un mensaje individual
export function ChatMessage({
  message,
  enableMarkdown = false,
}: {
  message: ChatMessage;
  enableMarkdown?: boolean;
}) {
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
        <div className="text-sm max-w-none whitespace-pre-wrap">
          {enableMarkdown && !isUser ? (
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-green-400 font-bold text-2xl"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-green-400 font-bold text-xl" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-green-400 font-bold text-lg" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4
                    className="text-green-400 font-bold text-base"
                    {...props}
                  />
                ),
                h5: ({ node, ...props }) => (
                  <h5 className="text-green-400 font-bold text-sm" {...props} />
                ),
                h6: ({ node, ...props }) => (
                  <h6 className="text-green-400 font-bold text-xs" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

// Componente para el mensaje streaming
export function StreamingMessage({
  streamingMessage,
  enableMarkdown = false,
}: {
  streamingMessage: string;
  enableMarkdown?: boolean;
}) {
  return (
    <div className="flex justify-start">
      <div className="w-full p-3 rounded-lg bg-muted/30">
        {streamingMessage ? (
          <div className="text-sm max-w-none whitespace-pre-wrap">
            {enableMarkdown ? (
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-green-400 font-bold text-2xl"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-green-400 font-bold text-xl" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-green-400 font-bold text-lg" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="text-green-400 font-bold text-base"
                      {...props}
                    />
                  ),
                  h5: ({ node, ...props }) => (
                    <h5 className="text-green-400 font-bold text-sm" {...props} />
                  ),
                  h6: ({ node, ...props }) => (
                    <h6 className="text-green-400 font-bold text-xs" {...props} />
                  ),
                }}
              >
                {streamingMessage}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap">{streamingMessage}</div>
            )}
          </div>
        ) : (
          <TypingAnimation />
        )}
      </div>
    </div>
  );
}

// Componente para el input del chat
export function ChatInput({
  inputValue,
  setInputValue,
  onSendMessage,
  onClearChat,
  placeholder,
  isLoading,
  hasMessages,
}: {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  placeholder: string;
  isLoading: boolean;
  hasMessages: boolean;
}) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(inputValue);
    }
  };

  return (
    <div className="sticky bottom-0 flex gap-2 p-2 bg-background border-t">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Button
        onClick={() => onSendMessage(inputValue)}
        disabled={isLoading || !inputValue.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
      {hasMessages && (
        <Button
          variant="outline"
          onClick={onClearChat}
          disabled={isLoading}
          title="Limpiar chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Función helper para crear mensajes del chat
export function createChatMessage(
  role: "user" | "assistant",
  content: string
): ChatMessage {
  return {
    id: Math.random().toString(36).substr(2, 9),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

// Función helper para limpiar el chat
export async function clearChatWithToast<T>(
  clearChatFunction: (id: string) => Promise<void>,
  itemId: string,
  setMessages: (messages: ChatMessage[]) => void,
  handleApiResult: (result: any, action: string) => void
) {
  try {
    await clearChatFunction(itemId);
    setMessages([]);
    toast.success("Chat limpiado", {
      action: {
        label: <Eye className="h-4 w-4" />,
        onClick: () =>
          handleApiResult(
            {
              success: true,
              data: { messages: [] },
              message: "Chat limpiado",
            },
            "Limpiar Chat"
          ),
      },
      cancel: {
        label: <X className="h-4 w-4" />,
        onClick: () => toast.dismiss(),
      },
    });
  } catch (error) {
    handleApiResult(error, "Limpiar Chat");
  }
}
