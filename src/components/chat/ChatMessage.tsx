import { MarkdownRenderer } from "./MarkdownRenderer";
import { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
  enableMarkdown?: boolean;
}

export function ChatMessage({ message, enableMarkdown = false }: ChatMessageProps) {
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
            <MarkdownRenderer content={message.content} />
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
