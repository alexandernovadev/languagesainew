import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Image as ImageIcon, Sparkles, Volume2 } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { cn } from "@/utils/common/classnames";

interface WordImageSectionProps {
  word: IWord;
  onRefresh: () => void;
  loading: boolean;
}

export function WordImageSection({ word, onRefresh, loading }: WordImageSectionProps) {
  const speak = (text: string, lang: string = "en-US", rate: number = 1) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-96 flex items-center justify-center group">
          {word.img ? (
            <img
              src={word.img}
              alt={word.word}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-2 opacity-50" />
              <p className="text-sm">Sin imagen</p>
            </div>
          )}

          {/* Audio buttons - bottom left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
            <button
              onClick={() => speak(word.word, "en-US", 1)}
              className="p-2 border rounded-lg hover:bg-muted transition-colors hover:scale-110 shadow-lg backdrop-blur-sm bg-background/80"
              title="Reproducir velocidad normal"
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => speak(word.word, "en-US", 0.01)}
              className="p-2 border rounded-lg hover:bg-muted transition-colors hover:scale-110 shadow-lg backdrop-blur-sm bg-background/80 text-base leading-none"
              title="Reproducir velocidad lenta"
            >
              🐢
            </button>
          </div>

          {/* Refresh button overlay - top right */}
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="secondary"
            size="icon"
            title="Generar imagen con AI"
            className={cn(
              "absolute top-3 right-3 shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background h-9 w-9"
            )}
          >
            <Sparkles className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
