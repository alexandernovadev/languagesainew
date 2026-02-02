import { Badge } from "@/shared/components/ui/badge";
import { Language, CertificationLevel, ReadingType } from "@/types/business";
import {
  languagesJson,
  certificationLevelsJson,
  readingTypesJson,
} from "@/data/bussiness/shared";
import { cn } from "@/utils/common/classnames";

interface LectureParams {
  language: Language;
  level: CertificationLevel;
  typeWrite: ReadingType;
  rangeMin: number;
  rangeMax: number;
  addEasyWords: boolean;
  grammarTopics: string[];
  selectedWords: string[];
}

interface ParamsSummaryProps {
  params: LectureParams;
  onBadgeClick?: (param: keyof LectureParams) => void;
  className?: string;
}

export function ParamsSummary({
  params,
  onBadgeClick,
  className,
}: ParamsSummaryProps) {
  const getLanguageLabel = (value: Language) => {
    return languagesJson.find((l) => l.value === value)?.label || value;
  };

  const getLevelLabel = (value: CertificationLevel) => {
    return certificationLevelsJson.find((l) => l.value === value)?.label || value;
  };

  const getTypeLabel = (value: ReadingType) => {
    return readingTypesJson.find((t) => t.value === value)?.label || value;
  };

  const hasAdvancedOptions =
    params.addEasyWords ||
    params.grammarTopics.length > 0 ||
    params.selectedWords.length > 0;

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer hover:bg-primary/10 transition-colors",
          onBadgeClick && "cursor-pointer"
        )}
        onClick={() => onBadgeClick?.("language")}
      >
        Idioma: {getLanguageLabel(params.language)}
      </Badge>

      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer hover:bg-primary/10 transition-colors",
          onBadgeClick && "cursor-pointer"
        )}
        onClick={() => onBadgeClick?.("level")}
      >
        Nivel: {getLevelLabel(params.level)}
      </Badge>

      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer hover:bg-primary/10 transition-colors",
          onBadgeClick && "cursor-pointer"
        )}
        onClick={() => onBadgeClick?.("typeWrite")}
      >
        Tipo: {getTypeLabel(params.typeWrite)}
      </Badge>

      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer hover:bg-primary/10 transition-colors",
          onBadgeClick && "cursor-pointer"
        )}
        onClick={() => onBadgeClick?.("rangeMin")}
      >
        Palabras: {params.rangeMin}-{params.rangeMax}
      </Badge>

      {hasAdvancedOptions && (
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onBadgeClick?.("addEasyWords")}
        >
          +{[
            params.addEasyWords && "Palabras fáciles",
            params.grammarTopics.length > 0 &&
              `${params.grammarTopics.length} temas gramática`,
            params.selectedWords.length > 0 &&
              `${params.selectedWords.length} palabras`,
          ]
            .filter(Boolean)
            .join(", ")}
        </Badge>
      )}
    </div>
  );
}
