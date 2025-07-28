import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Plus,
  RefreshCw
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserTable } from "../../components/admin/UserTable";
import { UserFiltersModal } from "../../components/admin/UserFiltersModal";
import { UserEditModal } from "../../components/admin/UserEditModal";
import { UserDeleteDialog } from "../../components/admin/UserDeleteDialog";
import { UserPagination } from "../../components/admin/UserPagination";
import { UserPageSkeleton } from "../../components/admin/UserPageSkeleton";

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
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFiltersModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1">
                        Activo
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtros</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualizar</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agregar Usuario</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre de usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearch}
              disabled={loading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Buscar</p>
          </TooltipContent>
        </Tooltip>

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
          <div className="table-container">
            <UserTable
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              loading={loading}
              searchQuery={searchTerm}
            />
          </div>
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
