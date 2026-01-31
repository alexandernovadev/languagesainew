import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/models/ChatMessage";
import { WordChatMessage } from "./WordChatMessage";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";

interface WordChatHistoryProps {
  messages: ChatMessage[];
  loading: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  wordId?: string;
}

export function WordChatHistory({ messages, loading, onSuggestionClick, wordId }: WordChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset scroll when word changes
  useEffect(() => {
    if (wordId && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [wordId]);

  const suggestions = [
    "Dame ejemplos en una conversación",
    "¿Cuál es la pronunciación correcta?",
    "Explícame la diferencia con palabras similares",
    "Dame sinónimos y antónimos",
    "¿Cómo se usa en diferentes contextos?",
    "Dame frases comunes con esta palabra"
  ];

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
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4 whitespace-normal hover:bg-primary/10 hover:border-primary/50 transition-colors"
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => (
        <WordChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
