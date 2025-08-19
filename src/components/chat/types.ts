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
