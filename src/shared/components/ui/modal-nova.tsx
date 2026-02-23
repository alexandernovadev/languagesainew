import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import ReactDOM from "react-dom";

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
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  // Cerrar modal al hacer clic en el overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  // Portal directo y correcto usando el contenedor específico
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay con backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 animate-in fade-in-0 duration-200"
        onClick={handleOverlayClick}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative z-50 w-full mx-4 flex flex-col mb-4",
          sizeClasses[size],
          height,
          "bg-background rounded-xl shadow-2xl border border-border",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {/* Botón de cerrar */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-20 rounded-md border border-white p-0.5 opacity-90 ring-offset-background transition-all shadow-[0_0_8px_rgba(255,255,255,0.3)] hover:border-red-500 hover:text-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Cerrar modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Fijo */}
        {title && (
          <div className="pt-4 px-6 pb-4 border-b border-border flex-shrink-0 text-left">
            <h2 
              id="modal-title"
              className="text-2xl font-semibold select-none"
            >
              {title}
            </h2>
            {description && (
              <p 
                id="modal-description"
                className="text-sm text-muted-foreground mt-1 select-none"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Contenido Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 mb-4">{children}</div>

        {/* Footer Fijo */}
        {footer && (
          <div className="flex justify-end gap-2 py-3 border-t border-border flex-shrink-0 bg-background px-6 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.getElementById('portalmodalnova') || document.body
  );
}
