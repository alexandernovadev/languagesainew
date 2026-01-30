import { BookOpen, Languages } from "lucide-react";
import { IWord } from "@/types/models/Word";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface WordDefinitionSectionProps {
  word: IWord;
}

export function WordDefinitionSection({ word }: WordDefinitionSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-primary" />
          Definición
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2">
        <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
          <p className="text-sm text-foreground leading-relaxed">
            {word.definition}
          </p>
        </div>
        {word.spanish?.definition && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-center gap-2 mb-1">
              <Languages className="h-3 w-3 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">
                Traducción
              </span>
            </div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 leading-relaxed">
              {word.spanish.definition}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
