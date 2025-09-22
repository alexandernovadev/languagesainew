import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useUsers } from "./hooks/useUsers";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageLayout } from "@/shared/components/layouts/page-layout";
import { Input } from "@/shared/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  Plus,
  RefreshCw
} from "lucide-react";
import { UserTable } from "../users/components/UserTable";
import { UserFiltersModal } from "../users/components/UserFiltersModal";
import { UserEditModal } from "../users/components/UserEditModal";
import { UserDeleteDialog } from "../users/components/UserDeleteDialog";
import { UserPagination } from "../users/components/UserPagination";
import { UserPageSkeleton } from "../users/components/UserPageSkeleton";
import { ActionButtonsHeader } from "@/shared/components/ui/action-buttons-header";

export default function UsersPage() {
  const {
    // State
    users,
    loading,
    saving,
    pagination,
    searchTerm,
    selectedUser,
    userToDelete,
    isFiltersModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    hasActiveFilters,

    // Actions
    setSearchTerm,
    setIsFiltersModalOpen,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,

    // Handlers
    handleSearch,
    handleEditUser,
    handleDeleteUser,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers,
    goToPage,
  } = useUsers();

  if (loading && (!users || users.length === 0)) {
    return <UserPageSkeleton />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios del sistema con permisos y roles."
        actions={
          <ActionButtonsHeader
            actions={[
              {
                id: "filters",
                icon: <SlidersHorizontal className="h-4 w-4" />,
                onClick: () => setIsFiltersModalOpen(true),
                tooltip: "Filtrar usuarios",
                variant: "outline",
                badge: hasActiveFilters ? { text: "!", variant: "secondary" } : undefined
              },
              {
                id: "refresh",
                icon: <RefreshCw className="h-4 w-4" />,
                onClick: fetchUsers,
                tooltip: "Actualizar usuarios",
                variant: "outline",
                loading: loading
              },
              {
                id: "add",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => setIsEditModalOpen(true),
                tooltip: "Crear nuevo usuario",
                variant: "default"
              }
            ]}
          />
        }
      />

      {/* Search Bar */}
      <div className="sticky top-[56px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
        <div className="flex gap-2 p-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 h-8 text-base"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Usuarios</span>
            <span className="text-sm text-muted-foreground">
              {pagination.totalItems} usuarios encontrados
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            loading={loading}
            searchQuery={searchTerm}
          />
        </CardContent>
      </Card>

      <UserPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      {/* Modals and Dialogs */}
      <UserFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
      />

      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={
          selectedUser
            ? (data: any) => updateUser(selectedUser._id, data)
            : (data: any) => createUser(data)
        }
        saving={saving}
      />

      <UserDeleteDialog
        user={userToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteUser}
        loading={saving}
      />
    </PageLayout>
  );
}
