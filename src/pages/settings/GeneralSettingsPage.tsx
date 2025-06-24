import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
        <CardDescription>
          Preferencias básicas de la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">
              Notificaciones por Email
            </div>
            <div className="text-sm text-muted-foreground">
              Recibir notificaciones por email
            </div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">
              Actualizaciones Automáticas
            </div>
            <div className="text-sm text-muted-foreground">
              Instalar actualizaciones automáticamente
            </div>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
} 