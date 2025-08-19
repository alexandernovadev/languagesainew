import { memo, useCallback, useState } from 'react';
import { Volume2, FileText, Hash } from 'lucide-react';
import { cn } from '@/utils/common/classnames';
import { toast } from 'sonner';
import { SPEECH_RATES } from '../../speechRates';
import { useWordStore } from '@/lib/store/useWordStore';
import { useExpressionStore } from '@/lib/store/useExpressionStore';

interface TextSelectionMenuProps {
  selectedText: string;
  position: { x: number; y: number } | null;
  show: boolean;
  onClose?: () => void;
}

export const TextSelectionMenu = memo(function TextSelectionMenu({
  selectedText,
  position,
  show,
  onClose
}: TextSelectionMenuProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCreatingWord, setIsCreatingWord] = useState(false);
  const [isCreatingExpression, setIsCreatingExpression] = useState(false);

  // Stores para crear palabras y expresiones
  const { generateWord } = useWordStore();
  const { generateExpression, createExpression } = useExpressionStore();

  // Funciones internas del menú
  const handleSpeakText = useCallback((text: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    
    // Limpiar HTML tags, bullets al inicio/final y espacios extra
    let cleanText = text
      .replace(/<[^>]*>/g, '') // Eliminar HTML tags
      .replace(/^[\s•·▪▫◦‣⁃⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞]+/, '') // Eliminar bullets al inicio
      .replace(/[\s•·▪▫◦‣⁃⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞]+$/, '') // Eliminar bullets al final
      .replace(/\s+/g, ' ') // Normalizar espacios múltiples
      .trim(); // Eliminar espacios al inicio y final
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = SPEECH_RATES.NORMAL;
    utterance.lang = "en-US";

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  }, [isPlaying]);

  const handleCreateWord = useCallback(async (text: string) => {
    if (isCreatingWord) return; // Evitar clics múltiples
    
    setIsCreatingWord(true);
    try {
      await generateWord(text.trim());
      toast.success(`📖 Palabra "${text}" creada exitosamente`);
      onClose?.();
    } catch (error) {
      toast.error("Error al crear la palabra");
    } finally {
      setIsCreatingWord(false);
    }
  }, [generateWord, onClose, isCreatingWord]);

  const handleCreateExpression = useCallback(async (text: string) => {
    if (isCreatingExpression) return; // Evitar clics múltiples
    
    setIsCreatingExpression(true);
    try {
      // Primero generar la expresión
      const generatedExpression = await generateExpression(text.trim());
      
      if (generatedExpression) {
        // Luego guardarla en la base de datos
        await createExpression(generatedExpression);
        toast.success(`📝 Expresión "${text}" creada exitosamente`);
        onClose?.();
      } else {
        throw new Error("No se pudo generar la expresión");
      }
    } catch (error) {
      toast.error("Error al crear la expresión");
    } finally {
      setIsCreatingExpression(false);
    }
  }, [generateExpression, createExpression, onClose, isCreatingExpression]);

  if (!show || !position || !selectedText) {
    return null;
  }

  const handleAction = (action: () => void) => {
    action();
    // No cerrar el menú automáticamente
  };

  return (
    <div
      data-selection-menu
      className={cn(
        "absolute z-[9999] bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg",
        "flex items-center gap-1 p-1 text-white text-sm",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateY(-100%)',
      }}
    >
      {/* Escuchar */}
      <button
        onClick={() => handleAction(() => handleSpeakText(selectedText))}
        className={cn(
          "flex items-center justify-center px-2 py-1.5 rounded-md",
          "hover:bg-zinc-800 transition-colors duration-150",
          "text-purple-400 hover:text-purple-300",
          isPlaying && "animate-pulse"
        )}
        title="Escuchar texto"
        disabled={isPlaying}
      >
        <Volume2 className="h-4 w-4" />
      </button>

      {/* Crear Palabra */}
      <button
        onClick={() => handleAction(() => handleCreateWord(selectedText))}
        disabled={isCreatingWord}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-md",
          "hover:bg-zinc-800 transition-colors duration-150",
          "text-green-400 hover:text-green-300",
          isCreatingWord && "opacity-50 cursor-not-allowed"
        )}
        title="Crear palabra"
      >
        <Hash className={cn("h-4 w-4", isCreatingWord && "animate-spin")} />
        <span className="text-xs">
          {isCreatingWord ? "Creando..." : "Palabra"}
        </span>
      </button>

      {/* Crear Expresión */}
      <button
        onClick={() => handleAction(() => handleCreateExpression(selectedText))}
        disabled={isCreatingExpression}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-md",
          "hover:bg-zinc-800 transition-colors duration-150",
          "text-yellow-400 hover:text-yellow-300",
          isCreatingExpression && "opacity-50 cursor-not-allowed"
        )}
        title="Crear expresión"
      >
        <FileText className={cn("h-4 w-4", isCreatingExpression && "animate-spin")} />
        <span className="text-xs">
          {isCreatingExpression ? "Creando..." : "Expresión"}
        </span>
      </button>

      {/* Flecha hacia abajo */}
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2"
        style={{ marginTop: '-1px' }}
      >
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-700"></div>
        <div
          className="w-0 h-0 border-l-3 border-r-3 border-t-3 border-l-transparent border-r-transparent border-t-zinc-900 absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{ marginTop: '-1px' }}
        ></div>
      </div>
    </div>
  );
});
