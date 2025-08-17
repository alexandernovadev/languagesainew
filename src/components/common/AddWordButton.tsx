import { useState, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/common/classnames';
import { useWordStore } from '@/lib/store/useWordStore';
import { toast } from 'sonner';

interface AddWordButtonProps {
  text: string;
  onComplete?: () => void;
  onKeepVisible?: () => void;
  className?: string;
}

export const AddWordButton = ({ 
  text, 
  onComplete,
  onKeepVisible,
  className 
}: AddWordButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateWord } = useWordStore();

  const handleAddWord = useCallback(async () => {
    if (!text.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      onKeepVisible?.();

      // Limpiar el texto seleccionado para obtener solo la palabra
      const cleanText = text.trim().split(/\s+/)[0]; // Tomar solo la primera palabra
      
      // Generar la palabra usando el texto seleccionado
      const generatedWord = await generateWord(cleanText);
      
      if (generatedWord) {
        toast.success("Palabra agregada exitosamente", {
          description: `"${cleanText}" ha sido agregada a tu vocabulario`,
        });
        onComplete?.();
      } else {
        toast.error("Error al agregar palabra", {
          description: "No se pudo generar la palabra. Intenta de nuevo.",
        });
      }
      
    } catch (error) {
      console.error('Error al agregar palabra:', error);
      toast.error("Error al agregar palabra", {
        description: "Hubo un problema al procesar el texto seleccionado.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [text, isGenerating, generateWord, onComplete, onKeepVisible]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddWord}
      disabled={isGenerating}
      className={cn(
        "h-8 w-8 p-0 bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-600/50",
        "transition-all duration-200 hover:scale-105",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      data-selection-tooltip="button"
      title="Agregar como palabra"
    >
      <BookOpen
        className={cn(
          "h-4 w-4 text-purple-400 transition-all duration-200",
          isGenerating && "animate-pulse text-purple-300"
        )}
      />
    </Button>
  );
};
