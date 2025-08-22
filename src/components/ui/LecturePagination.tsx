import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LecturePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function LecturePagination({
  currentPage,
  totalPages,
  onPageChange,
}: LecturePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-t-lg shadow-lg p-2">
      <div className="flex justify-center items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 w-8 p-0 text-xs sm:text-[10px] text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="px-3 py-2 text-xs sm:text-[10px] text-white">
          Página {currentPage} de {totalPages}
        </span>
        
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 w-8 p-0 text-xs sm:text-[10px] text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
