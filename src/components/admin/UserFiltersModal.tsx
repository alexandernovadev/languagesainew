import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { X, Filter, RotateCcw } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

interface UserFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserFiltersModal({ isOpen, onClose }: UserFiltersModalProps) {
  const { filters, handleFilterChange, handleApplyFilters, handleClearFilters } = useUsers();
  
  // Reset local filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        username: (filters.username as string) || '',
        email: (filters.email as string) || '',
        role: (filters.role as string) || 'all',
        language: (filters.language as string) || 'all',
        isActive: (filters.isActive as string) || 'all',
        phone: (filters.phone as string) || '',
        address: (filters.address as string) || '',
        createdAfter: (filters.createdAfter as string) || '',
        createdBefore: (filters.createdBefore as string) || '',
        updatedAfter: (filters.updatedAfter as string) || '',
        updatedBefore: (filters.updatedBefore as string) || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      });
    }
  }, [isOpen, filters]);
  
  const [localFilters, setLocalFilters] = useState({
    username: (filters.username as string) || '',
    email: (filters.email as string) || '',
    role: (filters.role as string) || 'all',
    language: (filters.language as string) || 'all',
    isActive: (filters.isActive as string) || 'all',
    phone: (filters.phone as string) || '',
    address: (filters.address as string) || '',
    createdAfter: (filters.createdAfter as string) || '',
    createdBefore: (filters.createdBefore as string) || '',
    updatedAfter: (filters.updatedAfter as string) || '',
    updatedBefore: (filters.updatedBefore as string) || '',
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
  });

  const handleLocalFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    // Convert empty strings and 'all' values to undefined for the API
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => [
        key,
        value === '' || value === 'all' ? undefined : value
      ])
    );
    
    handleFilterChange(cleanFilters);
    handleApplyFilters();
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({
      username: '',
      email: '',
      role: 'all',
      language: 'all',
      isActive: 'all',
      phone: '',
      address: '',
      createdAfter: '',
      createdBefore: '',
      updatedAfter: '',
      updatedBefore: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    handleClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== 'all' && value !== 'createdAt' && value !== 'desc'
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col border border-gray-600 shadow-2xl">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-background border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Usuarios
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Información Básica</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  placeholder="Buscar por username..."
                  value={localFilters.username}
                  onChange={(e) => handleLocalFilterChange('username', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Buscar por email..."
                  value={localFilters.email}
                  onChange={(e) => handleLocalFilterChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Role and Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Rol y Estado</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={localFilters.role}
                  onValueChange={(value) => handleLocalFilterChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Estado</Label>
                <Select
                  value={localFilters.isActive}
                  onValueChange={(value) => handleLocalFilterChange('isActive', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Language and Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Idioma y Contacto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={localFilters.language}
                  onValueChange={(value) => handleLocalFilterChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los idiomas</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">Inglés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="Buscar por teléfono..."
                  value={localFilters.phone}
                  onChange={(e) => handleLocalFilterChange('phone', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="Buscar por dirección..."
                value={localFilters.address}
                onChange={(e) => handleLocalFilterChange('address', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Date Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Fechas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Creación - Desde</Label>
                <DatePicker
                  value={localFilters.createdAfter ? new Date(localFilters.createdAfter) : undefined}
                  onChange={(date: Date | undefined) => handleLocalFilterChange('createdAfter', date?.toISOString() || '')}
                  placeholder="Seleccionar fecha"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Creación - Hasta</Label>
                <DatePicker
                  value={localFilters.createdBefore ? new Date(localFilters.createdBefore) : undefined}
                  onChange={(date: Date | undefined) => handleLocalFilterChange('createdBefore', date?.toISOString() || '')}
                  placeholder="Seleccionar fecha"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Actualización - Desde</Label>
                <DatePicker
                  value={localFilters.updatedAfter ? new Date(localFilters.updatedAfter) : undefined}
                  onChange={(date: Date | undefined) => handleLocalFilterChange('updatedAfter', date?.toISOString() || '')}
                  placeholder="Seleccionar fecha"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Actualización - Hasta</Label>
                <DatePicker
                  value={localFilters.updatedBefore ? new Date(localFilters.updatedBefore) : undefined}
                  onChange={(date: Date | undefined) => handleLocalFilterChange('updatedBefore', date?.toISOString() || '')}
                  placeholder="Seleccionar fecha"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Sorting */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Ordenamiento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortBy">Ordenar por</Label>
                <Select
                  value={localFilters.sortBy}
                  onValueChange={(value) => handleLocalFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Fecha de Creación</SelectItem>
                    <SelectItem value="updatedAt">Fecha de Actualización</SelectItem>
                    <SelectItem value="username">Nombre de Usuario</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="lastLogin">Último Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Orden</Label>
                <Select
                  value={localFilters.sortOrder}
                  onValueChange={(value) => handleLocalFilterChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descendente</SelectItem>
                    <SelectItem value="asc">Ascendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bg-background border-t pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar Filtros
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleApply} disabled={!hasActiveFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 