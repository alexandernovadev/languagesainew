import { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/common/classnames';
import { useExpressionStore } from '@/lib/store/useExpressionStore';
import { toast } from 'sonner';

interface AddExpressionButtonProps {
  text: string;
  onComplete?: () => void;
  onKeepVisible?: () => void;
  className?: string;
}

export const AddExpressionButton = ({ 
  text, 
  onComplete,
  onKeepVisible,
  className 
}: AddExpressionButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateExpression, createExpression } = useExpressionStore();

  const handleAddExpression = useCallback(async () => {
    if (!text.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      onKeepVisible?.();

      // Paso 1: Generar la expresión usando el texto seleccionado
      const generatedExpression = await generateExpression(text);
      
      if (generatedExpression) {
        // Paso 2: Guardar la expresión generada en la DB
        await createExpression(generatedExpression);
        
        toast.success("Expresión agregada exitosamente", {
          description: `"${text}" ha sido agregada a tus expresiones`,
        });
        onComplete?.();
      } else {
        toast.error("Error al agregar expresión", {
          description: "No se pudo generar la expresión. Intenta de nuevo.",
        });
      }
      
    } catch (error) {
      console.error('Error al agregar expresión:', error);
      toast.error("Error al agregar expresión", {
        description: "Hubo un problema al procesar el texto seleccionado.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [text, isGenerating, generateExpression, onComplete, onKeepVisible]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddExpression}
      disabled={isGenerating}
      className={cn(
        "h-8 w-8 p-0 bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-600/50",
        "transition-all duration-200 hover:scale-105",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      data-selection-tooltip="button"
      title="Agregar como expresión"
    >
      <FileText
        className={cn(
          "h-4 w-4 text-green-400 transition-all duration-200",
          isGenerating && "animate-pulse text-green-300"
        )}
      />
    </Button>
  );
};
