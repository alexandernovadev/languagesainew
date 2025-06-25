import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, BarChart2 } from "lucide-react";

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  totalVerbs: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onVerify: () => void;
  isVerifying: boolean;
  canVerify: boolean;
  isLastPage: boolean;
  onShowStats?: () => void;
}

export function Navigation({
  currentPage,
  totalPages,
  totalVerbs,
  onPrevPage,
  onNextPage,
  onVerify,
  isVerifying,
  canVerify,
  isLastPage,
  onShowStats,
}: NavigationProps) {
  return (
    <div className="flex items-center justify-end gap-2 mt-3">
      <Button
        variant="outline"
        onClick={onPrevPage}
        disabled={currentPage === 1}
        aria-label="Anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {isLastPage && !isVerifying ? (
        <Button
          variant="default"
          onClick={onShowStats}
          aria-label="Ver Estadística"
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Ver Estadística
        </Button>
      ) : isVerifying ? (
        <Button
          variant="default"
          onClick={onVerify}
          disabled={!canVerify}
          aria-label="Verificar"
        >
          <Check className="h-4 w-4 mr-2" />
          Verificar
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onNextPage}
          disabled={isLastPage}
          aria-label="Siguiente"
        >
          <ChevronRight className="h-4 w-4" />
          Avanzar
        </Button>
      )}
    </div>
  );
}
