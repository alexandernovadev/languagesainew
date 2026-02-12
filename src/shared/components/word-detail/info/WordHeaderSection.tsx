import { Volume2, Languages, TrendingUp, Sparkles } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { getDifficultyVariant } from "@/utils/common";
import { cn } from "@/utils/common/classnames";

interface WordHeaderSectionProps {
  word: IWord;
  onRefreshAll?: () => void;
  loadingAll?: boolean;
  onUpdateDifficulty?: (difficulty: string) => void;
}

export function WordHeaderSection({ word, onRefreshAll, loadingAll = false, onUpdateDifficulty }: WordHeaderSectionProps) {
  const speak = (text: string, lang: string = 'en-US', rate: number = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {onRefreshAll && (
        <Button
          onClick={onRefreshAll}
          disabled={loadingAll}
          variant="outline"
          size="icon"
          title="Refresh All Data with AI"
          className={cn(
            "absolute top-2 right-2 sm:top-3 sm:right-3 z-10 shadow-md h-9 w-9"
          )}
        >
          <Sparkles className={cn("h-4 w-4", loadingAll && "animate-spin")} />
        </Button>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold capitalize bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {word.word}
              </h1>
              <button
                onClick={() => speak(word.word, 'en-US', 1)}
                className="p-1.5 border rounded-lg hover:bg-muted transition-colors hover:scale-110"
                title="Reproducir velocidad normal"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => speak(word.word, 'en-US', 0.1)}
                className="p-1.5 border rounded-lg hover:bg-muted transition-colors hover:scale-110 text-lg leading-none"
                title="Reproducir velocidad lenta"
              >
                🐢
              </button>
            </div>
            
            {word.IPA && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  /{word.IPA}/
                </span>
              </div>
            )}
            
            {word.spanish?.word && (
              <div className="flex items-center gap-2 mb-2">
                <Languages className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <p className="text-xl capitalize text-blue-600 dark:text-blue-400 font-semibold">
                  {word.spanish.word}
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={getDifficultyVariant(word.difficulty)} className="text-sm px-3 py-1">
                {word.difficulty || "N/A"}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Visto: {word.seen || 0}
              </Badge>
              {word.language && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {word.language.toUpperCase()}
                </Badge>
              )}
            </div>
            
            {/* Botones de dificultad */}
            {onUpdateDifficulty && (
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant={getDifficultyVariant('easy')}
                  disabled={word.difficulty === 'easy'}
                  onClick={() => onUpdateDifficulty('easy')}
                  className="text-xs"
                >
                  Easy
                </Button>
                <Button
                  size="sm"
                  variant={getDifficultyVariant('medium')}
                  disabled={word.difficulty === 'medium'}
                  onClick={() => onUpdateDifficulty('medium')}
                  className="text-xs"
                >
                  Medium
                </Button>
                <Button
                  size="sm"
                  variant={getDifficultyVariant('hard')}
                  disabled={word.difficulty === 'hard'}
                  onClick={() => onUpdateDifficulty('hard')}
                  className="text-xs"
                >
                  Hard
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
