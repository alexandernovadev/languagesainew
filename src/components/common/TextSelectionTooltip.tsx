import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SelectionSpeakerButton } from './SelectionSpeakerButton';
import { cn } from '@/utils/common/classnames';

interface TooltipPosition {
  x: number;
  y: number;
  visible: boolean;
}

interface TextSelectionTooltipProps {
  text: string;
  rect: DOMRect | null;
  isVisible: boolean;
  onHide: () => void;
  onKeepVisible: () => void;
}

export const TextSelectionTooltip = ({
  text,
  rect,
  isVisible,
  onHide,
  onKeepVisible
}: TextSelectionTooltipProps) => {
  const [position, setPosition] = useState<TooltipPosition>({
    x: 0,
    y: 0,
    visible: false
  });

  // Calcular posición del tooltip
  const calculatePosition = useCallback(() => {
    if (!rect || !isVisible) {
      setPosition(prev => ({ ...prev, visible: false }));
      return;
    }

    // Posición exactamente arriba de donde comienza la selección
    const tooltipWidth = 40; // Ancho aproximado del botón
    const tooltipHeight = 40; // Alto aproximado del botón
    const offset = 8; // Separación entre el texto y el tooltip

    // Calcular posición X: centrada en el inicio de la selección
    let x = rect.left;
    
    // Asegurar que no se salga de la pantalla horizontalmente
    if (x + tooltipWidth > window.innerWidth) {
      x = window.innerWidth - tooltipWidth - 16;
    }
    if (x < 16) {
      x = 16;
    }

    // Calcular posición Y: arriba del texto seleccionado
    let y = rect.top - tooltipHeight - offset;
    
    // Si no hay espacio arriba, colocar abajo
    if (y < 16) {
      y = rect.bottom + offset;
    }

    // Agregar scroll offset
    x += window.pageXOffset || document.documentElement.scrollLeft;
    y += window.pageYOffset || document.documentElement.scrollTop;

    setPosition({
      x,
      y,
      visible: true
    });
  }, [rect, isVisible]);

  // Actualizar posición cuando cambie la selección
  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  // Recalcular posición en resize y scroll
  useEffect(() => {
    if (!isVisible) return;

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isVisible, calculatePosition]);

  const handleSpeechComplete = useCallback(() => {
    // NO ocultar el tooltip después de reproducir el audio
    // El tooltip permanecerá visible hasta que el usuario haga clic fuera
    // o seleccione otro texto
  }, []);

  const handleMouseEnter = useCallback(() => {
    onKeepVisible();
  }, [onKeepVisible]);

  if (!position.visible || !text.trim()) {
    return null;
  }

  const tooltipElement = (
    <div
      className={cn(
        "fixed z-[9999] pointer-events-auto",
        "transform -translate-x-1/2",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      data-selection-tooltip="container"
      onMouseEnter={handleMouseEnter}
    >
      {/* Tooltip container */}
      <div className={cn(
        "bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50",
        "rounded-lg shadow-2xl shadow-black/50",
        "p-1.5",
        "before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2",
        "before:border-4 before:border-transparent before:border-b-zinc-700/50",
        "after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2",
        "after:border-4 after:border-transparent after:border-b-zinc-900/95",
        "after:translate-y-px"
      )}>
        <SelectionSpeakerButton
          text={text}
          onComplete={handleSpeechComplete}
          onKeepVisible={onKeepVisible}
          className="shadow-sm"
        />
      </div>
    </div>
  );

  // Renderizar en portal para evitar problemas de z-index
  return createPortal(tooltipElement, document.body);
};
