import { useProfile } from "@/shared/hooks/useProfile";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Separator } from "@/shared/components/ui/separator";
import { Save, X, Loader2, Globe, User, Shield, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { contentLanguageCodes, languages } from "@/utils/common/language";

const CONTENT_LANGUAGES = contentLanguageCodes.map((code) => ({
  value: code,
  ...languages[code],
}));

const EXPLAINS_LANGUAGES = [
  { value: "en", ...languages["en"] },
  { value: "es", ...languages["es"] },
  { value: "pt", ...languages["pt"] },
  { value: "it", ...languages["it"] },
  { value: "fr", ...languages["fr"] },
] as const;

export default function ProfilePage() {
  const {
    user,
    formData,
    isDirty,
    isSaving,
    handleInputChange,
    handleSave,
    handleCancel,
  } = useProfile();

  if (!user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando perfil…</span>
        </div>
      </div>
    );
  }

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.username.substring(0, 2).toUpperCase();

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "teacher":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "—";
    return new Date(dateInput).toLocaleDateString("es", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fieldClass =
    "transition-[box-shadow,border-color] focus-within:ring-2 focus-within:ring-primary/25 focus-within:border-primary/40";

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Perfil"
        description="Aquí puedes actualizar tus datos y los idiomas de la app. Los cambios se aplican al pulsar Guardar."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="gap-1.5"
              >
                <X className="h-4 w-4" />
                Descartar
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="gap-1.5"
              title={
                isDirty
                  ? "Guardar cambios en el servidor"
                  : "No hay cambios pendientes"
              }
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative border-b bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar className="h-28 w-28 shrink-0 ring-4 ring-background shadow-xl sm:h-32 sm:w-32">
              <AvatarImage src={user.image} alt={user.username} />
              <AvatarFallback className="bg-primary/15 text-2xl font-semibold text-primary sm:text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                {displayName}
              </h2>
              <p className="truncate text-sm text-muted-foreground sm:text-base">
                {user.email}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant={getRoleBadgeVariant(user.role)} className="font-normal">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <Badge
                  variant={user.isActive ? "default" : "outline"}
                  className="font-normal"
                >
                  {user.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-0 px-5 py-6 sm:px-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <User className="h-4 w-4" />
              Datos personales
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Tu nombre"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Tus apellidos"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+34 …"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Opcional"
                  className={fieldClass}
                />
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Globe className="h-4 w-4" />
              Idiomas en la app
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Contenido (palabras, lecturas…)</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange("language", value)}
                >
                  <SelectTrigger id="language" className={fieldClass}>
                    <SelectValue placeholder="Elige idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Filtra el material que ves según el idioma que estudias.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="explainsLanguage">Explicaciones y correcciones</Label>
                <Select
                  value={formData.explainsLanguage}
                  onValueChange={(value) =>
                    handleInputChange("explainsLanguage", value)
                  }
                >
                  <SelectTrigger id="explainsLanguage" className={fieldClass}>
                    <SelectValue placeholder="Elige idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPLAINS_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Idioma de ayudas, feedback y explicaciones de la IA.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Shield className="h-4 w-4" />
              Cuenta (solo lectura)
            </div>
            <div className="rounded-xl border border-dashed bg-muted/40 p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Usuario</Label>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">No se puede cambiar</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="truncate font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">No se puede cambiar</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Rol</Label>
                  <p className="font-medium capitalize">{user.role}</p>
                  <p className="text-xs text-muted-foreground">Contacta con un admin</p>
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-4 w-4" />
              Actividad
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Último acceso",
                  value: user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString("es", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—",
                },
                { label: "Alta", value: formatDate(user.createdAt) },
                { label: "Última actualización", value: formatDate(user.updatedAt) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border bg-muted/20 px-4 py-3"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{row.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
