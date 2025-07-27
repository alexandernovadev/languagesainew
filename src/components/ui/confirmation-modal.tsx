import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  variant = "danger",
}: ConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          titleColor: "text-red-500",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          titleColor: "text-yellow-500",
        };
      case "info":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
          titleColor: "text-blue-500",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${styles.titleColor}`}>
            {styles.icon}
            {title}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
                  <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant={variant === "danger" ? "destructive" : variant === "warning" ? "default" : "default"}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {confirmText}
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 