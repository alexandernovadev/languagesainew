import React from "react";
import { cn } from "@/utils/common/classnames";

interface AILoadingContainerProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  variant?: "section" | "card" | "button";
}

/**
 * Componente reutilizable para mostrar animación de carga con AI
 *
 * @param children - Contenido a mostrar
 * @param className - Clases CSS adicionales
 * @param loading - Estado de carga
 * @param variant - Variante del contenedor (section, card, button)
 *
 * @example
 * ```tsx
 * <AILoadingContainer loading={isGenerating}>
 *   <h3>Contenido de AI</h3>
 *   <p>Este contenido se mostrará con borde animado</p>
 * </AILoadingContainer>
 * ```
 */
export function AILoadingContainer({
  children,
  className = "",
  loading = false,
  variant = "section",
}: AILoadingContainerProps) {
  const baseClasses = "transition-all duration-300";

  const variantClasses = {
    section: "mb-4",
    card: "mb-2",
    button: "mb-1",
  };

  const paddingClasses = {
    section: "p-4",
    card: "p-3",
    button: "p-2",
  };

  if (loading) {
    return (
      <div className={cn(variantClasses[variant])}>
        <div className="relative p-[2px] rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-green-500 animate-gradient-x">
          <div
            className={cn(
              "bg-zinc-900/90 rounded-lg",
              paddingClasses[variant],
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[variant],
        "rounded-lg border bg-zinc-900/40 border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Hook personalizado para manejar estados de carga de AI
 *
 * @param initialState - Estado inicial de carga
 * @returns [loading, setLoading, withLoading] - Estado, setter y wrapper para operaciones async
 *
 * @example
 * ```tsx
 * const [loading, setLoading, withLoading] = useAILoading();
 *
 * const handleGenerate = withLoading(async () => {
 *   await generateAIContent();
 * });
 * ```
 */
export function useAILoading(initialState = false) {
  const [loading, setLoading] = React.useState(initialState);

  const withLoading = React.useCallback(
    async (operation: () => Promise<void>) => {
      setLoading(true);
      try {
        await operation();
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return [loading, setLoading, withLoading] as const;
}
