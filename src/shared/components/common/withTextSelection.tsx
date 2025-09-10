import React, { useState, useEffect, useCallback, useRef } from "react";
import { TextSelectionMenu } from "./TextSelectionMenu";

interface TextSelectionState {
  selectedText: string;
  position: { x: number; y: number } | null;
  showMenu: boolean;
}

interface UseTextSelectionOptions {
  containerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * HOC basado en el hook useTextSelection que ya funciona
 * Solo para la definición, sin tocar los ejemplos
 */
export const withTextSelection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: UseTextSelectionOptions = {}
) => {
  const { containerRef } = options;
  
  return React.forwardRef<any, P>((props, ref) => {
    const [selectionState, setSelectionState] = useState<TextSelectionState>({
      selectedText: "",
      position: null,
      showMenu: false,
    });

    // Throttle para optimizar el scroll
    const throttleRef = useRef<NodeJS.Timeout | null>(null);

    const clearSelection = useCallback(() => {
      setSelectionState({
        selectedText: "",
        position: null,
        showMenu: false,
      });
      window.getSelection()?.removeAllRanges();
    }, []);

    useEffect(() => {
      const handleTextSelection = () => {
        const selection = window.getSelection();
        
        if (!selection || selection.isCollapsed || selection.toString().trim() === "") {
          setSelectionState(prev => ({ ...prev, showMenu: false }));
          return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Calcular posición del menú relativa al contenedor
        let menuPosition: { x: number; y: number };
        
        if (containerRef?.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          menuPosition = {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top - 25  // Un poco más abajo
          };
        } else {
          // Fallback a posición absoluta al documento
          menuPosition = {
            x: rect.left + window.scrollX + (rect.width / 2),
            y: rect.top + window.scrollY - 10
          };
        }
        
        setSelectionState({
          selectedText: selection.toString(),
          position: menuPosition,
          showMenu: true,
        });
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (selectionState.showMenu && selectionState.position) {
          // Si el clic no es en el menú, limpiar selección
          const target = event.target as HTMLElement;
          if (!target.closest("[data-selection-menu]")) {
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
          // Verificar si hay selección activa en tiempo real
          const selection = window.getSelection();
          if (selection && !selection.isCollapsed && selection.toString().trim() !== "") {
            try {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              
              // Verificar que la selección esté dentro del contenedor si hay uno
              if (containerRef?.current) {
                const isWithinContainer = containerRef.current.contains(range.commonAncestorContainer);
                if (!isWithinContainer) {
                  return;
                }
              }
              
              // Actualizar posición del menú relativa al contenedor
              let newPosition: { x: number; y: number };
              
              if (containerRef?.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                newPosition = {
                  x: rect.left - containerRect.left,
                  y: rect.top - containerRect.top - 25  // Un poco más abajo
                };
              } else {
                // Fallback a posición absoluta al documento
                newPosition = {
                  x: rect.left + window.scrollX + (rect.width / 2),
                  y: rect.top + window.scrollY - 10
                };
              }
              
              setSelectionState(prev => ({ ...prev, position: newPosition }));
            } catch (error) {
              // Si hay error, mantener el menú pero no actualizar posición
              console.warn('Error updating menu position on scroll:', error);
            }
          }
        }, 10); // Throttle de 10ms para suavidad
      };

      document.addEventListener("selectionchange", handleTextSelection);
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { passive: true });
      
      // También escuchar scroll en contenedores con scroll
      if (containerRef?.current) {
        containerRef.current.addEventListener("scroll", handleScroll, { passive: true });
      }

      return () => {
        document.removeEventListener("selectionchange", handleTextSelection);
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll);
        
        if (containerRef?.current) {
          containerRef.current.removeEventListener("scroll", handleScroll);
        }
        
        // Limpiar throttle
        if (throttleRef.current) {
          clearTimeout(throttleRef.current);
        }
      };
    }, [selectionState.showMenu, clearSelection]);

    return (
      <>
        <WrappedComponent {...(props as P)} ref={ref} />
        
        {/* Menú de selección de texto */}
        {selectionState.showMenu && selectionState.position && (
          <TextSelectionMenu
            selectedText={selectionState.selectedText}
            position={selectionState.position}
            show={selectionState.showMenu}
            onClose={clearSelection}
          />
        )}
      </>
    );
  });
};
