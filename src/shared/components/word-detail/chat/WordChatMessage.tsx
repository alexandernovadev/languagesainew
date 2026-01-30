import { ChatMessage } from "@/types/models/ChatMessage";
import { User, Bot } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";

interface WordChatMessageProps {
  message: ChatMessage;
}

export function WordChatMessage({ message }: WordChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-foreground"
        )}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words m-0">
              {message.content}
            </p>
          ) : (
            <MarkdownRenderer 
              content={message.content} 
              variant="chat"
            />
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
}
