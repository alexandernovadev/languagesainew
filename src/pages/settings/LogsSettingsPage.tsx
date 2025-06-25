import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { getLogs, exportLogs, clearLogs } from "@/services/logService";

const LEVELS = ["INFO", "ERROR", "UNKNOWN"];
const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export default function LogsSettingsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [level, setLevel] = useState<"INFO" | "ERROR" | "UNKNOWN" | undefined>(undefined);
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE" | "PATCH" | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [level, method, search, page, limit, dateFrom, dateTo]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await getLogs({ level, method, search, page, limit, dateFrom, dateTo });
      setLogs(res.data.data.logs || []);
      setTotal(res.data.data.pagination?.total || 0);
    } catch (e) {
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  const handleExport = async () => {
    await exportLogs("json");
    // Aquí puedes agregar lógica para descargar el archivo
  };

  const handleClear = async () => {
    await clearLogs();
    fetchLogs();
  };

  return (
    <PageLayout>
      <PageHeader
        title="Logs de la Aplicación"
        description="Consulta, filtra y exporta los logs de la aplicación."
      />
      <Card className="w-full">
        <CardContent className="py-8">
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <Select value={level} onValueChange={v => setLevel(v as typeof level)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined as any}>Todos</SelectItem>
                {LEVELS.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={method} onValueChange={v => setMethod(v as typeof method)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined as any}>Todos</SelectItem>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="w-48"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Input
              type="date"
              className="w-36"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Desde"
            />
            <Input
              type="date"
              className="w-36"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Hasta"
            />
            <Button onClick={fetchLogs} disabled={loading} variant="outline">Filtrar</Button>
            <Button onClick={handleExport} variant="secondary">Exportar</Button>
            <Button onClick={handleClear} variant="destructive">Limpiar Logs</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>User-Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No hay logs</TableCell>
                  </TableRow>
                )}
                {logs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.level}</TableCell>
                    <TableCell>{log.method}</TableCell>
                    <TableCell>{log.url}</TableCell>
                    <TableCell>{log.status}</TableCell>
                    <TableCell>{log.clientIP}</TableCell>
                    <TableCell>{log.userAgent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* La paginación real debe implementarse aquí con botones y lógica propia, ya que el componente Pagination solo renderiza un <nav> */}
          {/* <Pagination ... /> */}
        </CardContent>
      </Card>
    </PageLayout>
  );
} 