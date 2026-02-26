import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChats } from "@/shared/hooks/useChats";
import type { IWordChat } from "@/types/models/Chat";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
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
    <div className="flex flex-col h-full min-h-0 w-full min-w-0 overflow-hidden">
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
        <SidebarTrigger className="h-8 w-8 shrink-0" />
        <div className="min-w-0">
          <h1 className="text-lg font-semibold leading-tight">Chats</h1>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Practica con conversaciones guiadas
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <MessageCircle className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-base mb-1">Sin chats aún</h3>
            <p className="text-sm text-muted-foreground max-w-[220px]">
              Toca el botón + para crear tu primer chat
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => navigate(`/chats/${chat._id}`)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  "active:bg-muted/60 transition-colors cursor-pointer",
                  "touch-manipulation"
                )}
              >
                <div className="shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium truncate">{chat.title}</h3>
                    <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                      {formatDate(chat.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">
                      {getPreview(chat.messages)}
                    </p>
                    <button
                      type="button"
                      className="shrink-0 p-1.5 -m-1.5 rounded-full text-muted-foreground/60 hover:text-destructive active:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteChatId(chat._id);
                      }}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
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

      {/* Floating Action Button */}
      <Button
        size="icon"
        onClick={() => navigate("/chats/new")}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
