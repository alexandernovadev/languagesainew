import { BookOpen, Languages } from "lucide-react";
import { IWord } from "@/types/models/Word";

interface WordDefinitionSectionProps {
  word: IWord;
}

export function WordDefinitionSection({ word }: WordDefinitionSectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold">
        <BookOpen className="h-4 w-4 text-primary shrink-0" />
        Definición
      </h3>
      <div className="space-y-2">
        <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            {word.definition}
          </p>
        </div>
        {word.spanish?.definition && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-center gap-2 mb-1">
              <Languages className="h-3 w-3 md:h-4 md:w-4 text-amber-700 dark:text-amber-400" />
              <span className="text-xs md:text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase">
                Traducción
              </span>
            </div>
            <p className="text-sm md:text-base font-semibold text-amber-700 dark:text-amber-400 leading-relaxed">
              {word.spanish.definition}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
