import { IWord } from "@/types/models/Word";
import { WordChatHistory } from "./WordChatHistory";
import { WordChatInput } from "./WordChatInput";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";

interface WordChatTabProps {
  word: IWord;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  loading: boolean;
}

export function WordChatTab({ word, onSendMessage, onClearChat, loading }: WordChatTabProps) {
  const messages = word.chat || [];

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full relative">
      <WordChatHistory 
        messages={messages} 
        loading={loading && messages.length === 0}
        onSuggestionClick={handleSuggestionClick}
        wordId={word._id}
      />
      {/* Botón flotante de limpiar */}
      {messages.length > 0 && (
        <Button
          onClick={onClearChat}
          variant="ghost"
          size="icon"
          disabled={loading}
          className="absolute bottom-16 right-2 h-8 w-8 text-destructive z-50 border border-destructive bg-destructive/10 hover:bg-destructive/20 transition-all duration-300"
          title="Limpiar chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <WordChatInput
        onSendMessage={onSendMessage}
        onClearChat={onClearChat}
        loading={loading}
      />
    </div>
  );
}
