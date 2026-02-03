import { useState, useEffect } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import {
  logsService,
  Log,
  LogStatsResponse,
} from "@/services/logsService";
import {
  FileCode,
  RefreshCw,
  Trash2,
  Search,
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Filter,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateTimeSpanish } from "@/utils/common/time/formatDate";

const STATUS_COLORS: Record<number, string> = {
  400: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  401: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  403: "bg-red-500/20 text-red-400 border-red-500/50",
  404: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  500: "bg-red-500/20 text-red-500 border-red-500/50",
  502: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  503: "bg-pink-500/20 text-pink-400 border-pink-500/50",
};

const getStatusColor = (statusCode: number): string => {
  return STATUS_COLORS[statusCode] || "bg-gray-500/20 text-gray-400 border-gray-500/50";
};

const getStatusIcon = (statusCode: number) => {
  if (statusCode >= 500) return AlertCircle;
  if (statusCode >= 400) return AlertTriangle;
  return Info;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LogStatsResponse["data"] | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusCode, setStatusCode] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [page, limit, search, statusCode, startDate, endDate]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
      };
      if (search) params.search = search;
      if (statusCode) params.statusCode = parseInt(statusCode);
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await logsService.getLogs(params);
      if (response.success && response.data) {
        setLogs(response.data.logs);
        setTotalPages(response.data.pagination.totalPages);
        setTotal(response.data.pagination.total);
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading logs");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const response = await logsService.getLogStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Error loading stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDelete = async () => {
    if (!logToDelete) return;
    setDeleting(true);
    try {
      await logsService.deleteLog(logToDelete);
      toast.success("Log eliminado exitosamente");
      setDeleteDialogOpen(false);
      setLogToDelete(null);
      await loadLogs();
      await loadStats();
    } catch (error: any) {
      toast.error(error.message || "Error eliminando log");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const params: any = {};
      if (statusCode) params.statusCode = parseInt(statusCode);
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (search) params.search = search;

      await logsService.deleteLogs(params);
      toast.success("Logs eliminados exitosamente");
      setDeleteAllDialogOpen(false);
      await loadLogs();
      await loadStats();
    } catch (error: any) {
      toast.error(error.message || "Error eliminando logs");
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusCode("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters = search || statusCode || startDate || endDate;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs del Sistema"
        description="Visualiza y gestiona los logs de errores del servidor"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadLogs}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
            {hasActiveFilters && (
            <Button
              variant="destructive"
                size="sm"
                onClick={() => setDeleteAllDialogOpen(true)}
              disabled={deleting || logs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Filtrados
            </Button>
            )}
          </div>
        }
        filters={
          showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Buscar en mensajes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusCode} onValueChange={setStatusCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Código de estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="400">400 - Bad Request</SelectItem>
                  <SelectItem value="401">401 - Unauthorized</SelectItem>
                  <SelectItem value="403">403 - Forbidden</SelectItem>
                  <SelectItem value="404">404 - Not Found</SelectItem>
                  <SelectItem value="500">500 - Server Error</SelectItem>
                  <SelectItem value="502">502 - Bad Gateway</SelectItem>
                  <SelectItem value="503">503 - Service Unavailable</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Fecha inicio"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Fecha fin"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )
        }
      />

      {/* Stats Cards */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary/70">Total de Logs</CardDescription>
              <CardTitle className="text-2xl text-primary">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-red-400/70">Últimas 24h</CardDescription>
              <CardTitle className="text-2xl text-red-400">{stats.recentErrors}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-400/70">Errores 4xx</CardDescription>
              <CardTitle className="text-2xl text-yellow-400">
                {Object.entries(stats.byStatusCode)
                  .filter(([code]) => parseInt(code) >= 400 && parseInt(code) < 500)
                  .reduce((sum, [, count]) => sum + count, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-red-400/70">Errores 5xx</CardDescription>
              <CardTitle className="text-2xl text-red-400">
                {Object.entries(stats.byStatusCode)
                  .filter(([code]) => parseInt(code) >= 500)
                  .reduce((sum, [, count]) => sum + count, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

        {/* Logs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Logs Disponibles</CardTitle>
              <CardDescription>
                {loading ? (
                  "Cargando..."
                ) : (
                  `Mostrando ${logs.length} de ${total} logs`
                )}
              </CardDescription>
            </div>
            <Select value={limit.toString()} onValueChange={(v) => { setLimit(parseInt(v)); setPage(1); }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
        <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay logs disponibles</p>
              </div>
            ) : (
            <div className="space-y-4">
                {logs.map((log) => {
                const StatusIcon = getStatusIcon(log.statusCode);
                  return (
                  <Card
                    key={log._id}
                    className="border-l-4 border-l-primary/50 hover:border-l-primary transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={getStatusColor(log.statusCode)}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {log.statusCode}
                              </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTimeSpanish(new Date(log.createdAt))}
                              </span>
                          </div>
                          <p className="text-sm font-medium">{log.errorMessage}</p>
                          {log.errorData && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                Ver detalles del error
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                                {typeof log.errorData === "string"
                                  ? log.errorData
                                  : JSON.stringify(log.errorData, null, 2)}
                              </pre>
                            </details>
                          )}
                          {log.stack && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                Ver stack trace
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto text-[10px]">
                                {log.stack}
                              </pre>
                            </details>
                          )}
                        </div>
                          <Button
                            variant="ghost"
                          size="sm"
                          onClick={() => {
                            setLogToDelete(log._id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            )}

          {/* Pagination */}
          {!loading && logs.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                    >
                  <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                          </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="⚠️ ¿Eliminar este log?"
        description="Esta acción no se puede deshacer. El log será eliminado permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />

      {/* Delete All Dialog */}
      <AlertDialogNova
        open={deleteAllDialogOpen}
        onOpenChange={setDeleteAllDialogOpen}
        title="⚠️ ¿Eliminar logs filtrados?"
        description={`Esto eliminará todos los logs que coincidan con los filtros actuales (${total} logs). Esta acción no se puede deshacer.`}
        confirmText="Eliminar Todos"
        cancelText="Cancelar"
        onConfirm={handleDeleteAll}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
