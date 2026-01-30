import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LecturesTable } from "@/shared/components/tables/LecturesTable";
import { LectureDialog } from "@/shared/components/dialogs/LectureDialog";
import { LectureFiltersModal } from "@/shared/components/filters/LectureFiltersModal";
import { useLectures } from "@/shared/hooks/useLectures";
import { useFilterUrlSync } from "@/shared/hooks/useFilterUrlSync";
import { ILecture } from "@/types/models/Lecture";
import { Plus, Search, X, Filter } from "lucide-react";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

export default function LecturesPage() {
  const {
    lectures,
    loading,
    currentPage,
    totalPages,
    total,
    createLecture,
    updateLecture,
    deleteLecture,
    updateFilters,
    clearFilters,
    goToPage,
    filters,
    refreshLectures,
  } = useLectures();

  // Sync filters with URL
  useFilterUrlSync(filters, updateFilters);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<ILecture | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<ILecture | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle create
  const handleCreate = () => {
    setSelectedLecture(null);
    setDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (lecture: ILecture) => {
    setSelectedLecture(lecture);
    setDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (lecture: ILecture) => {
    setLectureToDelete(lecture);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (lectureToDelete) {
      setDeleteLoading(true);
      try {
        await deleteLecture(lectureToDelete._id);
        setDeleteDialogOpen(false);
        setLectureToDelete(null);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Handle save (create or update)
  const handleSave = async (lectureData: any) => {
    if (selectedLecture) {
      return await updateLecture(selectedLecture._id, lectureData);
    } else {
      return await createLecture(lectureData);
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
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "page" || key === "limit") return false;
    if (value === undefined || value === "") return false;
    // For arrays, check if they have at least one item
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lecturas"
        description="Gestiona tus lecturas y contenido educativo"
        filters={
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar lectura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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

            <Button
              type="button"
              variant="default"
              onClick={handleCreate}
              size="icon"
              title="Crear lectura"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* Lectures Table */}
      <LecturesTable
        lectures={lectures}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        searchTerm={filters.search || searchTerm}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 -mx-4 px-4 py-4">
          {/* Mobile & Tablet: Simple pagination */}
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-xs"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-xs"
              >
                Siguiente
              </Button>
            </div>
          </div>

          {/* Desktop: Full pagination */}
          <div className="hidden lg:flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {lectures.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, total)} of {total} lectures
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
        </div>
      )}

      {/* Create/Edit Dialog */}
      <LectureDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedLecture(null);
          }
        }}
        lecture={selectedLecture}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Eliminar lectura?"
        description={
          <>
            Esto eliminará permanentemente la lectura <strong>{lectureToDelete?.typeWrite || "sin título"}</strong>.
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
      <LectureFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
