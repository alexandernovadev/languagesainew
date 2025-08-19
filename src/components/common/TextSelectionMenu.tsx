import { memo, useCallback, useState } from 'react';
import { Volume2, FileText, Hash } from 'lucide-react';
import { cn } from '@/utils/common/classnames';
import { toast } from 'sonner';
import { SPEECH_RATES } from '../../speechRates';

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

  // Funciones internas del menú
  const handleSpeakText = useCallback((text: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = SPEECH_RATES.NORMAL;
    utterance.lang = "en-US";

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
    
    toast.success(`🔊 "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`, {
      description: "Reproduciendo audio...",
    });
  }, [isPlaying]);

  const handleCreateWord = useCallback((text: string) => {
    toast.success(`📖 Crear palabra: "${text}"`, {
      description: "Se abrirá el formulario de nueva palabra",
      action: {
        label: "Crear",
        onClick: () => {
          console.log('Crear palabra con texto:', text);
        }
      }
    });
  }, []);

  const handleCreateExpression = useCallback((text: string) => {
    toast.success(`📝 Crear expresión: "${text}"`, {
      description: "Se abrirá el formulario de nueva expresión",
      action: {
        label: "Crear",
        onClick: () => {
          console.log('Crear expresión con texto:', text);
        }
      }
    });
  }, []);

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
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-md",
          "hover:bg-zinc-800 transition-colors duration-150",
          "text-green-400 hover:text-green-300"
        )}
        title="Crear palabra"
      >
        <Hash className="h-4 w-4" />
        <span className="text-xs">Palabra</span>
      </button>

      {/* Crear Expresión */}
      <button
        onClick={() => handleAction(() => handleCreateExpression(selectedText))}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-md",
          "hover:bg-zinc-800 transition-colors duration-150",
          "text-yellow-400 hover:text-yellow-300"
        )}
        title="Crear expresión"
      >
        <FileText className="h-4 w-4" />
        <span className="text-xs">Expresión</span>
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
