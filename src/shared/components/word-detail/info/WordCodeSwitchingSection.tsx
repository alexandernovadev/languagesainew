import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Sparkles, Languages } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { cn } from "@/utils/common/classnames";

interface WordCodeSwitchingSectionProps {
  word: IWord;
  onRefresh: () => void;
  loading: boolean;
}

export function WordCodeSwitchingSection({ word, onRefresh, loading }: WordCodeSwitchingSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Languages className="h-4 w-4 text-primary" />
            Code-Switching
          </CardTitle>
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            size="icon"
            title="Generar code-switching con AI"
            className="h-7 w-7"
          >
            <Sparkles className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {word.codeSwitching && word.codeSwitching.length > 0 ? (
          <div className="space-y-2">
            {word.codeSwitching.map((example, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-semibold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground flex-1 leading-relaxed">{example}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Languages className="h-8 w-8 mx-auto mb-1 opacity-50" />
            <p className="text-xs">No hay ejemplos de code-switching disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
