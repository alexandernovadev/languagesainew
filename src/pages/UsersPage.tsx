import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { UsersTable } from "@/shared/components/tables/UsersTable";
import { UserDialog } from "@/shared/components/dialogs/UserDialog";
import { useUsers } from "@/shared/hooks/useUsers";
import { User } from "@/services/userService";
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

export default function UsersPage() {
  const {
    users,
    loading,
    currentPage,
    totalPages,
    total,
    createUser,
    updateUser,
    deleteUser,
    updateFilters,
    clearFilters,
    goToPage,
    filters,
  } = useUsers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle create
  const handleCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      setDeleteLoading(true);
      try {
        await deleteUser(userToDelete._id);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Handle save (create or update)
  const handleSave = async (userData: any) => {
    if (selectedUser) {
      return await updateUser(selectedUser._id, userData);
    } else {
      return await createUser(userData);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ username: searchTerm });
  };

  // Clear search
  const handleClearSearch = () => {
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

  return (
    <div className="space-y-4">
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios del sistema"
        filters={
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {(searchTerm || Object.keys(filters).length > 2) && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearSearch}
                size="icon"
                title="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button type="submit" variant="secondary" size="icon" title="Buscar">
              <Search className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={handleCreate}
              size="icon"
              title="Crear usuario"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        }
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 -mx-4 px-4 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {users.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, total)} of {total} users
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
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Eliminar usuario?"
        description={
          <>
            Esto eliminará permanentemente al usuario <strong>{userToDelete?.username}</strong>.
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
