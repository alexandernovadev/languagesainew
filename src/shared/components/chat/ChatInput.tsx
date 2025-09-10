import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Send, Trash2 } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  placeholder: string;
  isLoading: boolean;
  hasMessages: boolean;
  setInputValue: (value: string) => void;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
}

export function ChatInput({
  inputValue,
  placeholder,
  isLoading,
  hasMessages,
  setInputValue,
  onSendMessage,
  onClearChat,
}: ChatInputProps) {
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
        onKeyDown={handleKeyPress}
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
