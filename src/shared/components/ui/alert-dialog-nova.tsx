import React from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/utils/common/classnames";
import type { VariantProps } from "class-variance-authority";

interface AlertDialogNovaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  confirmVariant?: VariantProps<typeof buttonVariants>["variant"];
  shouldAutoCloseOnConfirm?: boolean;
}

export function AlertDialogNova({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  confirmVariant = "default",
  shouldAutoCloseOnConfirm = true,
}: AlertDialogNovaProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!loading) {
          onOpenChange(next);
        }
      }}
    >
      <AlertDialogContent className="shadow-2xl rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          {shouldAutoCloseOnConfirm ? (
            <AlertDialogAction
              onClick={onConfirm}
              className={cn(buttonVariants({ variant: confirmVariant }))}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Procesando..." : confirmText}
            </AlertDialogAction>
          ) : (
            <button
              onClick={onConfirm}
              className={cn(buttonVariants({ variant: confirmVariant }))}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
              {loading ? "Procesando..." : confirmText}
            </button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 