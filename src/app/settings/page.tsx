import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";

export default function Settings() {
  return (
    <PageLayout>
      <PageHeader
        title="Configuración"
        description="Gestiona la configuración de tu aplicación"
      />

      <div className="grid gap-6">
        {/* Configuración General */}
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

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>
              Detalles técnicos de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Versión</span>
                <Badge variant="secondary">v1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Última Actualización
                </span>
                <span className="text-sm text-muted-foreground">
                  Hace 2 días
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado</span>
                <Badge variant="default">Operativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
