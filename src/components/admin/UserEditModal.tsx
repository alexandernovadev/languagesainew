import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ModalNova } from '@/components/ui/modal-nova';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LanguageSelect } from '@/components/ui/LanguageSelect';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, UserPlus, User as UserIcon, Settings, Phone } from 'lucide-react';
import { User, UserCreate, UserUpdate } from '@/services/userService';

// Validation schema
const userSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  role: z.enum(['admin', 'teacher', 'student']),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  language: z.enum(['es', 'en', 'fr', 'de', 'it', 'pt']),
  isActive: z.boolean().default(true),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserEditModalProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserCreate | UserUpdate) => Promise<void>;
  saving: boolean;
}

export function UserEditModal({ user, isOpen, onClose, onSave, saving }: UserEditModalProps) {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      role: (user?.role as 'admin' | 'teacher' | 'student') || 'student',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      language: (user?.language as 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt') || 'es',
      isActive: user?.isActive ?? true,
      address: user?.address || '',
      phone: user?.phone || '',
    },
  });

  const watchedRole = watch('role');
  const watchedIsActive = watch('isActive');

  const onSubmit = async (data: UserFormData) => {
    try {
      // Remove password if it's empty (for editing)
      if (isEditing && !data.password) {
        delete data.password;
      }
      
      await onSave(data);
      reset();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <ModalNova
      open={isOpen}
      onOpenChange={handleClose}
      title={isEditing ? "Editar Usuario" : "Crear Usuario"}
      size="2xl"
      height="h-auto"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={saving || !isValid}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Rol y Config
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contacto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario *</Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Ingrese nombre de usuario"
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="usuario@ejemplo.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Ingrese contraseña"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            )}
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Dejar vacío para mantener la actual"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="Nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Apellido"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={watchedRole}
                  onValueChange={(value: 'admin' | 'teacher' | 'student') => setValue('role', value)}
                >
                  <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="student">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma *</Label>
                <LanguageSelect
                  value={watch('language')}
                  onChange={(value) => setValue('language', value)}
                  disabled={false}
                />
                {errors.language && (
                  <p className="text-sm text-red-500">{errors.language.message}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={watchedIsActive}
                onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
              />
              <Label htmlFor="isActive">Usuario Activo</Label>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="space-y-4 my-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Dirección completa"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
      </ModalNova>
    );
  } 