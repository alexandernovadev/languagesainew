import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ExpressionsTable } from "@/shared/components/tables/ExpressionsTable";
import { ExpressionDialog } from "@/shared/components/dialogs/ExpressionDialog";
import { ExpressionFiltersModal } from "@/shared/components/filters/ExpressionFiltersModal";
import { useExpressions } from "@/shared/hooks/useExpressions";
import { IExpression } from "@/types/models/Expression";
import { Plus, Search, Filter, X } from "lucide-react";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Badge } from "@/shared/components/ui/badge";

export default function ExpressionsPage() {
  const {
    expressions,
    loading,
    currentPage,
    totalPages,
    total,
    createExpression,
    updateExpression,
    deleteExpression,
    updateFilters,
    clearFilters,
    goToPage,
    filters,
  } = useExpressions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [selectedExpression, setSelectedExpression] = useState<IExpression | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expressionToDelete, setExpressionToDelete] = useState<IExpression | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle create
  const handleCreate = () => {
    setSelectedExpression(null);
    setDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (expression: IExpression) => {
    setSelectedExpression(expression);
    setDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (expression: IExpression) => {
    setExpressionToDelete(expression);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (expressionToDelete) {
      setDeleteLoading(true);
      try {
        await deleteExpression(expressionToDelete._id);
        setDeleteDialogOpen(false);
        setExpressionToDelete(null);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Handle save (create or update)
  const handleSave = async (expressionData: any) => {
    if (selectedExpression) {
      return await updateExpression(selectedExpression._id, expressionData);
    } else {
      return await createExpression(expressionData);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  // Handle apply filters from modal
  const handleApplyFilters = (newFilters: any) => {
    updateFilters(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    clearFilters();
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Count active filters (excluding page and limit)
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== "page" && key !== "limit" && value !== undefined && value !== ""
  ).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Expresiones"
        description="Gestiona tus expresiones idiomáticas"
        actions={
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Expression
          </Button>
        }
      />

      {/* Search Bar and Filter Button */}
      <div className="flex gap-2">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar expresión..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="secondary" size="icon" title="Buscar">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setFiltersModalOpen(true)}
          title="Filtros"
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClearFilters}
            size="icon"
            title="Limpiar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Expressions Table */}
      <ExpressionsTable
        expressions={expressions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {expressions.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, total)} of {total} expressions
          </p>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => goToPage(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <ExpressionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expression={selectedExpression}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Eliminar expresión?"
        description={
          <>
            Esto eliminará permanentemente la expresión <strong>{expressionToDelete?.expression}</strong>.
            Esta acción no se puede deshacer.
          </>
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
        confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />

      {/* Filters Modal */}
      <ExpressionFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
