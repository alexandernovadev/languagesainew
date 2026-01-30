import { ChatMessage } from "@/types/models/ChatMessage";
import { User, Bot } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
            <div className="text-sm break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0 text-primary">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-primary/90">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 mt-2 first:mt-0 text-primary/80">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-medium mb-2 mt-2 first:mt-0 text-primary/70">{children}</h4>,
                  h5: ({ children }) => <h5 className="text-xs font-medium mb-2 mt-2 first:mt-0 text-primary/60">{children}</h5>,
                  h6: ({ children }) => <h6 className="text-xs font-normal mb-2 mt-2 first:mt-0 text-primary/50">{children}</h6>,
                  ul: ({ children }) => <ul className="list-disc list-outside mb-2 ml-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside mb-2 ml-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm pl-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-black/20 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                    ) : (
                      <code className="block bg-black/20 p-2 rounded text-xs font-mono overflow-x-auto">{children}</code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary/30 pl-3 my-2 italic">{children}</blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
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
