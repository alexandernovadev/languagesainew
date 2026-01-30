import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/models/ChatMessage";
import { WordChatMessage } from "./WordChatMessage";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface WordChatHistoryProps {
  messages: ChatMessage[];
  loading: boolean;
}

export function WordChatHistory({ messages, loading }: WordChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <p className="text-muted-foreground mb-2">No hay mensajes aún</p>
          <p className="text-sm text-muted-foreground">
            Comienza una conversación sobre esta palabra
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => (
        <WordChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
