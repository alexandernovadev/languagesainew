import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Trash2 } from "lucide-react";
import { Expression } from "@/models/Expression";
import type { ChatMessage } from "@/models/Expression";
import { useExpressionStore } from "@/lib/store/useExpressionStore";
import { toast } from "sonner";

interface ExpressionChatTabProps {
  expression: Expression;
}

export function ExpressionChatTab({ expression }: ExpressionChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(expression?.chat || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addChatMessage, actionLoading } = useExpressionStore();

  // Opciones por defecto
  const defaultQuestions = [
    "Explícame esto más a detalle",
    "Dame ejemplos de uso",
    "¿Cuándo se usa esta expresión?",
    "Dame sinónimos",
    "¿Es formal o informal?",
    "¿Hay variaciones de esta expresión?"
  ];

  const handleDefaultQuestion = async (question: string) => {
    setInputValue(question);
    await handleSendMessage(question);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !expression) return;
    
    setIsLoading(true);
    try {
      await addChatMessage(expression._id, message);
      setInputValue("");
      
      // Refresh messages from store
      const updatedExpression = useExpressionStore.getState().expressions.find(
        expr => expr._id === expression._id
      );
      if (updatedExpression) {
        setMessages(updatedExpression.chat || []);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const clearChat = async () => {
    try {
      await useExpressionStore.getState().clearChatHistory(expression._id);
      setMessages([]);
      toast.success("Chat limpiado");
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Opciones por defecto */}
      {messages.length === 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Preguntas sugeridas:</h4>
          <div className="grid grid-cols-1 gap-2">
            {defaultQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleDefaultQuestion(question)}
                disabled={isLoading}
                className="justify-start text-left"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Historial de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-lg bg-muted/20">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No hay mensajes aún</p>
            <p className="text-sm">Haz una pregunta sobre esta expresión</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      
      {/* Input para nueva pregunta */}
      <div className="mt-4 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pregunta algo sobre esta expresión..."
          disabled={isLoading}
          onKeyPress={handleKeyPress}
        />
        <Button 
          onClick={() => handleSendMessage(inputValue)} 
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
        {messages.length > 0 && (
          <Button 
            variant="outline"
            onClick={clearChat}
            disabled={isLoading}
            title="Limpiar chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar un mensaje individual
function ChatMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-lg ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
} 