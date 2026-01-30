import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useImport, ImportType } from "@/shared/hooks/useImport";
import { Upload, FileJson, X, Loader2, CheckCircle, Info, AlertCircle } from "lucide-react";

interface ImportTabProps {
  type: ImportType;
  title: string;
}

export function ImportTab({ type, title }: ImportTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    selectedFile,
    setSelectedFile,
    duplicateStrategy,
    setDuplicateStrategy,
    batchSize,
    setBatchSize,
    isValidating,
    isImporting,
    validationResult,
    importResult,
    handleValidate,
    handleImport,
    clearFile,
  } = useImport(type);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Por favor selecciona un archivo JSON válido");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Por favor selecciona un archivo JSON válido");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const validationPassed = validationResult && validationResult.invalid === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Selecciona un archivo JSON para validar e importar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* FILE UPLOAD */}
        <div className="space-y-2">
          <Label>Archivo JSON</Label>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              selectedFile ? "border-primary" : "hover:border-primary"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-4">
                <FileJson className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arrastra tu archivo JSON aquí o haz clic para seleccionar
                </p>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Seleccionar Archivo
                </Button>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* CONFIGURACIÓN */}
        {selectedFile && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Duplicate Strategy */}
            <div className="space-y-2">
              <Label htmlFor="duplicateStrategy">Estrategia de Duplicados</Label>
              <Select 
                value={duplicateStrategy} 
                onValueChange={(value: any) => setDuplicateStrategy(value)}
              >
                <SelectTrigger id="duplicateStrategy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Skip - Omitir duplicados</SelectItem>
                  <SelectItem value="overwrite">Overwrite - Sobrescribir</SelectItem>
                  <SelectItem value="merge">Merge - Fusionar datos</SelectItem>
                  <SelectItem value="error">Error - Fallar si hay duplicados</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Cómo manejar registros duplicados
              </p>
            </div>

            {/* Batch Size */}
            <div className="space-y-2">
              <Label htmlFor="batchSize">Tamaño de Lote</Label>
              <Input
                id="batchSize"
                type="number"
                min="1"
                max="100"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Número de registros por lote (1-100)
              </p>
            </div>
          </div>
        )}

        {/* ACCIONES */}
        {selectedFile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleValidate}
              disabled={isValidating || isImporting}
              className="flex-1"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validar
                </>
              )}
            </Button>

            <Button
              onClick={handleImport}
              disabled={isValidating || isImporting || !validationPassed}
              className="flex-1"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </>
              )}
            </Button>
          </div>
        )}

        {/* RESULTADOS DE VALIDACIÓN */}
        {validationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Resultados de Validación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Estadísticas principales */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center p-4">
                  <p className="text-3xl font-bold mb-1">
                    {validationResult.total}
                  </p>
                  <p className="text-xs text-muted-foreground">Total de Registros</p>
                </Card>
                
                <Card className="text-center p-4 border-green-500/50">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {validationResult.valid}
                  </p>
                  <p className="text-xs text-muted-foreground">Válidos</p>
                  {validationResult.total > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      {((validationResult.valid / validationResult.total) * 100).toFixed(1)}%
                    </p>
                  )}
                </Card>
                
                <Card className="text-center p-4 border-red-500/50">
                  <p className="text-3xl font-bold text-red-600 mb-1">
                    {validationResult.invalid}
                  </p>
                  <p className="text-xs text-muted-foreground">Inválidos</p>
                  {validationResult.total > 0 && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {((validationResult.invalid / validationResult.total) * 100).toFixed(1)}%
                    </p>
                  )}
                </Card>
              </div>

              {/* Mensaje de estado */}
              {validationResult.valid > 0 && validationResult.invalid === 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      ¡Validación exitosa!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Todos los registros son válidos. Puedes proceder a importar.
                    </p>
                  </div>
                </div>
              )}

              {validationResult.invalid > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      Se encontraron {validationResult.invalid} errores
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Corrige los errores antes de importar.
                    </p>
                  </div>
                </div>
              )}

              {/* Lista detallada de errores */}
              {validationResult.validationResults && validationResult.invalid > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Errores Detectados:</p>
                    <p className="text-xs text-muted-foreground">
                      Mostrando {Math.min(validationResult.invalid, 20)} de {validationResult.invalid}
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {validationResult.validationResults
                      .filter(r => r.status === "invalid")
                      .slice(0, 20)
                      .map((result, idx) => {
                        const errors = result.validationResult?.errors || result.errors || [];
                        const itemData = result.data;
                        const itemIdentifier = itemData?.word || itemData?.expression || itemData?.title || `Item ${result.index + 1}`;
                        
                        return (
                          <div 
                            key={idx} 
                            className="text-sm border rounded-lg p-3 space-y-1 hover:border-red-500/50 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-mono bg-red-500/20 text-red-600 px-1.5 py-0.5 rounded">
                                #{result.index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate" title={itemIdentifier}>
                                  {itemIdentifier}
                                </p>
                                <div className="mt-1 space-y-0.5">
                                  {errors.map((error: string, errorIdx: number) => (
                                    <p key={errorIdx} className="text-xs text-red-600 flex items-start gap-1">
                                      <span className="text-red-500 mt-0.5">•</span>
                                      <span>{error}</span>
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {validationResult.invalid > 20 && (
                    <p className="text-xs text-center text-muted-foreground py-2 border-t">
                      ... y {validationResult.invalid - 20} errores más
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* RESULTADOS DE IMPORTACIÓN */}
        {importResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Resultados de Importación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="text-center p-3 border-green-500/50">
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    {importResult.imported}
                  </p>
                  <p className="text-xs text-muted-foreground">Importados</p>
                </Card>
                
                <Card className="text-center p-3">
                  <p className="text-2xl font-bold mb-1">
                    {importResult.updated}
                  </p>
                  <p className="text-xs text-muted-foreground">Actualizados</p>
                </Card>
                
                <Card className="text-center p-3 border-yellow-500/50">
                  <p className="text-2xl font-bold text-yellow-600 mb-1">
                    {importResult.skipped}
                  </p>
                  <p className="text-xs text-muted-foreground">Omitidos</p>
                </Card>
                
                <Card className="text-center p-3 border-red-500/50">
                  <p className="text-2xl font-bold text-red-600 mb-1">
                    {importResult.errors}
                  </p>
                  <p className="text-xs text-muted-foreground">Errores</p>
                </Card>
              </div>

              {/* Mensaje de éxito */}
              <div className="flex items-center gap-2 p-3 rounded-lg border border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-600">
                    ¡Importación completada!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {importResult.imported} registros importados exitosamente
                    {importResult.updated > 0 && `, ${importResult.updated} actualizados`}
                    {importResult.skipped > 0 && `, ${importResult.skipped} omitidos`}
                  </p>
                </div>
              </div>

              {/* Detalles de errores si los hay */}
              {importResult.errorDetails && importResult.errorDetails.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-600">
                      Algunos registros presentaron errores ({importResult.errorDetails.length})
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {importResult.errorDetails.slice(0, 10).map((error, idx) => (
                      <div 
                        key={idx} 
                        className="text-sm border rounded-lg p-3 space-y-1"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-mono bg-red-500/20 text-red-600 px-1.5 py-0.5 rounded">
                            #{error.index + 1}
                          </span>
                          <p className="text-xs text-red-600 flex-1">
                            {error.error}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {importResult.errorDetails.length > 10 && (
                    <p className="text-xs text-center text-muted-foreground py-2 border-t">
                      ... y {importResult.errorDetails.length - 10} errores más
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
