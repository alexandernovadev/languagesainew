import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { exportService } from "@/services/exportService";
import { toast } from "sonner";
import { Download, Loader2, BookOpen, MessageSquare, Users, FileText } from "lucide-react";

type ExportType = "words" | "expressions" | "lectures" | "users" | null;

export default function ExportSettingsPage() {
  const [loading, setLoading] = useState<ExportType>(null);

  const handleExport = async (type: ExportType) => {
    if (!type) return;

    setLoading(type);
    try {
      let result;
      switch (type) {
        case "words":
          result = await exportService.exportWords();
          toast.success(`Palabras exportadas exitosamente: ${result.filename}`);
          break;
        case "expressions":
          result = await exportService.exportExpressions();
          toast.success(`Expresiones exportadas exitosamente: ${result.filename}`);
          break;
        case "lectures":
          result = await exportService.exportLectures();
          toast.success(`Lecturas exportadas exitosamente: ${result.filename}`);
          break;
        case "users":
          result = await exportService.exportUsers();
          toast.success(`Usuarios exportados exitosamente: ${result.filename}`);
          break;
      }
    } catch (error: any) {
      toast.error(error.message || "Error al exportar datos");
    } finally {
      setLoading(null);
    }
  };

  const exportCards = [
    {
      type: "words" as ExportType,
      title: "Exportar Palabras",
      description: "Exporta todas las palabras del vocabulario a un archivo JSON",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      type: "expressions" as ExportType,
      title: "Exportar Expresiones",
      description: "Exporta todas las expresiones idiomáticas a un archivo JSON",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      type: "lectures" as ExportType,
      title: "Exportar Lecturas",
      description: "Exporta todas las lecturas y contenido educativo a un archivo JSON",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      type: "users" as ExportType,
      title: "Exportar Usuarios",
      description: "Exporta todos los usuarios del sistema a un archivo JSON",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Exportar Datos" 
        description="Exporta los datos de la aplicación a archivos JSON para respaldo o migración"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {exportCards.map((card) => {
          const Icon = card.icon;
          const isLoading = loading === card.type;

          return (
            <Card key={card.type} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                  {card.title}
                </CardTitle>
                <CardDescription>
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport(card.type)}
                  disabled={isLoading || loading !== null}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-1">
            <li>Los archivos se descargarán automáticamente en formato JSON</li>
            <li>Los archivos incluyen todos los datos relacionados con cada tipo</li>
            <li>Puedes usar estos archivos para respaldo o importación posterior</li>
            <li>El nombre del archivo incluye un timestamp para evitar sobrescrituras</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
