import { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/common/classnames';

interface SelectionSpeakerButtonProps {
  text: string;
  onComplete?: () => void;
  onKeepVisible?: () => void;
  className?: string;
}

export const SelectionSpeakerButton = ({ 
  text, 
  onComplete,
  onKeepVisible,
  className 
}: SelectionSpeakerButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = useCallback(async () => {
    if (!text.trim() || isPlaying) return;

    try {
      // Cancelar cualquier síntesis de voz en curso
      speechSynthesis.cancel();

      setIsPlaying(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Promesa para manejar el evento de finalización
      const speakPromise = new Promise<void>((resolve, reject) => {
        utterance.onend = () => {
          setIsPlaying(false);
          // Mantener el tooltip visible
          onKeepVisible?.();
          resolve();
        };

        utterance.onerror = (event) => {
          setIsPlaying(false);
          console.error('Error en síntesis de voz:', event.error);
          reject(new Error(event.error));
        };
      });

      speechSynthesis.speak(utterance);
      
      await speakPromise;
      
      // Llamar callback después de completar (pero sin ocultar el tooltip)
      onComplete?.();
      
    } catch (error) {
      console.error('Error al reproducir audio:', error);
      setIsPlaying(false);
    }
  }, [text, isPlaying, onComplete]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSpeak}
      disabled={isPlaying}
      className={cn(
        "h-8 w-8 p-0 bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-600/50",
        "transition-all duration-200 hover:scale-105",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      data-selection-tooltip="button"
    >
      <Volume2
        className={cn(
          "h-4 w-4 text-blue-400 transition-all duration-200",
          isPlaying && "animate-pulse text-blue-300"
        )}
      />
    </Button>
  );
};
