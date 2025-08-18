import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalNovaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  height?: string;
}

export function ModalNova({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "5xl",
  height = "h-[95dvh]",
}: ModalNovaProps) {
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${sizeClasses[size]} ${height} flex flex-col p-0 shadow-2xl rounded-xl focus:outline-none focus:ring-0`}
      >
        {/* Título oculto para accesibilidad */}
        <DialogHeader className="sr-only">
          <DialogTitle>{title || "Modal"}</DialogTitle>
          <DialogDescription>{description || "Contenido del modal"}</DialogDescription>
        </DialogHeader>

        {/* Header Fijo */}
        {title && (
          <div className="pt-4 px-6 pb-4 border-b border-border flex-shrink-0 text-left">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        )}

        {/* Contenido Scrollable */}
        <div className="flex-grow overflow-y-auto">{children}</div>

        {/* Footer Fijo */}
        {footer && (
          <div className="flex justify-end gap-2 py-3 border-t border-border shrink-0 bg-background px-6 rounded-b-xl">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
