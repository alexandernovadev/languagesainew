import { useState, useEffect } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
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
  LogFileInfo,
  LogContentResponse,
} from "@/services/logsService";
import {
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Search,
  X,
  Eye,
  Loader2,
  FileCode,
  AlertTriangle,
  Zap,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const LOG_ICONS: Record<string, any> = {
  app: FileText,
  errors: AlertTriangle,
  exceptions: AlertCircle,
  rejections: Zap,
};

const LOG_COLORS: Record<string, string> = {
  app: "border-blue-500/50 text-blue-400 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  errors: "border-red-500/50 text-red-400 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  exceptions: "border-orange-500/50 text-orange-400 hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]",
  rejections: "border-yellow-500/50 text-yellow-400 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogFileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<LogContentResponse["data"] | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [linesPerPage, setLinesPerPage] = useState(100);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (selectedLog) {
      loadLogContent();
    }
  }, [selectedLog, currentPage, linesPerPage, search, level, startDate, endDate]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await logsService.getLogsList();
      if (response.success && response.data) {
        setLogs(response.data.logs);
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading logs");
    } finally {
      setLoading(false);
    }
  };

  const loadLogContent = async () => {
    if (!selectedLog) return;

    setLoadingContent(true);
    try {
      const response = await logsService.getLogContent(selectedLog, {
        lines: linesPerPage,
        page: currentPage,
        search: search || undefined,
        level: level || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (response.success && response.data) {
        setLogContent(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading log content");
    } finally {
      setLoadingContent(false);
    }
  };

  const handleSelectLog = (logName: string) => {
    setSelectedLog(logName);
    setCurrentPage(1);
    setSearch("");
    setLevel("");
    setStartDate("");
    setEndDate("");
  };

  const handleDownload = async (logName: string, compress: boolean = false) => {
    try {
      const blob = await logsService.downloadLog(logName, compress);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${logName}-${new Date().toISOString().replace(/[:.]/g, "-")}${compress ? ".gz" : ".log"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Log ${logName} downloaded successfully`);
    } catch (error: any) {
      toast.error(error.message || "Error downloading log");
    }
  };

  const handleDeleteClick = (logName: string) => {
    setLogToDelete(logName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!logToDelete) return;

    setDeleting(true);
    try {
      await logsService.deleteLog(logToDelete);
      toast.success(`Log ${logToDelete} cleared successfully`);
      setDeleteDialogOpen(false);
      setLogToDelete(null);
      if (selectedLog === logToDelete) {
        setSelectedLog(null);
        setLogContent(null);
      }
      await loadLogs();
    } catch (error: any) {
      toast.error(error.message || "Error deleting log");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAllClick = () => {
    setDeleteAllDialogOpen(true);
  };

  const handleDeleteAllConfirm = async () => {
    setDeleting(true);
    try {
      await logsService.deleteAllLogs();
      toast.success("All logs cleared successfully");
      setDeleteAllDialogOpen(false);
      setSelectedLog(null);
      setLogContent(null);
      await loadLogs();
    } catch (error: any) {
      toast.error(error.message || "Error deleting all logs");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const highlightLogLine = (line: string) => {
    // Highlight different log levels
    if (line.includes("ERROR:")) {
      return "text-red-400";
    }
    if (line.includes("WARN:")) {
      return "text-yellow-400";
    }
    if (line.includes("INFO:")) {
      return "text-blue-400";
    }
    if (line.includes("DEBUG:")) {
      return "text-purple-400";
    }
    return "text-gray-300";
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Logs del Sistema"
        description="Visualiza y gestiona los logs del servidor"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadLogs}
              disabled={loading}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllClick}
              disabled={deleting || logs.length === 0}
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Logs List */}
        <div className="space-y-4">
          <div className="border border-purple-500/30 rounded-lg p-4 bg-transparent">
            <h3 className="text-lg font-semibold mb-4 text-purple-400 flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Logs Disponibles
            </h3>

            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay logs disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const Icon = LOG_ICONS[log.name] || FileText;
                  const colorClass = LOG_COLORS[log.name] || LOG_COLORS.app;
                  const isSelected = selectedLog === log.name;

                  return (
                    <div
                      key={log.name}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        isSelected
                          ? colorClass.replace("/50", "").replace("hover:", "")
                          : colorClass
                      } ${isSelected ? "ring-2 ring-offset-2 ring-offset-background" : ""}`}
                      onClick={() => handleSelectLog(log.name)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base capitalize">
                              {log.name}.log
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2 text-xs">
                              <Badge variant="outline" className="text-xs">
                                {log.sizeFormatted}
                              </Badge>
                              {log.lineCount !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  {log.lineCount.toLocaleString()} líneas
                                </Badge>
                              )}
                              <span className="text-muted-foreground">
                                {formatDate(log.modified)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownload(log.name)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(log.name)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {logs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-500/20 text-sm text-muted-foreground">
                Total: {logs.length} archivos
              </div>
            )}
          </div>
        </div>

        {/* Log Content */}
        <div className="space-y-4">
          {selectedLog ? (
            <>
              {/* Filters */}
              <div className="border border-cyan-500/30 rounded-lg p-4 bg-transparent">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Filtros
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar en el log..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="flex-1"
                    />
                    {(search || level || startDate || endDate) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSearch("");
                          setLevel("");
                          setStartDate("");
                          setEndDate("");
                          setCurrentPage(1);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={level || "all"} onValueChange={(v) => {
                      setLevel(v === "all" ? "" : v);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="INFO">INFO</SelectItem>
                        <SelectItem value="ERROR">ERROR</SelectItem>
                        <SelectItem value="WARN">WARN</SelectItem>
                        <SelectItem value="DEBUG">DEBUG</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Líneas por página"
                      value={linesPerPage}
                      onChange={(e) => {
                        setLinesPerPage(parseInt(e.target.value) || 100);
                        setCurrentPage(1);
                      }}
                      min={10}
                      max={1000}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Desde"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <Input
                      type="date"
                      placeholder="Hasta"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="border border-green-500/30 rounded-lg p-4 bg-transparent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Contenido: {selectedLog}.log
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedLog, false)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedLog, true)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      .gz
                    </Button>
                  </div>
                </div>

                {loadingContent ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                ) : logContent ? (
                  <>
                    <div className="bg-black/40 rounded-lg p-4 max-h-[500px] overflow-auto font-mono text-sm">
                      {logContent.lines.length === 0 ? (
                        <p className="text-muted-foreground">No hay líneas que mostrar</p>
                      ) : (
                        logContent.lines.map((line, idx) => (
                          <div
                            key={idx}
                            className={`${highlightLogLine(line)} whitespace-pre-wrap break-words mb-1`}
                          >
                            {line}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination */}
                    {logContent.pagination.totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Mostrando {((logContent.pagination.currentPage - 1) * logContent.pagination.linesPerPage) + 1}-
                          {Math.min(
                            logContent.pagination.currentPage * logContent.pagination.linesPerPage,
                            logContent.pagination.filteredLines
                          )}{" "}
                          de {logContent.pagination.filteredLines} líneas
                          {logContent.pagination.filteredLines !== logContent.pagination.totalLines && (
                            <span className="text-xs ml-2">
                              (de {logContent.pagination.totalLines} totales)
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={logContent.pagination.currentPage === 1}
                          >
                            Anterior
                          </Button>
                          <span className="flex items-center px-3 text-sm">
                            {logContent.pagination.currentPage} / {logContent.pagination.totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(logContent.pagination.totalPages, p + 1))}
                            disabled={logContent.pagination.currentPage === logContent.pagination.totalPages}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-muted-foreground">
                      Tamaño: {logContent.fileInfo.size} | Modificado: {formatDate(logContent.fileInfo.modified)}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay contenido para mostrar</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="border border-gray-500/30 rounded-lg p-8 bg-transparent text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecciona un log para ver su contenido</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="⚠️ ¿Borrar este log?"
        description={
          <>
            Esto eliminará todo el contenido del log <strong>{logToDelete}</strong>.
            <br />
            <br />
            Esta acción <strong className="text-destructive">no se puede deshacer</strong>.
          </>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setLogToDelete(null);
        }}
        confirmText="Sí, borrar"
        cancelText="Cancelar"
        confirmVariant="destructive"
        loading={deleting}
      />

      {/* Delete All Dialog */}
      <AlertDialogNova
        open={deleteAllDialogOpen}
        onOpenChange={setDeleteAllDialogOpen}
        title="⚠️ ¿Borrar TODOS los logs?"
        description={
          <>
            Esto eliminará el contenido de <strong>TODOS los logs</strong>.
            <br />
            <br />
            Esta acción <strong className="text-destructive">no se puede deshacer</strong>.
          </>
        }
        onConfirm={handleDeleteAllConfirm}
        onCancel={() => setDeleteAllDialogOpen(false)}
        confirmText="Sí, borrar todo"
        cancelText="Cancelar"
        confirmVariant="destructive"
        loading={deleting}
      />
    </div>
  );
}
