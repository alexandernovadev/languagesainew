import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/utils/common/classnames";

interface AddExpressionQuickDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expression: string) => Promise<void>;
  language?: string;
}

export function AddExpressionQuickDialog({
  open,
  onOpenChange,
  onAdd,
  language = "en",
}: AddExpressionQuickDialogProps) {
  const [expression, setExpression] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const trimmed = expression.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await onAdd(trimmed);
      setExpression("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!loading) {
      if (!next) setExpression("");
      onOpenChange(next);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="shadow-2xl rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar expresión</AlertDialogTitle>
          <AlertDialogDescription>
            Escribe la expresión o frase y se generará automáticamente con IA.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="quick-expression-input" className="sr-only">
            Expresión
          </Label>
          <Input
            id="quick-expression-input"
            placeholder="Ej: break the ice, costar un ojo de la cara..."
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConfirm();
              }
            }}
            className="rounded-lg"
            disabled={loading}
            autoFocus
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!expression.trim() || loading}
            className={cn(
              buttonVariants({ variant: "default" }),
              "inline-flex items-center justify-center"
            )}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generando…" : "Agregar"}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
