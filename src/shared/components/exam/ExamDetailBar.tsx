import { Badge } from "@/shared/components/ui/badge";
import { FileText } from "lucide-react";
import { languagesJson, certificationLevelsJson } from "@/data/bussiness/shared";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { grammarTopicsJson as enGrammarTopics } from "@/data/bussiness/en";
import { grammarTopicsJson as esGrammarTopics } from "@/data/bussiness/es";
import { grammarTopicsJson as ptGrammarTopics } from "@/data/bussiness/pt";

const getGrammarTopicsByLanguage = (language: string) => {
  switch (language) {
    case "es":
      return esGrammarTopics;
    case "pt":
      return ptGrammarTopics;
    default:
      return enGrammarTopics;
  }
};

const getTopicLabel = (
  topics: ReturnType<typeof getGrammarTopicsByLanguage>,
  value: string
): string => {
  for (const cat of topics) {
    const t = cat.children.find((c) => c.value === value);
    if (t) return t.label;
  }
  return value;
};

export interface ExamDetailMeta {
  language: string;
  difficulty: string;
  grammarTopics: string[];
  topic?: string;
}

interface ExamDetailBarProps {
  meta: ExamDetailMeta;
  questionCount: number;
}

export function ExamDetailBar({ meta, questionCount }: ExamDetailBarProps) {
  const langLabel = languagesJson.find((l) => l.value === meta.language)?.label ?? meta.language;
  const diffLabel =
    certificationLevelsJson.find((l) => l.value === meta.difficulty)?.label ?? meta.difficulty;
  const grammarTopicsData = getGrammarTopicsByLanguage(meta.language);
  const grammarTopicLabels = meta.grammarTopics.map((v) => getTopicLabel(grammarTopicsData, v));

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3">
      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
      <Badge variant="secondary" className="font-normal">
        Nivel: {diffLabel}
      </Badge>
      <Badge variant="secondary" className="font-normal">
        {questionCount} preguntas
      </Badge>
      <Badge variant="secondary" className="font-normal">
        Idioma: {langLabel}
      </Badge>
      {meta.grammarTopics.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="font-normal cursor-help">
                {meta.grammarTopics.length} tema{meta.grammarTopics.length > 1 ? "s" : ""} gramática
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium mb-1">Temas:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                {grammarTopicLabels.map((label, i) => (
                  <li key={i}>{label}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
