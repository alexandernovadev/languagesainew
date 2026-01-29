import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { WordsTable } from "@/shared/components/tables/WordsTable";
import { WordDialog } from "@/shared/components/dialogs/WordDialog";
import { useWords } from "@/shared/hooks/useWords";
import { IWord } from "@/types/models/Word";
import { difficultyJson, languagesJson } from "@/data/bussiness/shared";
import { Plus, Search, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

export default function WordsPage() {
  const {
    words,
    loading,
    currentPage,
    totalPages,
    total,
    createWord,
    updateWord,
    deleteWord,
    updateFilters,
    clearFilters,
    goToPage,
    filters,
  } = useWords();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<IWord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<IWord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");

  // Handle create
  const handleCreate = () => {
    setSelectedWord(null);
    setDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (word: IWord) => {
    setSelectedWord(word);
    setDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (word: IWord) => {
    setWordToDelete(word);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (wordToDelete) {
      setDeleteLoading(true);
      try {
        await deleteWord(wordToDelete._id);
        setDeleteDialogOpen(false);
        setWordToDelete(null);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Handle save (create or update)
  const handleSave = async (wordData: any) => {
    if (selectedWord) {
      return await updateWord(selectedWord._id, wordData);
    } else {
      return await createWord(wordData);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ 
      wordUser: searchTerm,
      difficulty: difficultyFilter || undefined,
      language: languageFilter || undefined,
    });
  };

  // Clear search and filters
  const handleClearSearch = () => {
    setSearchTerm("");
    setDifficultyFilter("");
    setLanguageFilter("");
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

  const hasActiveFilters = searchTerm || difficultyFilter || languageFilter || Object.keys(filters).length > 2;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Palabras"
        description="Gestiona tu vocabulario"
        actions={
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Word
          </Button>
        }
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by word..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearSearch}
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All difficulties</SelectItem>
                    {difficultyJson.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={languageFilter}
                  onValueChange={setLanguageFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    {languagesJson.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Words Table */}
      <WordsTable
        words={words}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {words.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, total)} of {total} words
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
      <WordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        word={selectedWord}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Eliminar palabra?"
        description={
          <>
            Esto eliminará permanentemente la palabra <strong>{wordToDelete?.word}</strong>.
            Esta acción no se puede deshacer.
          </>
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
        confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  );
}
