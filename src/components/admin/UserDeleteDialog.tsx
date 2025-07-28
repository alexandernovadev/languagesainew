import React from 'react';
import { AlertDialogNova } from '@/components/ui/alert-dialog-nova';
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
    <AlertDialogNova
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Confirmar Eliminación"
      description={
        <>
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
        </>
      }
      cancelText="Cancelar"
      confirmText={loading ? 'Eliminando...' : 'Eliminar Usuario'}
      onConfirm={handleConfirm}
      loading={loading}
    />
  );
} 