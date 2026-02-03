import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Info, MessageSquare } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { WordInfoTab } from "./info/WordInfoTab";
import { WordChatTab } from "./chat/WordChatTab";
import { Badge } from "@/shared/components/ui/badge";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

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
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType | null>(null);

  // Reset tab to "info" and scroll when word changes
  useEffect(() => {
    setActiveTab("info");
    // Reset Swiper to first slide if on mobile
    if (isMobile && swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
    // Reset scroll for info tab
    if (infoTabRef.current) {
      infoTabRef.current.scrollTop = 0;
    }
    // Reset scroll for chat tab (the scroll is inside WordChatHistory, handled there)
    // But we can also reset the tab container if needed
    if (chatTabRef.current) {
      chatTabRef.current.scrollTop = 0;
    }
  }, [word._id, isMobile]);

  // Sync Swiper with tab changes (when clicking tabs on mobile)
  useEffect(() => {
    if (isMobile && swiperRef.current) {
      const slideIndex = activeTab === "info" ? 0 : 1;
      if (swiperRef.current.activeIndex !== slideIndex) {
        swiperRef.current.slideTo(slideIndex);
      }
    }
  }, [activeTab, isMobile]);

  // Handle tab click - sync with Swiper on mobile
  const handleTabClick = (tab: "info" | "chat") => {
    setActiveTab(tab);
    if (isMobile && swiperRef.current) {
      const slideIndex = tab === "info" ? 0 : 1;
      swiperRef.current.slideTo(slideIndex);
    }
  };

  // Tabs header component (shared between mobile and desktop)
  const TabsHeader = () => (
    <TabsList className="flex-shrink-0 grid w-full grid-cols-2 shadow-md bg-transparent border-b">
      <TabsTrigger 
        value="info" 
        className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        onClick={() => handleTabClick("info")}
      >
        <Info className="h-4 w-4" />
        <span>Info</span>
      </TabsTrigger>
      <TabsTrigger 
        value="chat" 
        className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        onClick={() => handleTabClick("chat")}
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

  // Mobile: Swiper with tabs as indicators
  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
          <TabsHeader />
        </Tabs>
        
        <div className="flex-1 min-h-0 relative w-full">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              const newTab = swiper.activeIndex === 0 ? "info" : "chat";
              setActiveTab(newTab);
            }}
            spaceBetween={0}
            slidesPerView={1}
            allowTouchMove={true}
            touchStartPreventDefault={false}
            threshold={5}
            resistance={true}
            resistanceRatio={0.85}
            touchAngle={30}
            simulateTouch={true}
            touchReleaseOnEdges={true}
            longSwipes={true}
            longSwipesRatio={0.5}
            longSwipesMs={300}
            followFinger={true}
            className="h-full w-full"
            style={{ 
              height: "100%", 
              width: "100%",
            }}
            touchEventsTarget="container"
            preventInteractionOnTransition={false}
            watchOverflow={true}
            allowSlidePrev={true}
            allowSlideNext={true}
            shortSwipes={true}
          >
            <SwiperSlide 
              style={{ 
                height: "100%", 
                overflow: "hidden",
                width: "100%"
              }}
            >
              <InfoContent />
            </SwiperSlide>
            <SwiperSlide 
              style={{ 
                height: "100%", 
                overflow: "hidden",
                width: "100%"
              }}
            >
              <ChatContent />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    );
  }

  // Desktop: Original Tabs component
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
