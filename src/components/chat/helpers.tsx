import { toast } from "sonner";
import { Eye, X } from "lucide-react";
import { ChatMessage } from "./types";

// Función helper para crear mensajes del chat
export function createChatMessage(
  role: "user" | "assistant",
  content: string
): ChatMessage {
  return {
    id: Math.random().toString(36).substr(2, 9),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

// Función helper para limpiar el chat
export async function clearChatWithToast<T>(
  clearChatFunction: (id: string) => Promise<void>,
  itemId: string,
  setMessages: (messages: ChatMessage[]) => void,
  handleApiResult: (result: any, action: string) => void
) {
  try {
    await clearChatFunction(itemId);
    setMessages([]);
    toast.success("Chat limpiado", {
      action: {
        label: <Eye className="h-4 w-4" />,
        onClick: () =>
          handleApiResult(
            {
              success: true,
              data: { messages: [] },
              message: "Chat limpiado",
            },
            "Limpiar Chat"
          ),
      },
      cancel: {
        label: <X className="h-4 w-4" />,
        onClick: () => toast.dismiss(),
      },
    });
  } catch (error) {
    handleApiResult(error, "Limpiar Chat");
  }
}
