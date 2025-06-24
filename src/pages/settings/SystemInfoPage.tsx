import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";

export default function SystemInfoPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Información del Sistema"
        description="Consulta los detalles técnicos y el estado actual de la aplicación."
      />
      <Card className="w-full">
        <CardContent className="space-y-6 py-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Versión</span>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Última Actualización</span>
              <span className="text-sm text-muted-foreground">Hace 2 días</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado</span>
              <Badge variant="default">Operativo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
} 