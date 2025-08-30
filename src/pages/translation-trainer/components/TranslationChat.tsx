import { useState, useRef, useEffect } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Icons
import { Send, Settings, Zap, RotateCcw } from "lucide-react";
// Types
import {
  translationService,
  // type TranslationConfig, // Now from store
} from "@/services/translationService";
import { useTranslationTrainerStore, type Message } from "@/lib/store/useTranslationTrainerStore";
import type { TranslationConfig } from "@/services/translationService";
import { getLanguageFlag } from "@/utils/languageHelpers"; // Import the new helper

// Components
import { ChatMessage } from "./ChatMessage";

interface TranslationChatProps {
  onOpenConfig: () => void;
}

export function TranslationChat({
  onOpenConfig,
}: TranslationChatProps) {
  // Hooks
  const { 
    activeChat,
    generatedText,
    generatedTextId,
    textGenerationLoading: generating,
    currentGenerationConfig: config,
    messages,
    addMessage,
    loadChatMessages,
    clearMessages,
    generateText,
  } = useTranslationTrainerStore();

  // Local state that will remain
  const [userTranslation, setUserTranslation] = useState("");
  const [chatName, setChatName] = useState("Translation Practice");
  const [analyzing, setAnalyzing] = useState(false); 

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effects
  useEffect(() => {
    // Load chat messages when activeChat changes
    if (activeChat) {
      loadChatMessages(activeChat);
      // Also update chatName from activeChat's details if available
      const currentChat = useTranslationTrainerStore.getState().chats.find(c => c.id === activeChat);
      if (currentChat) {
        setChatName(currentChat.name || "Translation Practice");
      } else {
        setChatName("Translation Practice");
      }
    } else {
      clearMessages();
      setChatName("Translation Practice");
    }
  }, [activeChat, loadChatMessages, clearMessages]);

  useEffect(() => {
    if (generatedText && generatedTextId) {
      const newMessage: Message = {
        id: generatedTextId,
        type: "generated_text",
        content: generatedText,
        timestamp: new Date(),
        metadata: { config },
      };
      if (!messages.some(msg => msg.id === newMessage.id)) {
        addMessage(newMessage);
      }
    }
  }, [generatedText, generatedTextId, config, addMessage, messages]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Event handlers
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitTranslation = async () => {
    if (!userTranslation.trim() || !generatedText || !activeChat) return;

    // Add user translation message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user_translation",
      content: userTranslation,
      timestamp: new Date(),
      metadata: { chatId: activeChat },
    };
    addMessage(userMessage);

    // Analyze translation using translationService directly
    try {
      setAnalyzing(true); // Start analyzing
      const analysis = await translationService.analyzeTranslation({
        originalText: generatedText,
        userTranslation,
        sourceLanguage: config?.sourceLanguage,
        targetLanguage: config?.targetLanguage,
        textId: generatedTextId,
        chatId: activeChat,
      });

      if (analysis) {
        // Add AI feedback message
        const feedbackMessage: Message = {
          id: `feedback-${Date.now()}`,
          type: "ai_feedback",
          content: analysis.correctTranslation,
          timestamp: new Date(),
          metadata: {
            score: analysis.score,
            feedback: analysis.feedback,
            errors: analysis.errors,
            chatId: activeChat,
          },
        };
        addMessage(feedbackMessage);
      }
    } catch (error) {
      console.error("Translation analysis failed:", error);
    } finally {
      setAnalyzing(false); 
    }

    setUserTranslation("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitTranslation();
    }
  };

  const handleGenerateNewText = async () => {
    if (!activeChat) return;

    const defaultConfig: TranslationConfig = {
      minWords: 120,
      maxWords: 300,
      difficulty: "intermediate" as const,
      sourceLanguage: "spanish" as const,
      targetLanguage: "english" as const,
      mustUseWords: [],
      grammarTopics: [],
      topic: "general",
    };

    console.log("⚙️ [TranslationChat] Using config:", defaultConfig);
    await generateText(defaultConfig, activeChat);
  };

  const getLanguageInfo = () => {
    if (!config) return null;
    return {
      source: config.sourceLanguage || "spanish",
      target: config.targetLanguage || "english",
      sourceFlag: getLanguageFlag(config.sourceLanguage || "spanish"),
      targetFlag: getLanguageFlag(config.targetLanguage || "english"),
    };
  };

  const languageInfo = getLanguageInfo();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">{chatName}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateNewText}
                disabled={generating}
              >
                {generating ? (
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
          </div>

          <div className="flex items-center gap-3">
            {languageInfo && (
              <Badge variant="secondary" className="text-sm">
                {languageInfo.sourceFlag} → {languageInfo.targetFlag}
              </Badge>
            )}
            {config?.difficulty && (
              <Badge variant="outline" className="text-xs">
                {config.difficulty}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-6">
        <div className="space-y-4">
          {messages.length === 0 && !generating ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <Zap className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p>No messages yet</p>
                <p className="text-sm">
                  Configure your practice session to get started
                </p>
                {/* Removed generating block here, as the main generating block below handles this */}
              </div>
              <Button onClick={onOpenConfig} disabled={generating}>
                <Settings className="h-4 w-4 mr-2" />
                {generating ? "Generating..." : "Configure Practice"}
              </Button>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={
                  message.type === "generated_text" ? onOpenConfig : undefined
                }
              />
            ))
          )}

          {generating && messages.length === 0 && (
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
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      {generatedText && (
        <div className="sticky bottom-0 p-6 border-t border-border bg-card shadow-lg">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={userTranslation}
              onChange={(e) => setUserTranslation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type your translation in ${languageInfo?.target}...`}
              className="min-h-[60px] resize-none"
              disabled={analyzing}
            />
            <Button
              onClick={handleSubmitTranslation}
              disabled={!userTranslation.trim() || analyzing}
              size="sm"
              className="self-end"
            >
              {analyzing ? (
                <RotateCcw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
