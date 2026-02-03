import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Info, MessageSquare } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { WordInfoTab } from "./info/WordInfoTab";
import { WordChatTab } from "./chat/WordChatTab";
import { Badge } from "@/shared/components/ui/badge";

interface WordDetailTabsProps {
  word: IWord;
  loadingImage: boolean;
  loadingSynonyms: boolean;
  loadingExamples: boolean;
  loadingTypes: boolean;
  loadingCodeSwitching: boolean;
  loadingChat: boolean;
  loadingAll?: boolean;
  onRefreshImage: () => void;
  onRefreshSynonyms: () => void;
  onRefreshExamples: () => void;
  onRefreshTypes: () => void;
  onRefreshCodeSwitching: () => void;
  onRefreshAll?: () => void;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onUpdateDifficulty?: (difficulty: string) => void;
}

export function WordDetailTabs({
  word,
  loadingImage,
  loadingSynonyms,
  loadingExamples,
  loadingTypes,
  loadingCodeSwitching,
  loadingChat,
  loadingAll,
  onRefreshImage,
  onRefreshSynonyms,
  onRefreshExamples,
  onRefreshTypes,
  onRefreshCodeSwitching,
  onRefreshAll,
  onSendMessage,
  onClearChat,
  onUpdateDifficulty,
}: WordDetailTabsProps) {
  const chatMessagesCount = word.chat?.length || 0;
  const infoTabRef = useRef<HTMLDivElement>(null);
  const chatTabRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("info");

  // Reset tab to "info" and scroll when word changes
  useEffect(() => {
    setActiveTab("info");
    // Reset scroll for info tab
    if (infoTabRef.current) {
      infoTabRef.current.scrollTop = 0;
    }
    // Reset scroll for chat tab (the scroll is inside WordChatHistory, handled there)
    if (chatTabRef.current) {
      chatTabRef.current.scrollTop = 0;
    }
  }, [word._id]);

  // Tabs header component
  const TabsHeader = () => (
    <TabsList className="flex-shrink-0 grid w-full grid-cols-2 shadow-md bg-transparent border-b">
      <TabsTrigger 
        value="info" 
        className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
      >
        <Info className="h-4 w-4" />
        <span>Info</span>
      </TabsTrigger>
      <TabsTrigger 
        value="chat" 
        className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Chat</span>
        {chatMessagesCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {chatMessagesCount}
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  );

  // Content components
  const InfoContent = () => (
    <div 
      ref={infoTabRef}
      className="flex-1 overflow-y-auto min-h-0 h-full"
    >
      <WordInfoTab
        word={word}
        loadingImage={loadingImage}
        loadingSynonyms={loadingSynonyms}
        loadingExamples={loadingExamples}
        loadingTypes={loadingTypes}
        loadingCodeSwitching={loadingCodeSwitching}
        loadingAll={loadingAll}
        onRefreshImage={onRefreshImage}
        onRefreshSynonyms={onRefreshSynonyms}
        onRefreshExamples={onRefreshExamples}
        onRefreshTypes={onRefreshTypes}
        onRefreshCodeSwitching={onRefreshCodeSwitching}
        onRefreshAll={onRefreshAll}
        onUpdateDifficulty={onUpdateDifficulty}
      />
    </div>
  );

  const ChatContent = () => (
    <div 
      ref={chatTabRef}
      className="flex-1 overflow-hidden flex flex-col min-h-0 h-full"
    >
      <WordChatTab
        word={word}
        onSendMessage={onSendMessage}
        onClearChat={onClearChat}
        loading={loadingChat}
      />
    </div>
  );

  // Tabs component (same for mobile and desktop)
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
      <TabsHeader />

      <TabsContent 
        value="info" 
        className="flex-1 overflow-y-auto mt-0 min-h-0 data-[state=inactive]:hidden"
      >
        <InfoContent />
      </TabsContent>

      <TabsContent 
        value="chat" 
        className="flex-1 overflow-hidden mt-0 flex flex-col min-h-0 data-[state=inactive]:hidden"
      >
        <ChatContent />
      </TabsContent>
    </Tabs>
  );
}
