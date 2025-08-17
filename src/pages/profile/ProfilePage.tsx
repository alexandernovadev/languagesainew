import { useUserStore } from "@/lib/store/user-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallbackClient } from "@/components/ui/avatar-fallback-client";
import { ModalNova } from "@/components/ui/modal-nova";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLanguageInfo } from "@/utils/common/language";
import {
  User,
  Mail,
  Shield,
  Camera,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { fakeStats } from "@/data/fakeStats";

export default function ProfilePage() {
  const { user, setUser } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [newImage, setNewImage] = useState(user?.image || "");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: user?.username || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      language: user?.language || "es",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const handleSave = (data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    language: string;
    phone: string;
    address: string;
  }) => {
    if (!user) return;
    setUser({
      _id: user._id,
      username: data.username,
      email: data.email,
      role: user.role,
      firstName: data.firstName,
      lastName: data.lastName,
      image: newImage,
      language: data.language,
      isActive: user.isActive,
      phone: data.phone,
      address: data.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
    reset(data);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Perfil"
        description="Gestiona tu información personal y preferencias de cuenta."
      />
      <div className="w-full mx-auto mt-6 flex flex-col gap-8">
        <Card className="w-full">
          <CardContent className="flex flex-col gap-8 p-4 sm:p-6 md:p-8">
            {/* Fila principal: avatar+datos | formulario */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Columna izquierda: avatar y datos */}
              <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3 w-full">
                <div className="relative group cursor-pointer mx-auto">
                  <Avatar className="h-32 w-32 border-4 border-primary/60 shadow-lg">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.firstName || user?.username || "Usuario"}
                    />
                    <AvatarFallbackClient user={user} />
                  </Avatar>
                  <div 
                    className="absolute bottom-2 right-2 bg-primary/90 rounded-full p-2 shadow-md group-hover:scale-110 transition-transform cursor-pointer"
                    onClick={() => setAvatarModal(true)}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <ModalNova
                  open={avatarModal}
                  onOpenChange={setAvatarModal}
                  title="Cambiar foto de perfil"
                  footer={
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setAvatarModal(false)}
                        className="w-full"
                        variant="secondary"
                      >
                        Guardar Imagen
                      </Button>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <Input
                      type="url"
                      placeholder="URL de la nueva imagen"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                    />
                  </div>
                </ModalNova>
                <span className="text-2xl font-bold text-primary text-center">
                  {user?.firstName || ""} {user?.lastName || ""}
                </span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <User className="h-4 w-4" /> @{user?.username}
                </span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {user?.email}
                </span>
                <div className="flex gap-3 mt-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
                    {user?.role === "admin" && (
                      <Shield className="h-3 w-3 mr-1 text-primary" />
                    )}{" "}
                    {user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : ""}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/30">
                    {getLanguageInfo(user?.language || "es").flag} {getLanguageInfo(user?.language || "es").name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user?.isActive
                        ? "bg-green-500/10 text-green-500 border border-green-500/30"
                        : "bg-red-500/10 text-red-500 border border-red-500/30"
                    }`}
                  >
                    <Activity className="h-3 w-3 mr-1" />{" "}
                    {user?.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              {/* Columna derecha: formulario de edición */}
              <div className="flex-1 flex flex-col gap-4 items-center md:items-start justify-center">
                <span className="font-semibold text-lg mb-2">Información Personal</span>
                <form className="w-full" onSubmit={handleSubmit(handleSave)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Usuario</Label>
                      <Input
                        id="username"
                        disabled={!editing}
                        {...register("username", {
                          required: "El usuario es obligatorio",
                          minLength: { value: 3, message: "Mínimo 3 caracteres" },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        disabled={!editing}
                        {...register("firstName", {
                          required: "El nombre es obligatorio",
                        })}
                      />
                      {errors.firstName && (
                        <span className="text-xs text-red-500">
                          {errors.firstName.message as string}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        disabled={!editing}
                        {...register("lastName", {
                          required: "El apellido es obligatorio",
                        })}
                      />
                      {errors.lastName && (
                        <span className="text-xs text-red-500">
                          {errors.lastName.message as string}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 w-full">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      disabled={!editing}
                      {...register("email", {
                        required: "El email es obligatorio",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Email no válido",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email.message as string}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select
                        value={user?.language}
                        onValueChange={(value) => editing && (register("language").onChange({ target: { value } } as any), (user && (user.language = value)))}
                      >
                        <SelectTrigger disabled={!editing}>
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { code: 'es', name: 'Español', flag: '🇪🇸' },
                            { code: 'en', name: 'Inglés', flag: '🇬🇧' },
                            { code: 'fr', name: 'Francés', flag: '🇫🇷' },
                            { code: 'de', name: 'Alemán', flag: '🇩🇪' },
                            { code: 'it', name: 'Italiano', flag: '🇮🇹' },
                            { code: 'pt', name: 'Portugués', flag: '🇵🇹' },
                          ].map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" disabled={!editing} {...register("phone")} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" disabled={!editing} {...register("address")} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 w-full justify-end">
                    {editing ? (
                      <>
                        <Button
                          size="sm"
                          type="submit"
                          disabled={!isDirty || !isValid}
                        >
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() => {
                            setEditing(false);
                            reset();
                          }}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => setEditing(true)}
                      >
                        Editar
                      </Button>
                    )}
                    {saved && (
                      <span className="text-green-600 text-sm ml-2">
                        ¡Guardado!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
            {/* Estadísticas (full width) */}
            <Separator className="my-4" />
            <div className="flex flex-col gap-4 w-full">
              <span className="font-semibold text-lg mb-2">Estadísticas</span>
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                <div className="flex items-center gap-3 text-primary font-bold text-2xl">
                  <Award className="h-7 w-7" />{" "}
                  <span>{fakeStats.palabras}</span>{" "}
                  <span className="text-base text-muted-foreground font-normal">
                    Palabras guardadas
                  </span>
                </div>
                <div className="flex items-center gap-3 text-orange-500 font-bold text-2xl">
                  <TrendingUp className="h-7 w-7" />{" "}
                  <span>{fakeStats.racha}</span>{" "}
                  <span className="text-base text-muted-foreground font-normal">
                    Días de racha
                  </span>
                </div>
              </div>
            </div>
            {/* Logros (full width) */}
            <Separator className="my-4" />
            <div className="flex flex-col gap-2 w-full">
              <span className="font-semibold text-lg mb-2">
                Logros recientes
              </span>
              <div className="flex gap-2 flex-wrap w-full">
                {fakeStats.logros.map((l, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1 text-base px-3 py-1"
                  >
                    <span>{l.icon}</span> {l.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
