import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { FileText, BookOpen, Upload } from "lucide-react";
import { wordService } from "@/services/wordService";
import { lectureService } from "@/services/lectureService";
import { downloadJSON } from "@/utils/common";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Settings() {
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState<{
    words: boolean;
    lectures: boolean;
  }>({ words: false, lectures: false });

  const handleExportWords = async () => {
    setExportLoading(prev => ({ ...prev, words: true }));
    try {
      const data = await wordService.exportWords();
      downloadJSON(data, 'words-export');
      toast({
        title: "Exportación exitosa",
        description: "Las palabras se han exportado correctamente",
      });
    } catch (error: any) {
      console.error('Error al exportar palabras:', error.message);
      toast({
        title: "Error al exportar",
        description: error.message || "No se pudieron exportar las palabras",
        variant: "destructive",
      });
    } finally {
      setExportLoading(prev => ({ ...prev, words: false }));
    }
  };

  const handleExportLectures = async () => {
    setExportLoading(prev => ({ ...prev, lectures: true }));
    try {
      const data = await lectureService.exportLectures();
      downloadJSON(data, 'lectures-export');
      toast({
        title: "Exportación exitosa",
        description: "Las lecturas se han exportado correctamente",
      });
    } catch (error: any) {
      console.error('Error al exportar lecturas:', error.message);
      toast({
        title: "Error al exportar",
        description: error.message || "No se pudieron exportar las lecturas",
        variant: "destructive",
      });
    } finally {
      setExportLoading(prev => ({ ...prev, lectures: false }));
    }
  };

  const handleImportWords = () => {
    // TODO: Implementar importación de palabras
    console.log("Importando palabras...");
  };

  const handleImportLectures = () => {
    // TODO: Implementar importación de lecturas
    console.log("Importando lecturas...");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Configuración"
        description="Gestiona la configuración de tu aplicación"
      />

      <div className="grid gap-6">
        {/* Configuración General */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>
              Preferencias básicas de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">
                  Notificaciones por Email
                </div>
                <div className="text-sm text-muted-foreground">
                  Recibir notificaciones por email
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">
                  Actualizaciones Automáticas
                </div>
                <div className="text-sm text-muted-foreground">
                  Instalar actualizaciones automáticamente
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Exportación de Datos */}
        <Card>
          <CardHeader>
            <CardTitle>Exportación de Datos</CardTitle>
            <CardDescription>
              Exporta tus palabras y lecturas en formato JSON
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                onClick={handleExportWords}
                disabled={exportLoading.words}
                className="justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                {exportLoading.words ? "Exportando..." : "Exportar Palabras"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportLectures}
                disabled={exportLoading.lectures}
                className="justify-start"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {exportLoading.lectures ? "Exportando..." : "Exportar Lecturas"}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Los archivos se descargarán automáticamente en formato JSON
            </div>
          </CardContent>
        </Card>

        {/* Importación de Datos */}
        <Card>
          <CardHeader>
            <CardTitle>Importación de Datos</CardTitle>
            <CardDescription>
              Importa palabras y lecturas desde archivos JSON
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                onClick={handleImportWords}
                className="justify-start"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar Palabras
              </Button>
              <Button 
                variant="outline" 
                onClick={handleImportLectures}
                className="justify-start"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar Lecturas
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Selecciona archivos JSON para importar tus datos
            </div>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>
              Detalles técnicos de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Versión</span>
                <Badge variant="secondary">v1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Última Actualización
                </span>
                <span className="text-sm text-muted-foreground">
                  Hace 2 días
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado</span>
                <Badge variant="default">Operativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
