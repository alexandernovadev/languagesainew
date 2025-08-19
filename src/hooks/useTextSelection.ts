import { useState, useEffect, useCallback, useRef } from 'react';

interface TextSelectionMenuPosition {
  x: number;
  y: number;
}

interface UseTextSelectionOptions {
  onTextSelected?: (selectedText: string) => void;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const useTextSelection = (options: UseTextSelectionOptions = {}) => {
  const { onTextSelected, containerRef } = options;
  const [selectedText, setSelectedText] = useState<string>('');
  const [menuPosition, setMenuPosition] = useState<TextSelectionMenuPosition | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Throttle para optimizar el scroll
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || '';

    if (text.length > 0 && selection && selection.rangeCount > 0) {
      // Si hay un contenedor específico, verificar que la selección esté dentro de él
      if (containerRef?.current) {
        const range = selection.getRangeAt(0);
        const isWithinContainer = containerRef.current.contains(range.commonAncestorContainer);
        
        if (!isWithinContainer) {
          setShowMenu(false);
          setSelectedText('');
          return;
        }
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Calcular posición del menú
        const menuPosition: TextSelectionMenuPosition = {
          x: rect.left + window.scrollX + (rect.width / 2),
          y: rect.top + window.scrollY - 10
        };

        setSelectedText(text);
        setMenuPosition(menuPosition);
        setShowMenu(true);

        // Callback opcional
        onTextSelected?.(text);
      } catch (error) {
        console.error('Error handling text selection:', error);
        setShowMenu(false);
      }
    } else {
      setShowMenu(false);
      setSelectedText('');
      setMenuPosition(null);
    }
  }, [onTextSelected, containerRef]);

  const clearSelection = useCallback(() => {
    setShowMenu(false);
    setSelectedText('');
    setMenuPosition(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    
    // Limpiar selección al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && menuPosition) {
        // Si el clic no es en el menú, limpiar selección
        const target = event.target as HTMLElement;
        if (!target.closest('[data-selection-menu]')) {
          clearSelection();
        }
      }
    };

    // Actualizar posición del menú durante scroll (con throttle)
    const handleScroll = () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
      
      throttleRef.current = setTimeout(() => {
        if (showMenu && selectedText) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            try {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              
              // Actualizar posición del menú
              const newPosition: TextSelectionMenuPosition = {
                x: rect.left + window.scrollX + (rect.width / 2),
                y: rect.top + window.scrollY - 10
              };
              
              setMenuPosition(newPosition);
            } catch (error) {
              // Si hay error, mantener el menú pero no actualizar posición
              console.warn('Error updating menu position on scroll:', error);
            }
          }
        }
      }, 10); // Throttle de 10ms para suavidad
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // También escuchar scroll en contenedores con scroll
    if (containerRef?.current) {
      containerRef.current.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      
      if (containerRef?.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
      
      // Limpiar throttle
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [handleSelectionChange, showMenu, menuPosition, clearSelection, selectedText, containerRef]);

  return {
    selectedText,
    menuPosition,
    showMenu,
    clearSelection
  };
};
