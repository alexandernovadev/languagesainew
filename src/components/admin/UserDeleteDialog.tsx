import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { User } from '@/services/userService';

interface UserDeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
  loading?: boolean;
}

export function UserDeleteDialog({ user, isOpen, onOpenChange, onConfirm, loading }: UserDeleteDialogProps) {
  const handleConfirm = async () => {
    if (user) {
      await onConfirm(user._id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Eliminación
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar al usuario{' '}
            <strong>{user?.username}</strong>?
            <br />
            <br />
            Esta acción no se puede deshacer y eliminará permanentemente:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>El perfil del usuario</li>
              <li>Todos los datos asociados</li>
              <li>El historial de actividad</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="btn-delete-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {loading ? 'Eliminando...' : 'Eliminar Usuario'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 