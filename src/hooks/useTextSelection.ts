import { useState, useEffect, useCallback, useRef } from 'react';

interface TextSelectionInfo {
  text: string;
  rect: DOMRect | null;
  isVisible: boolean;
}

export const useTextSelection = (containerRef?: React.RefObject<HTMLElement>) => {
  const [selection, setSelection] = useState<TextSelectionInfo>({
    text: '',
    rect: null,
    isVisible: false,
  });

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const hideSelection = useCallback(() => {
    setSelection(prev => ({ ...prev, isVisible: false }));
  }, []);

  const hideSelectionDelayed = useCallback((delay: number = 100) => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(hideSelection, delay);
  }, [hideSelection, clearHideTimeout]);

  const updateSelection = useCallback(() => {
    const windowSelection = window.getSelection();
    
    if (!windowSelection || windowSelection.rangeCount === 0) {
      hideSelectionDelayed();
      return;
    }

    const selectedText = windowSelection.toString().trim();
    
    if (selectedText.length === 0) {
      hideSelectionDelayed();
      return;
    }

    // Si hay un containerRef, verificar que la selección esté dentro del contenedor
    if (containerRef?.current) {
      const range = windowSelection.getRangeAt(0);
      const container = containerRef.current;
      
      if (!container.contains(range.commonAncestorContainer)) {
        hideSelectionDelayed();
        return;
      }
    }

    // Obtener el rango de la selección
    const range = windowSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Solo mostrar si hay texto seleccionado y tiene dimensiones válidas
    if (rect.width > 0 && rect.height > 0) {
      clearHideTimeout();
      setSelection({
        text: selectedText,
        rect,
        isVisible: true,
      });
    } else {
      hideSelectionDelayed();
    }
  }, [containerRef, hideSelectionDelayed, clearHideTimeout]);

  // Manejar eventos de selección
  useEffect(() => {
    const handleSelectionChange = () => {
      // Pequeño delay para asegurar que la selección se haya completado
      setTimeout(updateSelection, 10);
    };

    const handleMouseUp = () => {
      // Delay adicional para eventos de mouse
      setTimeout(updateSelection, 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Si el click es fuera del área de selección, ocultar
      const target = event.target as HTMLElement;
      
      // No ocultar si el click es en el tooltip o sus elementos
      if (target.closest('[data-selection-tooltip]')) {
        return;
      }

      hideSelectionDelayed(0);
    };

    // Eventos principales
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClickOutside);
      clearHideTimeout();
    };
  }, [updateSelection, hideSelectionDelayed, clearHideTimeout]);

  // Función para mantener el tooltip visible
  const keepVisible = useCallback(() => {
    clearHideTimeout();
  }, [clearHideTimeout]);

  // Función para ocultar manualmente
  const hideManually = useCallback(() => {
    hideSelection();
    // También limpiar la selección del DOM
    const windowSelection = window.getSelection();
    if (windowSelection) {
      windowSelection.removeAllRanges();
    }
  }, [hideSelection]);

  // Función para ocultar sin limpiar la selección del DOM (para mantener el texto seleccionado)
  const hideTooltipOnly = useCallback(() => {
    hideSelection();
    // NO limpiar la selección del DOM para mantener el texto resaltado
  }, [hideSelection]);

  return {
    selection,
    hideSelection: hideManually,
    hideTooltipOnly,
    keepVisible,
  };
};
