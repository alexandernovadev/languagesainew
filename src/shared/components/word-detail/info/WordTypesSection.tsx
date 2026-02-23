import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Sparkles, Tag } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { cn } from "@/utils/common/classnames";

interface WordTypesSectionProps {
  word: IWord;
  onRefresh: () => void;
  loading: boolean;
}

export function WordTypesSection({ word, onRefresh, loading }: WordTypesSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Tag className="h-4 w-4 text-primary" />
            Tipos Gramaticales
          </CardTitle>
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            size="icon"
            title="Generar tipos con AI"
            className="h-7 w-7"
          >
            <Sparkles className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {word.type && word.type.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {word.type.map((type, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2.5 py-1 border-primary/30 hover:border-primary/50 transition-colors"
              >
                {type}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Tag className="h-8 w-8 mx-auto mb-1 opacity-50" />
            <p className="text-xs md:text-sm">No hay tipos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
