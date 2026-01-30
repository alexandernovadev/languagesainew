import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Send, Trash2 } from "lucide-react";

interface WordChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  loading: boolean;
}

export function WordChatInput({ onSendMessage, onClearChat, loading }: WordChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="border-t p-4 bg-background">
      <div className="flex gap-2 mb-2">
        <Button
          onClick={onClearChat}
          variant="ghost"
          size="sm"
          disabled={loading}
          className="text-muted-foreground"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar Chat
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={loading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!message.trim() || loading}
          size="default"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar
        </Button>
      </form>
    </div>
  );
}
