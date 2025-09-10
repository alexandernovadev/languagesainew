import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import { User } from "@/services/userService";
import { formatDateShort } from "@/utils/common/time/formatDate";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  loading?: boolean;
  searchQuery?: string;
}

export function UserTable({
  users = [],
  onEdit,
  onDelete,
  loading,
  searchQuery,
}: UserTableProps) {

  // TODO aqui otra vez la chambonada del role
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "teacher":
        return "secondary";
      case "student":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  const getInitials = (
    firstName?: string,
    lastName?: string,
    username?: string
  ) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Cargando usuarios...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {searchQuery
          ? "No se encontraron usuarios con esa búsqueda."
          : "No hay usuarios registrados."}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead className="min-w-[200px]">Usuario</TableHead>
          <TableHead className="min-w-[180px]">Email</TableHead>
          <TableHead className="w-24">Rol</TableHead>
          <TableHead className="w-20">Estado</TableHead>
          <TableHead className="w-20">Idioma</TableHead>
          <TableHead className="min-w-[120px]">Último Login</TableHead>
          <TableHead className="w-32 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="min-w-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.firstName, user.lastName, user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{user.username}</span>
                  {user.firstName && user.lastName && (
                    <span className="text-xs text-muted-foreground truncate">
                      {user.firstName} {user.lastName}
                    </span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="min-w-0">
              <span className="text-sm truncate block">{user.email}</span>
            </TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(user.isActive)}>
                {user.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{user.language.toUpperCase()}</Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {user.lastLogin ? formatDateShort(user.lastLogin) : "Nunca"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user)}
                        className="h-8 w-8 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-transparent hover:border-blue-700/30 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar usuario</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user)}
                        className="h-8 w-8 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-700/30 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eliminar usuario</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
