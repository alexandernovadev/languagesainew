import { useState, useEffect } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { systemService, SystemInfo } from "@/services/systemService";
import { formatDateTimeSpanish } from "@/utils/common/time/formatDate";
import { Server, Monitor } from "lucide-react";
import { toast } from "sonner";
import packageJson from "../../package.json";

function InfoBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
      <span className="text-xs text-muted-foreground uppercase tracking-wide lg:min-w-[8rem]">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

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
        <div className="space-y-6 w-full">
          {/* Backend */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Server className="h-5 w-5" />
                Backend
              </h2>
              <div className="space-y-4">
                <InfoBlock label="Estado" value={<Badge variant="default">En línea</Badge>} />
                <InfoBlock label="Ambiente" value={<Badge variant={getEnvironmentVariant(systemInfo.environment)}>{getEnvironmentLabel(systemInfo.environment)}</Badge>} />
                <InfoBlock label="Versión" value={<span className="font-mono text-sm">{systemInfo.version}</span>} />
                <InfoBlock label="Último deploy" value={formatDateTimeSpanish(systemInfo.date)} />
              </div>
            </CardContent>
          </Card>

          {/* Frontend */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Frontend
              </h2>
              <div className="space-y-4">
                <InfoBlock label="Versión" value={<span className="font-mono text-sm">{packageJson.version}</span>} />
                <InfoBlock
                  label="Último deploy"
                  value={(packageJson as { buildDate?: string }).buildDate
                    ? formatDateTimeSpanish((packageJson as { buildDate?: string }).buildDate!)
                    : "N/A (modo desarrollo)"}
                />
                <InfoBlock
                  label="Ambiente"
                  value={<Badge variant={import.meta.env.DEV ? "secondary" : "default"}>{import.meta.env.DEV ? "Development" : "Production"}</Badge>}
                />
                <InfoBlock
                  label="URL Back"
                  value={<span className="font-mono text-xs break-all">{import.meta.env.VITE_BACK_URL || "No configurado"}</span>}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
