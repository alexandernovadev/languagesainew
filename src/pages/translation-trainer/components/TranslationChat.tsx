import { useState, useRef, useEffect } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Icons
import { Send, Settings, Zap, RotateCcw } from "lucide-react";

// Hooks
import { useTextGeneration } from "@/hooks/useTextGeneration";
import { useTranslationAnalysis } from "@/hooks/useTranslationAnalysis";

// Types  
import { translationService, type TranslationConfig } from "@/services/translationService";

// Components
import { ChatMessage } from "./ChatMessage";

interface TranslationChatProps {
  chatId: string;
  onOpenConfig: () => void;
}

interface Message {
  id: string;
  type: 'generated_text' | 'user_translation' | 'ai_feedback';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export function TranslationChat({ chatId, onOpenConfig }: TranslationChatProps) {
  // Hooks
  const { text: generatedText, textId, loading: generating, config, generateText } = useTextGeneration();
  const { analyzeTranslation, loading: analyzing } = useTranslationAnalysis();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [userTranslation, setUserTranslation] = useState('');
  const [currentGeneratedText, setCurrentGeneratedText] = useState('');

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effects
  useEffect(() => {
    // Load chat messages when chatId changes
    if (chatId) {
      loadChatMessages(chatId);
    } else {
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    console.log('🔄 [TranslationChat] useEffect triggered:', {
      generatedText: generatedText?.substring(0, 50) + '...',
      currentGeneratedText: currentGeneratedText?.substring(0, 50) + '...',
      hasConfig: !!config,
      messagesCount: messages.length
    });

    if (generatedText && generatedText !== currentGeneratedText) {
      console.log('✅ [TranslationChat] Adding new generated text message');
      setCurrentGeneratedText(generatedText);
      const newMessage: Message = {
        id: `generated-${Date.now()}`,
        type: 'generated_text',
        content: generatedText,
        timestamp: new Date(),
        metadata: { config }
      };
      setMessages(prev => {
        console.log('📝 [TranslationChat] Previous messages:', prev.length);
        const updated = [...prev, newMessage];
        console.log('📝 [TranslationChat] Updated messages:', updated.length);
        console.log('📝 [TranslationChat] New message content:', newMessage.content.substring(0, 100) + '...');
        return updated;
      });
    } else {
      console.log('❌ [TranslationChat] Not adding message because:', {
        noGeneratedText: !generatedText,
        sameText: generatedText === currentGeneratedText,
        generatedTextLength: generatedText?.length || 0,
        currentGeneratedTextLength: currentGeneratedText?.length || 0
      });
    }
  }, [generatedText, currentGeneratedText, config]);

  useEffect(() => {
    // Only scroll if there are messages
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Event handlers
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitTranslation = async () => {
    if (!userTranslation.trim() || !currentGeneratedText) return;

    // Add user translation message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user_translation',
      content: userTranslation,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Analyze translation
    try {
      const analysis = await analyzeTranslation({
        originalText: currentGeneratedText,
        userTranslation,
        sourceLanguage: config?.sourceLanguage,
        targetLanguage: config?.targetLanguage,
        textId: textId || 'generated-text-id'
      });

      if (analysis) {
        // Add AI feedback message
        const feedbackMessage: Message = {
          id: `feedback-${Date.now()}`,
          type: 'ai_feedback',
          content: analysis.correctTranslation,
          timestamp: new Date(),
          metadata: {
            score: analysis.score,
            feedback: analysis.feedback,
            errors: analysis.errors
          }
        };
        setMessages(prev => [...prev, feedbackMessage]);
      }
    } catch (error) {
      console.error('Translation analysis failed:', error);
    }

    // Clear input
    setUserTranslation('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitTranslation();
    }
  };

  const handleGenerateNewText = async () => {
    console.log('🚀 [TranslationChat] handleGenerateNewText called');
    
    // Default configuration for quick text generation
    const defaultConfig = {
      minWords: 120,
      maxWords: 300, // Updated to match backend
      difficulty: 'intermediate' as const,
      sourceLanguage: 'spanish' as const,
      targetLanguage: 'english' as const,
      mustUseWords: [],
      grammarTopics: [],
      topic: 'general'
    };

    console.log('⚙️ [TranslationChat] Using config:', defaultConfig);
    await generateText(defaultConfig, chatId);
  };

  const loadChatMessages = async (chatId: string) => {
    try {
      console.log('🔄 [TranslationChat] Loading messages for chat:', chatId);
      
      // Get chat details with messages from the API
      const chatDetails = await translationService.getChatDetails(chatId);
      console.log('📥 [TranslationChat] Chat details received:', {
        hasChatDetails: !!chatDetails,
        hasMessages: !!chatDetails?.messages,
        messageCount: chatDetails?.messages?.length || 0
      });
      
      if (chatDetails && chatDetails.messages) {
        setMessages(chatDetails.messages);
        console.log('✅ [TranslationChat] Messages loaded:', chatDetails.messages.length);
        
        // Find the latest generated text and user translation
        const lastGeneratedText = chatDetails.messages
          .filter((msg: any) => msg.type === 'generated_text')
          .slice(-1)[0];
        
        const lastUserTranslation = chatDetails.messages
          .filter((msg: any) => msg.type === 'user_translation')
          .slice(-1)[0];
        
        console.log('🔍 [TranslationChat] Found messages:', {
          hasGeneratedText: !!lastGeneratedText,
          hasUserTranslation: !!lastUserTranslation
        });
        
        setCurrentGeneratedText(lastGeneratedText?.content || '');
        setUserTranslation(lastUserTranslation?.content || '');
      } else {
        // New chat or no messages yet
        console.log('🆕 [TranslationChat] New chat or no messages, resetting state');
        setMessages([]);
        setCurrentGeneratedText('');
        setUserTranslation('');
      }
      
    } catch (error) {
      console.error('❌ [TranslationChat] Failed to load chat messages:', error);
      // On error, reset to empty state
      setMessages([]);
      setCurrentGeneratedText('');
      setUserTranslation('');
    }
  };

  const getLanguageInfo = () => {
    if (!config) return null;
    return {
      source: config.sourceLanguage || 'spanish',
      target: config.targetLanguage || 'english',
      sourceFlag: getLanguageFlag(config.sourceLanguage || 'spanish'),
      targetFlag: getLanguageFlag(config.targetLanguage || 'english')
    };
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'spanish': return '🇪🇸';
      case 'english': return '🇺🇸';
      case 'portuguese': return '🇵🇹';
      default: return '🌐';
    }
  };

  const languageInfo = getLanguageInfo();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Translation Practice</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleGenerateNewText} disabled={generating}>
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
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <Zap className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p>No messages yet</p>
                <p className="text-sm">Configure your practice session to get started</p>
                {generating && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-primary font-medium">Generating your first text...</p>
                    <p className="text-sm text-primary/70">Please wait while we create your practice material</p>
                  </div>
                )}
              </div>
              <Button onClick={onOpenConfig} disabled={generating}>
                <Settings className="h-4 w-4 mr-2" />
                {generating ? 'Generating...' : 'Configure Practice'}
              </Button>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={message.type === 'generated_text' ? onOpenConfig : undefined}
              />
            ))
          )}
          
          {generating && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 animate-pulse text-primary" />
                <span className="font-medium text-foreground">Generating text...</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      {currentGeneratedText && (
        <div className="p-6 border-t border-border bg-card">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Translate to {languageInfo?.targetFlag} {languageInfo?.target}
              </Badge>
            </div>
            
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
            
            <div className="text-xs text-muted-foreground">
              Press Enter to submit • Shift+Enter for new line
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
