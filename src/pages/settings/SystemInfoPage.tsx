import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateToSpanish } from "@/utils/common/time/formatDate";
import { timeAgo } from "@/utils/common/time/timeAgo";
import packageJson from "../../../package.json";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Eye, X } from "lucide-react";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";

interface BackendInfo {
  date: string;
  version: string;
}

export default function SystemInfoPage() {
  const [backendInfo, setBackendInfo] = useState<BackendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  // Get frontend build date from package.json
  const frontendBuildDate =
    (packageJson as any).buildDate || new Date().toISOString();

  useEffect(() => {
    const fetchBackendInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get("/");
        const data = response.data;

        if (data.success) {
          setBackendInfo(data.data);
          toast.success("Información del sistema cargada exitosamente", {
            action: {
              label: <Eye className="h-4 w-4" />,
              onClick: () => handleApiResult({ success: true, data: data.data, message: "Información del sistema cargada exitosamente" }, "Cargar Información del Sistema")
            },
            cancel: {
              label: <X className="h-4 w-4" />,
              onClick: () => toast.dismiss()
            }
          });
        } else {
          setError("Error al obtener información del backend");
          handleApiResult({ success: false, message: "Error al obtener información del backend" }, "Cargar Información del Sistema");
        }
      } catch (err) {
        setError("No se pudo conectar con el backend");
        handleApiResult(err, "Cargar Información del Sistema");
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
              <span className="text-sm font-medium">Last Update Backend</span>
              {loading ? (
                <Skeleton className="w-24 h-4" />
              ) : error ? (
                <span className="text-sm text-muted-foreground">
                  No disponible
                </span>
              ) : backendInfo ? (
                <div className="flex flex-col items-end text-right">
                  <span className="text-sm text-muted-foreground">
                    {formatDateToSpanish(backendInfo.date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(backendInfo.date)}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  No disponible
                </span>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Update Frontend</span>
              <div className="flex flex-col items-end text-right">
                <span className="text-sm text-muted-foreground">
                  {formatDateToSpanish(frontendBuildDate)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(frontendBuildDate)}
                </span>
              </div>
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
