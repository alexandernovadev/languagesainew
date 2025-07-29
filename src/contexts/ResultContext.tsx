import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ModalNova } from '@/components/ui/modal-nova';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ApiResult {
  success: boolean;
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  method?: string;
  response?: any;
  stack?: string;
  context?: string;
  timestamp: Date;
  data?: any;
}

interface ResultState {
  isOpen: boolean;
  result: ApiResult | null;
}

interface ResultContextType {
  result: ResultState;
  showResult: (result: any, context?: string) => void;
  hideResult: () => void;
  clearResult: () => void;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export function ResultProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<ResultState>({
    isOpen: false,
    result: null,
  });

  const showResult = (resultData: any, context?: string) => {
    // Determinar si es éxito o error
    const isSuccess = resultData.success !== false && !resultData.error;
    
    // Extraer información del resultado de API
    const apiResult: ApiResult = {
      success: isSuccess,
      message: resultData.message || resultData.response?.data?.message || (isSuccess ? 'Operación exitosa' : 'Error desconocido'),
      status: resultData.response?.status,
      statusText: resultData.response?.statusText,
      url: resultData.config?.url,
      method: resultData.config?.method,
      response: resultData.response?.data,
      stack: resultData.stack,
      context: context,
      timestamp: new Date(),
      data: resultData.data || resultData.response?.data,
    };

    setResult({
      isOpen: true,
      result: apiResult,
    });

    // Mostrar toast según el tipo
    if (isSuccess) {
      toast.success(apiResult.message, {
        description: context ? `Operación en: ${context}` : undefined,
      });
    } else {
      toast.error(apiResult.message, {
        description: context ? `Error en: ${context}` : undefined,
      });
    }
  };

  const hideResult = () => {
    setResult(prev => ({ ...prev, isOpen: false }));
  };

  const clearResult = () => {
    setResult({ isOpen: false, result: null });
  };

  const getStatusIcon = () => {
    if (result.result?.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (result.result?.success) {
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
    
    if (result.result) {
      if (result.result.status) {
        summaryItems.push({ 
          label: "Status", 
          value: `${result.result.status} ${result.result.statusText || ''}`, 
          variant: result.result.success ? "default" : "destructive" 
        });
      }
      if (result.result.method) {
        summaryItems.push({ 
          label: "Método", 
          value: result.result.method.toUpperCase(), 
          variant: "default" 
        });
      }
      if (result.result.context) {
        summaryItems.push({ 
          label: "Contexto", 
          value: result.result.context, 
          variant: "secondary" 
        });
      }
      if (result.result.timestamp) {
        summaryItems.push({ 
          label: "Timestamp", 
          value: result.result.timestamp.toLocaleString(), 
          variant: "outline" 
        });
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
    <ResultContext.Provider value={{ result, showResult, hideResult, clearResult }}>
      {children}

      {/* Modal de Resultado Global */}
      {result.isOpen && result.result && (
        <ModalNova
          open={result.isOpen}
          onOpenChange={hideResult}
          title={`Resultado: ${result.result.context || 'API'}`}
          description={result.result.message}
          height="h-[95dvh]"
        >
          <div className="space-y-4 p-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">{result.result.context || 'Resultado de API'}</span>
                </div>
                {getStatusBadge()}
              </div>

              <div className="space-y-4">
                {/* Summary */}
                {renderSummary()}

                {/* Request Details */}
                {result.result.url && renderDataSection("Detalles de la Petición", {
                  URL: result.result.url,
                  Método: result.result.method?.toUpperCase(),
                  Status: `${result.result.status} ${result.result.statusText || ''}`,
                  Timestamp: result.result.timestamp.toLocaleString()
                })}

                {/* Server Response */}
                {result.result.response && renderDataSection("Respuesta del Servidor", result.result.response)}

                {/* Data */}
                {result.result.data && renderDataSection("Datos", result.result.data)}

                {/* Stack Trace (solo en desarrollo) */}
                {import.meta.env.DEV && result.result.stack && renderDataSection("Stack Trace", result.result.stack)}

                {/* Raw Result Data */}
                {result.result && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Datos Completos</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <pre className="text-xs p-2 rounded overflow-x-auto border">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
          </div>
        </ModalNova>
      )}
    </ResultContext.Provider>
  );
}

export function useResultHandler() {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useResultHandler must be used within a ResultProvider');
  }
  return context;
} 