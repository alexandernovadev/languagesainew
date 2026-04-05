import { useCallback } from "react";
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
import { useLecturesUIStore } from "@/lib/store/lectures-store";
import { TablePagination } from "@/shared/components/ui/table-pagination";

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
  } = useLectures();

  useFilterUrlSync(filters, updateFilters);

  const {
    dialogOpen, setDialogOpen,
    filtersModalOpen, setFiltersModalOpen,
    selectedLecture, setSelectedLecture,
    deleteDialogOpen, setDeleteDialogOpen,
    lectureToDelete, setLectureToDelete,
    searchTerm, setSearchTerm,
    deleteLoading, setDeleteLoading,
  } = useLecturesUIStore();

  const handleCreate = useCallback(() => {
    setSelectedLecture(null);
    setDialogOpen(true);
  }, [setSelectedLecture, setDialogOpen]);

  const handleEdit = useCallback((lecture: ILecture) => {
    setSelectedLecture(lecture);
    setDialogOpen(true);
  }, [setSelectedLecture, setDialogOpen]);

  const handleDeleteClick = useCallback((lecture: ILecture) => {
    setLectureToDelete(lecture);
    setDeleteDialogOpen(true);
  }, [setLectureToDelete, setDeleteDialogOpen]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!lectureToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteLecture(lectureToDelete._id);
      setDeleteDialogOpen(false);
      setLectureToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [lectureToDelete, deleteLecture, setDeleteLoading, setDeleteDialogOpen, setLectureToDelete]);

  const handleSave = useCallback(async (lectureData: any) => {
    if (selectedLecture) {
      return await updateLecture(selectedLecture._id, lectureData);
    }
    return await createLecture(lectureData);
  }, [selectedLecture, updateLecture, createLecture]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm.trim() || undefined });
  }, [searchTerm, updateFilters]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    clearFilters();
  }, [setSearchTerm, clearFilters]);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "page" || key === "limit") return false;
    if (value === undefined || value === "") return false;
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
                <Button type="button" variant="ghost" onClick={handleClearFilters} size="icon" title="Limpiar filtros">
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

            <Button type="button" variant="default" onClick={handleCreate} size="icon" title="Crear lectura">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <LecturesTable
        lectures={lectures}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        searchTerm={filters.search || searchTerm}
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        itemsCount={lectures.length}
        itemLabel="lectures"
        onPageChange={goToPage}
      />

      <LectureDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedLecture(null);
        }}
        lecture={selectedLecture}
        onSave={handleSave}
      />

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

      <LectureFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        filters={filters}
        onApplyFilters={updateFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
