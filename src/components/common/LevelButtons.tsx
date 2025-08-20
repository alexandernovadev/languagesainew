import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/common/classnames";

interface LevelButtonsProps {
  onUpdateLevel: (level: "easy" | "medium" | "hard") => void;
  loading: boolean;
  currentLevel?: "easy" | "medium" | "hard";
  variant?: "full" | "compact" | "modal";
  className?: string;
}

export const LevelButtons = memo(function LevelButtons({
  onUpdateLevel,
  loading,
  currentLevel,
  variant = "full",
  className,
}: LevelButtonsProps) {
  const getButtonSize = () => {
    switch (variant) {
      case "compact":
        return { size: "sm" as const, padding: "px-2 py-1", text: "text-xs" };
      case "modal":
        return { size: "sm" as const, padding: "px-3 py-1.5", text: "text-xs" };
      default:
        return { size: "default" as const, padding: "px-4 py-2", text: "text-sm" };
    }
  };

  const { size, padding, text } = getButtonSize();

  return (
    <div className={cn(
      "flex justify-center gap-2",
      variant === "modal" && "px-3 py-1",
      variant === "compact" && "gap-1",
      className
    )}>
      {(["easy", "medium", "hard"] as const).map((level) => {
        const isCurrentLevel = level === currentLevel;
        const isDisabled = loading || isCurrentLevel;
        
        return (
          <Button
            key={level}
            onClick={() => onUpdateLevel(level)}
            disabled={isDisabled}
            variant="outline"
            size={size}
            className={cn(
              "capitalize transition-all duration-200",
              padding,
              text,
              // Estilos para el nivel actual (seleccionado)
              isCurrentLevel && level === "easy" &&
                "bg-green-600 border-green-600 text-white cursor-not-allowed shadow-lg",
              isCurrentLevel && level === "medium" &&
                "bg-blue-600 border-blue-600 text-white cursor-not-allowed shadow-lg",
              isCurrentLevel && level === "hard" &&
                "bg-red-600 border-red-600 text-white cursor-not-allowed shadow-lg",
              // Estilos para niveles no seleccionados
              !isCurrentLevel && level === "easy" &&
                "border-green-600 text-green-400 hover:border-green-400 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)]",
              !isCurrentLevel && level === "medium" &&
                "border-blue-600 text-blue-400 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]",
              !isCurrentLevel && level === "hard" &&
                "border-red-600 text-red-400 hover:border-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]",
              // Estilos para estado loading - solo animación, sin opacidad
              loading && "animate-pulse"
            )}
          >
            {level}
          </Button>
        );
      })}
    </div>
  );
});
