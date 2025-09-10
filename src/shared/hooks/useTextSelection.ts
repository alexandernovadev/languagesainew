import { useState, useEffect, useCallback, useRef } from "react";

interface TextSelectionMenuPosition {
  x: number;
  y: number;
}

interface UseTextSelectionOptions {
  containerRef?: React.RefObject<HTMLElement | null>;
  containerRefs?: React.RefObject<HTMLElement | null>[];
}

export const useTextSelection = (options: UseTextSelectionOptions = {}) => {
  const { containerRef, containerRefs } = options;
  const [selectedText, setSelectedText] = useState<string>("");
  const [menuPosition, setMenuPosition] =
    useState<TextSelectionMenuPosition | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Throttle para optimizar el scroll
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // Función para verificar si un elemento está dentro de algún contenedor válido
  const isWithinValidContainer = useCallback(
    (element: Node): boolean => {
      if (containerRef?.current) {
        return containerRef.current.contains(element);
      }

      if (containerRefs && containerRefs.length > 0) {
        return containerRefs.some((ref) => ref.current?.contains(element));
      }

      return true; // Si no hay contenedores específicos, permitir en todo el documento
    },
    [containerRef, containerRefs]
  );

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";

    if (text.length > 0 && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Verificar que la selección esté dentro de un contenedor válido
      if (!isWithinValidContainer(range.commonAncestorContainer)) {
        setShowMenu(false);
        setSelectedText("");
        return;
      }

      try {
        const rect = range.getBoundingClientRect();

        // Encontrar el contenedor activo para calcular la posición
        let activeContainer: HTMLElement | null = null;

        if (containerRef?.current) {
          activeContainer = containerRef.current;
        } else if (containerRefs && containerRefs.length > 0) {
          for (let i = 0; i < containerRefs.length; i++) {
            if (
              containerRefs[i]?.current?.contains(range.commonAncestorContainer)
            ) {
              activeContainer = containerRefs[i].current;
              break;
            }
          }
        }

        if (!activeContainer) {
          setShowMenu(false);
          setSelectedText("");
          return;
        }

        // Calcular posición del menú relativa al contenedor activo
        const containerRect = activeContainer.getBoundingClientRect();
        const menuPosition: TextSelectionMenuPosition = {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top - 25,
        };

        setSelectedText(text);
        setMenuPosition(menuPosition);
        setShowMenu(true);
      } catch (error) {
        console.error("Error handling text selection:", error);
        setShowMenu(false);
        setSelectedText("");
      }
    } else {
      setShowMenu(false);
      setSelectedText("");
      setMenuPosition(null);
    }
  }, [isWithinValidContainer, containerRef, containerRefs]);

  const clearSelection = useCallback(() => {
    setShowMenu(false);
    setSelectedText("");
    setMenuPosition(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);

    // Limpiar selección al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && menuPosition) {
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
        if (showMenu && selectedText) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            try {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();

              // Encontrar el contenedor activo
              let activeContainer: HTMLElement | null = null;

              if (containerRef?.current) {
                activeContainer = containerRef.current;
              } else if (containerRefs && containerRefs.length > 0) {
                // Buscar el contenedor que contiene la selección actual
                for (let i = 0; i < containerRefs.length; i++) {
                  if (
                    containerRefs[i]?.current?.contains(
                      range.commonAncestorContainer
                    )
                  ) {
                    activeContainer = containerRefs[i].current;
                    break;
                  }
                }
              }

              if (activeContainer) {
                const containerRect = activeContainer.getBoundingClientRect();
                const newPosition: TextSelectionMenuPosition = {
                  x: rect.left - containerRect.left,
                  y: rect.top - containerRect.top - 35,
                };
                setMenuPosition(newPosition);
              }
            } catch (error) {
              console.warn("Error updating menu position on scroll:", error);
            }
          }
        }
      }, 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // También escuchar scroll en contenedores con scroll
    const allContainers = containerRef ? [containerRef] : containerRefs || [];
    allContainers.forEach((ref) => {
      if (ref?.current) {
        ref.current.addEventListener("scroll", handleScroll, { passive: true });
      }
    });

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);

      allContainers.forEach((ref) => {
        if (ref?.current) {
          ref.current.removeEventListener("scroll", handleScroll);
        }
      });

      // Limpiar throttle
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [
    handleSelectionChange,
    showMenu,
    menuPosition,
    clearSelection,
    selectedText,
    containerRef,
    containerRefs,
  ]);

  return {
    selectedText,
    menuPosition,
    showMenu,
    clearSelection,
  };
};
