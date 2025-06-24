import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SystemInfoPage() {
  return (
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
            <span className="text-sm font-medium">Última Actualización</span>
            <span className="text-sm text-muted-foreground">Hace 2 días</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado</span>
            <Badge variant="default">Operativo</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 