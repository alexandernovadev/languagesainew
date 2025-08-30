import { useState } from "react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { AlertDialogNova } from "@/components/ui/alert-dialog-nova";
import { Button } from "@/components/ui/button";

// Icons
import { MessageSquare, Clock, Trash2 } from "lucide-react";

// Types
import { useTranslationTrainerStore } from "@/lib/store/useTranslationTrainerStore";
import { getLanguageFlag } from "@/utils/languageHelpers"; // Import the new helper
import { timeAgo } from "@/utils/common/time/timeAgo"; // Import timeAgo helper

export function ChatSidebar({}) {
  const { chats, activeChat, setActiveChat, deleteChat } =
    useTranslationTrainerStore();

  // State for delete confirmation
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  // Safety check - ensure chats is always an array with valid IDs
  const safeChats = Array.isArray(chats)
    ? chats
        .filter((chat) => chat && chat.id)
        .map((chat, index) => ({
          ...chat,
          // Ensure unique key by adding index as fallback
          id: chat.id || `fallback-${index}-${Date.now()}`,
        }))
    : [];

  return (
    <>
      <div className="flex-1">
        {safeChats.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No chats yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first chat to start practicing
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {safeChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChat === chat.id
                    ? "bg-primary/10 border-primary/20 border"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm text-foreground truncate">
                    {chat.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {chat.lastScore && (
                      <Badge variant="secondary">{chat.lastScore}</Badge>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatToDelete(chat.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {chat.config && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs">
                      {getLanguageFlag(chat.config.sourceLanguage || "spanish")}
                    </span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-xs">
                      {getLanguageFlag(chat.config.targetLanguage || "english")}
                    </span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {chat.config.difficulty}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{chat.messageCount}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo(chat.lastActivity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialogNova
        open={!!chatToDelete}
        onOpenChange={(open) => !open && setChatToDelete(null)}
        title="Delete Chat"
        description={
          <>
            Are you sure you want to delete this chat?
            <br />
            <span className="text-sm text-muted-foreground">
              All messages and translations in this chat will be permanently
              lost. This action cannot be undone.
            </span>
          </>
        }
        onConfirm={() => {
          if (chatToDelete) {
            deleteChat(chatToDelete);
            setChatToDelete(null);
          }
        }}
        onCancel={() => setChatToDelete(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
