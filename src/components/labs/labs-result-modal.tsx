import React from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

interface LabsResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  actionName: string;
}

export function LabsResultModal({ isOpen, onClose, result, actionName }: LabsResultModalProps) {
  if (!result) return null;

  const getStatusIcon = () => {
    if (result.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (result.success) {
      return <Badge variant="default">Éxito</Badge>;
    }
    return <Badge variant="destructive">Error</Badge>;
  };

  const renderDataSection = (title: string, data: any) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {Array.isArray(data) ? (
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="text-sm p-2 rounded border">
                  {typeof item === 'object' ? (
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  ) : (
                    <span>{String(item)}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <pre className="text-xs p-2 rounded overflow-x-auto border">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSummary = () => {
    const summaryItems = [];
    
    if (result.data) {
      if (result.data.totalCreated !== undefined) {
        summaryItems.push({ label: "Creados", value: result.data.totalCreated, variant: "default" });
      }
      if (result.data.deletedCount !== undefined) {
        summaryItems.push({ label: "Eliminados", value: result.data.deletedCount, variant: "destructive" });
      }
      if (result.data.totalBefore !== undefined) {
        summaryItems.push({ label: "Total antes", value: result.data.totalBefore, variant: "blue" });
      }
      if (result.data.modifiedCount !== undefined) {
        summaryItems.push({ label: "Modificados", value: result.data.modifiedCount, variant: "yellow" });
      }
      if (result.data.totalErrors !== undefined) {
        summaryItems.push({ label: "Errores", value: result.data.totalErrors, variant: "destructive" });
      }
    }

    if (summaryItems.length === 0) return null;

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {summaryItems.map((item, index) => (
              <Badge key={index} variant={item.variant as any}>
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ModalNova
      open={isOpen}
      onOpenChange={onClose}
      title={`Resultado: ${actionName}`}
      description={result.message || "Operación completada"}
      height="h-auto"
    >
      <div className="space-y-4 p-6 max-h-[70vh] overflow-y-auto">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{actionName}</span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-4">
          {/* Summary */}
          {renderSummary()}

          {/* Created Users */}
          {result.data?.createdUsers && renderDataSection("Usuarios Creados", result.data.createdUsers)}

          {/* Errors */}
          {result.data?.errors && renderDataSection("Errores", result.data.errors)}

          {/* Backup Results */}
          {result.data?.backupResults && renderDataSection("Resultados de Backup", result.data.backupResults)}

          {/* Database Stats */}
          {result.data?.stats && renderDataSection("Estadísticas", result.data.stats)}

          {/* Raw Data */}
          {result.data && Object.keys(result.data).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Datos Completos</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <pre className="text-xs p-2 rounded overflow-x-auto border">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ModalNova>
  );
} 