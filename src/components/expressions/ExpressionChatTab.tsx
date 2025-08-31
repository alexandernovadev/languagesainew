import { Expression } from "@/models/Expression";
import { useExpressionStore } from "@/lib/store/useExpressionStore";
import { useResultHandler } from "@/hooks/useResultHandler";
import {
  useChatLogic,
  ChatMessageComponent,
  StreamingMessage,
  ChatInput,
  createChatMessage,
  clearChatWithToast,
} from "@/components/chat";

interface ExpressionChatTabProps {
  expression: Expression;
}

export function ExpressionChatTab({ expression }: ExpressionChatTabProps) {
  const { streamChatMessage, getChatHistory, clearChatHistory } =
    useExpressionStore();

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  // Usar el hook personalizado para la lógica del chat
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    isStreaming,
    setIsStreaming,
    streamingMessage,
    setStreamingMessage,
    messagesEndRef,
  } = useChatLogic(expression, expression._id, getChatHistory, expression.chat);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !expression) return;

    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage("");

    // Add user message immediately
    const userMessage = createChatMessage("user", message);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      let fullMessage = "";

      // Start streaming
      await streamChatMessage(expression._id, message, (chunk: string) => {
        fullMessage += chunk;
        setStreamingMessage(fullMessage);
      });

      // Add final assistant message
      const assistantMessage = createChatMessage("assistant", fullMessage);
      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleClearChat = async () => {
    await clearChatWithToast(
      expression._id,
      clearChatHistory,
      setMessages,
      handleApiResult
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Historial de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto [&>*]:m-0 [&>*]:p-0">
        {/* Mensajes del chat */}
        {Array.isArray(messages) &&
          messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
              enableMarkdown={true}
            />
          ))}

        {/* Mensaje streaming */}
        {isStreaming && (
          <StreamingMessage
            streamingMessage={streamingMessage}
            enableMarkdown={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para nueva pregunta */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        placeholder="Pregunta algo sobre esta expresión..."
        isLoading={isLoading}
        hasMessages={messages.length > 0}
      />
    </div>
  );
}
