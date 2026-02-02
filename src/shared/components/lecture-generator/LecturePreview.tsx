import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import { Save, RefreshCw, Copy, Edit, Loader2 } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import { toast } from "sonner";

interface LecturePreviewProps {
  generatedText: string;
  isGenerating: boolean;
  onSave: () => Promise<void>;
  onRegenerate: () => Promise<void>;
  onCopy: () => void;
  onEdit?: () => void;
  className?: string;
}

export function LecturePreview({
  generatedText,
  isGenerating,
  onSave,
  onRegenerate,
  onCopy,
  onEdit,
  className,
}: LecturePreviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll durante streaming
  useEffect(() => {
    if (isGenerating && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [generatedText, isGenerating]);

  // Scroll al final cuando termina la generación
  useEffect(() => {
    if (!isGenerating && generatedText && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isGenerating, generatedText]);

  const handleCopy = () => {
    if (!generatedText.trim()) {
      toast.error("No hay texto para copiar");
      return;
    }
    navigator.clipboard.writeText(generatedText);
    toast.success("Texto copiado al portapapeles");
    onCopy();
  };

  const showActions = !isGenerating && generatedText.trim().length > 0;

  return (
    <div
      className={cn(
        "relative flex flex-col border rounded-lg bg-card",
        className
      )}
      style={{ height: "600px" }}
    >
      {/* Área de preview (scrollable) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 min-h-0"
      >
        {isGenerating && !generatedText && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Generando lectura...</p>
            </div>
          </div>
        )}

        {generatedText && (
          <div className="space-y-4">
            <MarkdownRenderer content={generatedText} variant="reading" />
            <div ref={messagesEndRef} />
          </div>
        )}

        {!isGenerating && !generatedText && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>La lectura generada aparecerá aquí...</p>
          </div>
        )}
      </div>

      {/* Botones sticky (solo visible cuando stream termine) */}
      {showActions && (
        <div className="sticky bottom-0 bg-background border-t p-4 flex gap-2 justify-end flex-shrink-0">
          <Button variant="outline" onClick={handleCopy} size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button variant="outline" onClick={onRegenerate} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerar
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          <Button onClick={onSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      )}

      {/* Indicador de generación en curso */}
      {isGenerating && generatedText && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t p-2 flex items-center justify-center gap-2 text-sm text-muted-foreground flex-shrink-0">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generando...</span>
        </div>
      )}
    </div>
  );
}
