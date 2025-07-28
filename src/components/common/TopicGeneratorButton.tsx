import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/utils/common";

interface TopicGeneratorButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "default" | "secondary";
}

export function TopicGeneratorButton({
  onClick,
  isGenerating,
  disabled = false,
  className,
  size = "sm",
  variant = "outline",
}: TopicGeneratorButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={cn(
        "gap-2 transition-all duration-200",
        isGenerating && "animate-pulse shadow-lg",
        className
      )}
      title={
        isGenerating
          ? "Generando tema..."
          : "Generar tema aleatorio o expandir tus palabras clave"
      }
    >
      <Sparkles
        className={cn("h-4 w-4", isGenerating && "animate-spin text-primary")}
      />
      {isGenerating ? "Generando..." : "AI"}
    </Button>
  );
}
