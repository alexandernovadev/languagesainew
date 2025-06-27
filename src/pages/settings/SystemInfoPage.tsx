import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateToSpanish } from "@/utils/common/time/formatDate";
import packageJson from "../../../package.json";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

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
          toast.success("Información del sistema cargada exitosamente");
        } else {
          setError("Error al obtener información del backend");
          toast.error("Error al obtener información del backend");
        }
      } catch (err) {
        setError("No se pudo conectar con el backend");
        toast.error("No se pudo conectar con el backend");
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
                <div className="flex items-center gap-2">
                  <Skeleton className="w-16 h-6 rounded" />
                  <Skeleton className="w-4 h-4 rounded-full" />
                </div>
              ) : error ? (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Error</Badge>
                  <Skeleton className="w-4 h-4 rounded-full bg-red-200" />
                </div>
              ) : backendInfo ? (
                <Badge variant="secondary">{backendInfo.version}</Badge>
              ) : (
                <Badge variant="outline">No disponible</Badge>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fecha Backend</span>
              {loading ? (
                <Skeleton className="w-24 h-4" />
              ) : error ? (
                <span className="text-sm text-muted-foreground">No disponible</span>
              ) : backendInfo ? (
                <span className="text-sm text-muted-foreground">{formatDateToSpanish(backendInfo.date)}</span>
              ) : (
                <span className="text-sm text-muted-foreground">No disponible</span>
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
