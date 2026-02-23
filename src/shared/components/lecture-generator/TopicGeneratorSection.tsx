import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Settings, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/utils/common/classnames";

interface TopicGeneratorSectionProps {
  keywords: string;
  setKeywords: (value: string) => void;
  generatedTopic: string;
  isGeneratingTopic: boolean;
  onGenerateTopic: () => Promise<void>;
  onOpenParams: () => void;
}

export function TopicGeneratorSection({
  keywords,
  setKeywords,
  generatedTopic,
  isGeneratingTopic,
  onGenerateTopic,
  onOpenParams,
}: TopicGeneratorSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateTopic();
    } finally {
      setIsGenerating(false);
    }
  };

  const buttonText = keywords.trim()
    ? "Generar Tema desde Keywords"
    : "Generar Tema Aleatorio";

  return (
    <div className="relative space-y-4 p-4 border-t border-gray-200 dark:border-gray-800">
      {/* Botón flotante de configuración */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={onOpenParams}
        title="Configurar parámetros"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Input y botón de generación */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Keywords (opcional) o deja vacío para tema aleatorio"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          disabled={isGeneratingTopic}
          className="flex-1"
        />
        <Button
          onClick={handleGenerate}
          disabled={isGeneratingTopic || isGenerating}
          variant="default"
          className="w-full sm:w-auto"
        >
          {isGeneratingTopic || isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      </div>

      {/* Display del tema generado */}
      {generatedTopic && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Tema generado:
          </label>
          <Textarea
            readOnly
            value={generatedTopic}
            placeholder="El tema generado aparecerá aquí..."
            className={cn(
              "min-h-[100px] resize-none",
              isGeneratingTopic && "animate-pulse"
            )}
          />
        </div>
      )}

      {/* Indicador de streaming */}
      {isGeneratingTopic && !generatedTopic && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generando tema...</span>
        </div>
      )}
    </div>
  );
}
