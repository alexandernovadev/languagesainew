import React from "react";
import { Button } from "@/components/ui/button";

interface ExamPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ExamPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ExamPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-t-lg shadow-lg p-2">
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </Button>

        <span className="flex items-center px-4">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
