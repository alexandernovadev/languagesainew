export interface ChatMessage {
  id: string;
  role: "user" | "assistant"; // TODO otrA VEZ CHAMBONADA
  content: string;
  timestamp: string;
}

export interface ChatInterfaceProps<T> {
  item: T;
  itemId: string;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingMessage: string;
  placeholder: string;
  enableMarkdown?: boolean;
  setMessages: (messages: ChatMessage[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setStreamingMessage: (message: string) => void;
  onSendMessage: (message: string) => Promise<void>;
  onClearChat: () => Promise<void>;
}
