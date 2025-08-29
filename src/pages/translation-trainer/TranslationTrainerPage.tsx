import { useState, useCallback } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModalNova } from "@/components/ui/modal-nova";
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Icons
import { Settings, MessageSquare, Plus, Languages, Zap, Menu, X } from "lucide-react";

// Hooks
import { useTranslationConfig } from "@/hooks/useTranslationConfig";
import { useTranslationChats } from "@/hooks/useTranslationChats";
import { useTextGeneration } from "@/hooks/useTextGeneration";

// Components (to be created)
import { ConfigModal } from "./components/ConfigModal";
import { ChatSidebar } from "./components/ChatSidebar";
import { TranslationChat } from "./components/TranslationChat";
import { EmptyState } from "./components/EmptyState";
import type { TranslationConfig } from "@/services/translationService";

export function TranslationTrainerPage() {
  // Hooks
  const { configs, loading: configLoading } = useTranslationConfig();
  const { 
    chats, 
    loading: chatsLoading, 
    activeChat, 
    setActiveChat, 
    createChat,
    deleteChat 
  } = useTranslationChats();
  const { generateText, loading: textGenerationLoading } = useTextGeneration();

  // State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<TranslationConfig | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  // Event handlers
  const handleCreateChat = async () => {
    if (textGenerationLoading) return; // Prevent if generating
    await createChat();
    // Chat will be auto-selected by the hook
    setIsConfigModalOpen(true);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
  };

  const handleConfigSubmit = async () => {
    if (!currentConfig || textGenerationLoading) return;
    
    // Close modal immediately when generation starts
    setIsConfigModalOpen(false);
    
    let targetChatId = activeChat;
    
    // If no active chat, create one first
    if (!activeChat) {
      const newChatId = await createChat();
      if (newChatId) {
        targetChatId = newChatId;
      }
    }
    
    if (targetChatId) {
      await generateText(currentConfig, targetChatId);
    }
  };

  const handleConfigCancel = () => {
    setIsConfigModalOpen(false);
  };

  const handleConfigChange = useCallback((config: TranslationConfig) => {
    setCurrentConfig(config);
  }, []);

  // Loading state
  if (configLoading || chatsLoading || !configs) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center">
          <Languages className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading Translation Trainer...</p>
        </div>
      </div>
    );
  }

  // Sidebar content component  
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-sm lg:text-base">Translation Trainer</h1>
          </div>
          <Badge variant="secondary" className="text-xs">
            {chats.length}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              handleCreateChat();
              setIsSidebarOpen(false);
            }}
            className="w-full" 
            size="sm"
            disabled={textGenerationLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {textGenerationLoading ? 'Generating...' : 'New Chat'}
          </Button>
        </div>
      </div>

      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={(chatId) => {
          handleChatSelect(chatId);
          setIsSidebarOpen(false);
        }}
        onDeleteChat={handleDeleteChat}
      />
    </div>
  );

  // Render
  return (
    <div className="flex h-dvh bg-background relative">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ${
        isDesktopSidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {isDesktopSidebarCollapsed ? (
          <div className="p-4 border-b border-border">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsDesktopSidebarCollapsed(false)}
              className="w-full"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <SidebarContent />
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className="z-[9999]">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80 z-[9999]" style={{ zIndex: 9999 }}>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-primary" />
            <h1 className="font-semibold text-sm">Translation Trainer</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            disabled={textGenerationLoading}
            onClick={() => setIsConfigModalOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 min-h-0">
          {activeChat ? (
            <TranslationChat 
              chatId={activeChat}
              onOpenConfig={() => setIsConfigModalOpen(true)}
            />
          ) : textGenerationLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center">
                <Zap className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                <h2 className="text-xl font-semibold mb-2">Generating Text</h2>
                <p className="text-muted-foreground mb-4">Creating your translation practice session...</p>
                <div className="w-48 bg-muted rounded-full h-2 mx-auto">
                  <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState onCreateChat={handleCreateChat} />
          )}
        </div>
      </div>

      {/* Config Modal */}
      <ModalNova
        open={isConfigModalOpen && !textGenerationLoading}
        onOpenChange={(open) => {
          if (!textGenerationLoading) {
            setIsConfigModalOpen(open);
          }
        }}
        title="Configure Translation Practice"
        description={activeChat ? "Configure your translation training session" : "Create a new chat and configure your training session"}
        footer={
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleConfigCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfigSubmit} disabled={textGenerationLoading}>
              {textGenerationLoading ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Text
                </>
              )}
            </Button>
          </div>
        }
      >
        <div className="p-6">
          {configs && (
            <ConfigModal
              configs={configs}
              onConfigChange={handleConfigChange}
            />
          )}
        </div>
      </ModalNova>
    </div>
  );
}
