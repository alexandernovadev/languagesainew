import { useState } from "react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialogNova } from "@/components/ui/alert-dialog-nova";
import { Button } from "@/components/ui/button";

// Icons
import { MessageSquare, Clock, TrendingUp, MoreVertical, Trash2 } from "lucide-react";

// Types
import type { TranslationChat } from "@/services/translationService";

interface ChatSidebarProps {
  chats: TranslationChat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({ chats, activeChat, onChatSelect, onDeleteChat }: ChatSidebarProps) {
  // State for delete confirmation
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  // Safety check - ensure chats is always an array with valid IDs
  const safeChats = Array.isArray(chats) 
    ? chats.filter(chat => chat && chat.id).map((chat, index) => ({
        ...chat,
        // Ensure unique key by adding index as fallback
        id: chat.id || `fallback-${index}-${Date.now()}`
      }))
    : [];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'spanish': return '🇪🇸';
      case 'english': return '🇺🇸';
      case 'portuguese': return '🇵🇹';
      default: return '🌐';
    }
  };

  return (
    <>
      <ScrollArea className="flex-1">
      {safeChats.length === 0 ? (
        <div className="p-6 text-center">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No chats yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first chat to start practicing</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {safeChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeChat === chat.id
                  ? 'bg-primary/10 border-primary/20 border'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {chat.name}
                </h3>
                <div className="flex items-center gap-2">
                  {chat.lastScore && (
                    <Badge variant="secondary">
                      {chat.lastScore}
                    </Badge>
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
                    {getLanguageFlag(chat.config.sourceLanguage || 'spanish')}
                  </span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-xs">
                    {getLanguageFlag(chat.config.targetLanguage || 'english')}
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
                  <span>{formatDate(chat.lastActivity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </ScrollArea>
    
    {/* Delete Confirmation Dialog */}
    <AlertDialogNova
      open={!!chatToDelete}
      onOpenChange={(open) => !open && setChatToDelete(null)}
      title="Delete Chat"
      description={
        <div>
          <p>Are you sure you want to delete this chat?</p>
          <p className="text-sm text-muted-foreground mt-2">
            All messages and translations in this chat will be permanently lost. This action cannot be undone.
          </p>
        </div>
      }
      onConfirm={() => {
        if (chatToDelete) {
          onDeleteChat(chatToDelete);
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
