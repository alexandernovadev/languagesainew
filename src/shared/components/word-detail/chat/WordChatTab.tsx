import { IWord } from "@/types/models/Word";
import { WordChatHistory } from "./WordChatHistory";
import { WordChatInput } from "./WordChatInput";

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
    <div className="flex flex-col h-full">
      <WordChatHistory 
        messages={messages} 
        loading={loading && messages.length === 0}
        onSuggestionClick={handleSuggestionClick}
        wordId={word._id}
      />
      <WordChatInput
        onSendMessage={onSendMessage}
        onClearChat={onClearChat}
        loading={loading}
      />
    </div>
  );
}
