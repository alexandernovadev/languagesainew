import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import packageJson from "../../../package.json";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface BackendInfo {
  date: string;
  version: string;
}

export default function SystemInfoPage() {
  const [backendInfo, setBackendInfo] = useState<BackendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get("/");
        const data = response.data;

        if (data.success) {
          setBackendInfo(data.data);
        } else {
          setError("Error al obtener información del backend");
        }
      } catch (err) {
        setError("No se pudo conectar con el backend");
      } finally {
        setLoading(false);
      }
    };

    fetchBackendInfo();
  }, []);

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
              <span className="text-sm font-medium">Versión Frontend</span>
              <Badge variant="secondary">v{packageJson.version}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Versión Backend</span>
              {loading ? (
                <Badge variant="outline">Cargando...</Badge>
              ) : error ? (
                <Badge variant="destructive">Error</Badge>
              ) : backendInfo ? (
                <Badge variant="secondary">{backendInfo.version}</Badge>
              ) : (
                <Badge variant="outline">No disponible</Badge>
              )}
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
