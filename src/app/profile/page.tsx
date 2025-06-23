import { useUserStore } from "@/lib/store/user-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarFallbackClient } from "@/components/ui/avatar-fallback-client";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogH,
  DialogTitle as DialogT,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Camera,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react";

// Simulación de estadísticas y logros
const fakeStats = {
  palabras: 123,
  racha: 7,
  logros: [
    { icon: "🏆", label: "Maestro del Vocabulario" },
    { icon: "🔥", label: "Racha de 7 días" },
    { icon: "📚", label: "100 Palabras Aprendidas" },
  ],
};

export default function ProfilePage() {
  const { user, setUser, logout } = useUserStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [newImage, setNewImage] = useState(user?.image || "");

  const handleSave = () => {
    if (!user) return;
    setUser({
      _id: user._id,
      username: user.username,
      email,
      role: user.role,
      firstName,
      lastName,
      image: newImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Mi Perfil"
        description="Gestiona tu información personal y visualiza tu progreso"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Cambiar contraseña
            </Button>
            <Button variant="destructive" onClick={logout} size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      <div className="w-full mx-auto mt-6 flex flex-col gap-8">
        <Card className="w-full">
          <CardContent className="flex flex-col gap-8 p-4 sm:p-6 md:p-8">
            {/* Fila principal: avatar+datos | formulario */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Columna izquierda: avatar y datos */}
              <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3 w-full">
                <Dialog open={avatarModal} onOpenChange={setAvatarModal}>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer mx-auto">
                      <Avatar className="h-32 w-32 border-4 border-primary/60 shadow-lg">
                        <AvatarImage
                          src={user?.image || ""}
                          alt={user?.firstName || user?.username || "Usuario"}
                        />
                        <AvatarFallbackClient user={user} />
                      </Avatar>
                      <div className="absolute bottom-2 right-2 bg-primary/90 rounded-full p-2 shadow-md group-hover:scale-110 transition-transform">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogH>
                      <DialogT>Cambiar foto de perfil</DialogT>
                    </DialogH>
                    <Input
                      type="url"
                      placeholder="URL de la nueva imagen"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                    />
                    <Button
                      onClick={() => setAvatarModal(false)}
                      className="mt-2 w-full"
                      variant="secondary"
                    >
                      Guardar Imagen
                    </Button>
                  </DialogContent>
                </Dialog>
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
                    {user?.role === "admin" && <Shield className="h-3 w-3 mr-1 text-primary" />} {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user?.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}` }>
                    <Activity className="h-3 w-3 mr-1" /> {user?.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              {/* Columna derecha: formulario de edición */}
              <div className="flex-1 flex flex-col gap-4 items-center md:items-start justify-center">
                <span className="font-semibold text-lg mb-2">
                  Información Personal
                </span>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div className="flex gap-2 mt-2 w-full justify-end">
                  {editing ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(false)}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => setEditing(true)}>
                      Editar
                    </Button>
                  )}
                  {saved && (
                    <span className="text-green-600 text-sm ml-2">
                      ¡Guardado!
                    </span>
                  )}
                </div>
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
