import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2 } from 'lucide-react';
import { User } from '@/services/userService';
import { formatDateShort } from '@/utils/common/time/formatDate';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  loading?: boolean;
  searchQuery?: string;
}

export function UserTable({ users = [], onEdit, onDelete, loading, searchQuery }: UserTableProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return 'U';
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
        {searchQuery ? 'No se encontraron usuarios con esa búsqueda.' : 'No hay usuarios registrados.'}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Idioma</TableHead>
          <TableHead>Último Login</TableHead>
          <TableHead className="w-32 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">
              {index + 1}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.firstName, user.lastName, user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  {user.firstName && user.lastName && (
                    <span className="text-xs text-muted-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.email}</span>
            </TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(user.isActive)}>
                {user.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {user.language.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {user.lastLogin ? formatDateShort(user.lastLogin) : 'Nunca'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(user)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 