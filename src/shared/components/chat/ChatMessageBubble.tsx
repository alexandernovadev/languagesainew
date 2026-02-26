import { useState } from "react";
import { User, Bot, Volume2, Pencil } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  wrapVocabularyInHtml,
  renderPlainTextWithHighlights,
} from "@/shared/components/chat/HighlightVocabulary";
import type { IChatMessage } from "@/types/models/Chat";

export function stripMarkdownForSpeech(md: string): string {
  return md
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function speakMessageContent(content: string, isFromUser: boolean) {
  if (!("speechSynthesis" in window)) return;
  const text = isFromUser ? content : stripMarkdownForSpeech(content);
  if (!text.trim()) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1.1;
  window.speechSynthesis.speak(utterance);
}

interface ChatMessageBubbleProps {
  message: IChatMessage;
  messageIndex?: number;
  correction?: string;
  showCorrection?: boolean;
  vocabularyWords?: string[];
  onWordClick?: (word: string) => void;
  onRequestCorrection?: (messageIndex: number) => Promise<void>;
}

export function ChatMessageBubble({
  message,
  messageIndex = 0,
  correction,
  showCorrection = true,
  vocabularyWords,
  onWordClick,
  onRequestCorrection,
}: ChatMessageBubbleProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loadingCorrection, setLoadingCorrection] = useState(false);
  const isUser = message.role === "user";

  const speakMessage = () => speakMessageContent(message.content, isUser);

  const handleCorrectionClick = async () => {
    if (correction) {
      setPopoverOpen(true);
      return;
    }
    if (!onRequestCorrection || messageIndex < 0) return;
    setLoadingCorrection(true);
    try {
      await onRequestCorrection(messageIndex);
      setPopoverOpen(true);
    } finally {
      setLoadingCorrection(false);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[85%] sm:max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm",
            isUser
              ? "border border-green-500 dark:border-green-400 rounded-br-md text-foreground"
              : "bg-muted/80 text-foreground rounded-bl-md border border-white dark:border-white/80"
          )}
        >
          {isUser ? (
            <p className="m-0">
              {renderPlainTextWithHighlights(
                message.content,
                vocabularyWords ?? [],
                onWordClick
              )}
            </p>
          ) : (
            <MarkdownRenderer
              content={wrapVocabularyInHtml(
                message.content,
                vocabularyWords ?? []
              )}
              variant="chat"
              onWordClick={onWordClick}
              clickableWords={vocabularyWords}
            />
          )}
        </div>
        {!isUser && (
          <button
            type="button"
            onClick={speakMessage}
            className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            title="Escuchar en inglés"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Escuchar</span>
          </button>
        )}
        {isUser && showCorrection && onRequestCorrection && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={handleCorrectionClick}
                disabled={loadingCorrection}
                className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>
                  {loadingCorrection
                    ? "Corrigiendo..."
                    : correction
                      ? "Ver corrección"
                      : "Corregir mi inglés"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align={isUser ? "end" : "start"}
              side="top"
              className="!w-[calc(100vw-2rem)] sm:!w-[min(500px,calc(100vw-2rem))] border-2 border-blue-500 dark:border-blue-400 [&_strong]:!text-blue-500 [&_strong]:dark:!text-blue-400"
            >
              {correction ? (
                <MarkdownRenderer
                  content={`**Tú:** ${message.content}\n\n${correction}`}
                  variant="chat"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Cargando corrección...
                </p>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
}
