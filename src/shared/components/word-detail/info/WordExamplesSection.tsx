import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Sparkles, FileText, Volume2 } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { cn } from "@/utils/common/classnames";

interface WordExamplesSectionProps {
  word: IWord;
  onRefresh: () => void;
  loading: boolean;
}

export function WordExamplesSection({ word, onRefresh, loading }: WordExamplesSectionProps) {
  const speak = (text: string, lang: string = "en-US", rate: number = 1) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <FileText className="h-4 w-4 text-primary" />
            Ejemplos
          </CardTitle>
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            size="icon"
            title="Generar ejemplos con AI"
            className="h-7 w-7"
          >
            <Sparkles className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {word.examples && word.examples.length > 0 ? (
          <div className="space-y-2">
            {word.examples.map((example, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs md:text-sm font-semibold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm md:text-base text-foreground flex-1 leading-relaxed">{example}</p>
                <button
                  type="button"
                  onClick={() => speak(example)}
                  className="p-1.5 border rounded-lg hover:bg-muted transition-colors hover:scale-110"
                  title="Escuchar ejemplo"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-1 opacity-50" />
            <p className="text-xs md:text-sm">No hay ejemplos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
