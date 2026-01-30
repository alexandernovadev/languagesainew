import { useState, useEffect } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { systemService, SystemInfo } from "@/services/systemService";
import { formatDateTimeSpanish } from "@/utils/common/time/formatDate";
import { Server, Calendar, Code, Globe } from "lucide-react";
import { toast } from "sonner";

export default function SystemInfoPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await systemService.getHealthCheck();
      if (response.success && response.data) {
        setSystemInfo(response.data);
      } else {
        setError("No se pudo obtener la información del sistema");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Error al cargar la información del sistema";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getEnvironmentVariant = (env: string) => {
    switch (env.toLowerCase()) {
      case "production":
        return "default";
      case "development":
        return "secondary";
      case "staging":
        return "outline";
      default:
        return "outline";
    }
  };

  const getEnvironmentLabel = (env: string) => {
    switch (env.toLowerCase()) {
      case "production":
        return "Producción";
      case "development":
        return "Desarrollo";
      case "staging":
        return "Staging";
      default:
        return env;
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Información del Sistema" 
        description="Estado y detalles del servidor"
      />

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={loadSystemInfo}
                className="text-sm text-primary hover:underline"
              >
                Reintentar
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && systemInfo && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Estado del Servidor</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge variant="default" className="bg-green-500">
                    En línea
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ambiente:</span>
                  <Badge variant={getEnvironmentVariant(systemInfo.environment)}>
                    {getEnvironmentLabel(systemInfo.environment)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Versión</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Versión:</span>
                  <Badge variant="outline" className="font-mono">
                    {systemInfo.version}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Fecha y Hora del Servidor</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Última actualización:</span>
                  <span className="text-sm font-medium">
                    {formatDateTimeSpanish(systemInfo.date)}
                  </span>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Fecha ISO:</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {systemInfo.date}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
