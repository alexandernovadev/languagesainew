import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { RefreshCw, Image as ImageIcon, Sparkles } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { cn } from "@/utils/common/classnames";

interface WordImageSectionProps {
  word: IWord;
  onRefresh: () => void;
  loading: boolean;
}

export function WordImageSection({ word, onRefresh, loading }: WordImageSectionProps) {
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
          
          {/* Refresh button overlay */}
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="secondary"
            size="sm"
            className={cn(
              "absolute top-3 right-3 shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background",
              loading && "animate-pulse"
            )}
          >
            <Sparkles className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            {loading ? "Generando..." : "AI"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
