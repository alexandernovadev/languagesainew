import { useEffect, useRef, useCallback, useState } from "react";
import { speakMessageContent } from "@/shared/components/chat/ChatMessageBubble";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "@/shared/hooks/useChat";
import { ChatMessageBubble } from "@/shared/components/chat/ChatMessageBubble";
import { ChatInput } from "@/shared/components/chat/ChatInput";
import { WordDetailModal } from "@/shared/components/dialogs/WordDetailModal";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { wordService } from "@/services/wordService";
import { toast } from "sonner";

export default function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { chat, loading, sending, sendMessage, correctMessage, refreshChat } = useChat(id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevSendingRef = useRef(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  const handleWordClick = useCallback(
    async (word: string) => {
      const cleanWord = word.trim().replace(/^\W+|\W+$/g, "");
      if (!cleanWord || /\s/.test(cleanWord)) return;
      if (!chat) return;

      const isVocabWord = chat.wordTexts?.some(
        (w) => w.toLowerCase() === cleanWord.toLowerCase()
      );
      if (!isVocabWord) return;

      let wordId: string | null = null;

      if (chat.wordTexts?.length && chat.wordIds?.length) {
        const idx = chat.wordTexts.findIndex(
          (w) => w.toLowerCase() === cleanWord.toLowerCase()
        );
        if (idx >= 0) wordId = chat.wordIds[idx];
      }

      if (!wordId) {
        try {
          const foundWord = await wordService.getWordByName(cleanWord);
          wordId = foundWord?._id ?? null;
        } catch (err: any) {
          if (err?.response?.status !== 404) {
            toast.error(err?.response?.data?.message || err?.message || "Error al buscar la palabra");
          }
        }
      }

      if (wordId) {
        setSelectedWordId(wordId);
        setDetailModalOpen(true);
      }
    },
    [chat]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    const wasSending = prevSendingRef.current;
    prevSendingRef.current = sending;

    if (wasSending && !sending && chat?.messages?.length) {
      const lastMsg = chat.messages[chat.messages.length - 1];
      if (lastMsg.role === "assistant" && lastMsg.content.trim()) {
        speakMessageContent(lastMsg.content, false);
      }
    }
  }, [sending, chat?.messages]);

  if (loading && !chat) {
    return (
      <div className="flex flex-col h-[calc(100dvh-theme(spacing.4))] sm:h-[calc(100vh-theme(spacing.4))]">
        <div className="flex items-center gap-3 p-4 border-b">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full max-w-[80%]" />
          ))}
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-muted-foreground mb-4">Chat no encontrado</p>
        <Button variant="outline" onClick={() => navigate("/chats")}>
          Volver a chats
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-theme(spacing.4))] sm:h-[calc(100vh-theme(spacing.4))] max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl"
          onClick={() => navigate("/chats")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{chat.title}</h1>
          <p className="text-xs text-muted-foreground">
            {chat.status === "completed" ? "Completado" : "En curso"}
          </p>
        </div>
        {chat.status === "completed" && (
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
        )}
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pb-0 space-y-4 min-h-0"
      >
        {chat.messages.map((msg, i) => (
          <ChatMessageBubble
            key={i}
            message={msg}
            messageIndex={i}
            correction={msg.role === "user" ? chat.corrections?.[String(i)] : undefined}
            showCorrection={
              msg.role === "user" &&
              (chat.status !== "completed" || !!chat.corrections?.[String(i)])
            }
            vocabularyWords={chat.wordTexts}
            onWordClick={handleWordClick}
            onRequestCorrection={correctMessage}
          />
        ))}
        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-muted/80 border border-border/50">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {chat.status !== "completed" && (
        <div className="flex-shrink-0">
          <ChatInput
            onSend={sendMessage}
            disabled={sending}
            placeholder="Escribe tu respuesta..."
          />
        </div>
      )}

      {chat.status === "completed" && (
        <div className="flex-shrink-0 p-4 border-t border-border bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground">
            Has practicado todas las palabras. ¡Bien hecho!
          </p>
        </div>
      )}

      <WordDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        wordId={selectedWordId}
        onWordUpdate={refreshChat}
      />
    </div>
  );
}
