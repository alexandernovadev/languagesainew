import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { RefreshCw, Sparkles, Hash, Volume2 } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { cn } from "@/utils/common/classnames";

interface WordSynonymsSectionProps {
  word: IWord;
  onRefresh: () => void;
  loading: boolean;
}

export function WordSynonymsSection({ word, onRefresh, loading }: WordSynonymsSectionProps) {
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
          <CardTitle className="flex items-center gap-2 text-base">
            <Hash className="h-4 w-4 text-primary" />
            Sinónimos
          </CardTitle>
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className={cn(loading && "animate-pulse", "h-7")}
          >
            <Sparkles className={cn("h-3 w-3 mr-1.5", loading && "animate-spin")} />
            {loading ? "Generando..." : "AI"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {word.sinonyms && word.sinonyms.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {word.sinonyms.map((synonym, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2.5 py-1 hover:bg-secondary/80 transition-colors cursor-default flex items-center gap-1 pr-1"
              >
                <span>{synonym}</span>
                <button
                  type="button"
                  onClick={() => speak(synonym)}
                  className="p-0.5 border rounded-md hover:bg-muted transition-colors hover:scale-110"
                  title="Escuchar sinónimo"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Hash className="h-8 w-8 mx-auto mb-1 opacity-50" />
            <p className="text-xs">No hay sinónimos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
