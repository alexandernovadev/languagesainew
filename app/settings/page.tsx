import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Gestiona la configuración de tu aplicación</p>
      </div>

      <div className="grid gap-6">
        {/* Perfil de Usuario */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" placeholder="Tu apellido" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" />
            </div>
            <Button>Guardar Cambios</Button>
          </CardContent>
        </Card>

        {/* Configuración de la Aplicación */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de la Aplicación</CardTitle>
            <CardDescription>Personaliza el comportamiento de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificaciones</Label>
                <div className="text-sm text-muted-foreground">Recibir notificaciones por email</div>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Actualizaciones Automáticas</Label>
                <div className="text-sm text-muted-foreground">Instalar actualizaciones automáticamente</div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Detalles sobre la versión y el estado de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Versión</span>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado</span>
              <Badge variant="default">Activo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Última actualización</span>
              <span className="text-sm text-muted-foreground">Hace 2 días</span>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Verificar Actualizaciones
              </Button>
              <Button variant="outline" size="sm">
                Exportar Configuración
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
