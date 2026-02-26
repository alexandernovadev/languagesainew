import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useChats } from "@/shared/hooks/useChats";
import type { IWordChat } from "@/types/models/Chat";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { cn } from "@/utils/common/classnames";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000) return d.toLocaleDateString("es", { weekday: "short" });
  return d.toLocaleDateString("es", { day: "numeric", month: "short" });
}

function getPreview(messages: IWordChat["messages"]) {
  const last = messages[messages.length - 1];
  if (!last) return "Nueva conversación";
  const text = last.content.slice(0, 50);
  return text + (last.content.length > 50 ? "…" : "");
}

export default function ChatsPage() {
  const navigate = useNavigate();
  const { chats, loading, deleteChat } = useChats();
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteChatId) return;
    setDeleteLoading(true);
    try {
      await deleteChat(deleteChatId);
      setDeleteChatId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-theme(spacing.4))] sm:h-[calc(100vh-theme(spacing.4))] max-h-[calc(100dvh-8rem)] sm:max-h-[calc(100vh-8rem)]">
      <PageHeader
        title="Chats"
        description="Practica vocabulario con conversaciones guiadas"
        actions={
          <Button
            size="sm"
            onClick={() => navigate("/chats/new")}
            className="gap-2 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo chat</span>
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto -mx-4 px-4">
        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Sin chats aún</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Crea un chat para practicar vocabulario con la IA
            </p>
            <Button onClick={() => navigate("/chats/new")} className="rounded-xl gap-2">
              <Plus className="h-4 w-4" />
              Nuevo chat
            </Button>
          </div>
        ) : (
          <div className="space-y-2 py-4">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => navigate(`/chats/${chat._id}`)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border border-border bg-card",
                  "hover:bg-muted/50 active:bg-muted/70 transition-colors cursor-pointer",
                  "touch-manipulation"
                )}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(chat.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {getPreview(chat.messages)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteChatId(chat._id);
                  }}
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialogNova
        open={!!deleteChatId}
        onOpenChange={(o) => !o && setDeleteChatId(null)}
        title="¿Eliminar chat?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
        confirmVariant="destructive"
      />
    </div>
  );
}
