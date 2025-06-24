import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen } from "lucide-react";
import { wordService } from "@/services/wordService";
import { lectureService } from "@/services/lectureService";
import { downloadJSON } from "@/utils/common";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";

export default function ExportSettingsPage() {
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState<{ words: boolean; lectures: boolean }>({ words: false, lectures: false });

  const handleExportWords = async () => {
    setExportLoading((prev) => ({ ...prev, words: true }));
    try {
      const data = await wordService.exportWords();
      downloadJSON(data, "words-export");
      toast({
        title: "Exportación exitosa",
        description: "Las palabras se han exportado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al exportar",
        description: error.message || "No se pudieron exportar las palabras",
        variant: "destructive",
      });
    } finally {
      setExportLoading((prev) => ({ ...prev, words: false }));
    }
  };

  const handleExportLectures = async () => {
    setExportLoading((prev) => ({ ...prev, lectures: true }));
    try {
      const data = await lectureService.exportLectures();
      downloadJSON(data, "lectures-export");
      toast({
        title: "Exportación exitosa",
        description: "Las lecturas se han exportado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al exportar",
        description: error.message || "No se pudieron exportar las lecturas",
        variant: "destructive",
      });
    } finally {
      setExportLoading((prev) => ({ ...prev, lectures: false }));
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Exportación de Datos"
        description="Descarga tus palabras y lecturas en formato JSON para respaldar tu información."
      />
      <Card className="w-full">
        <CardContent className="space-y-6 py-8">
          <div className="grid gap-4">
            <Button
              variant="outline"
              onClick={handleExportWords}
              disabled={exportLoading.words}
              className="justify-start w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              {exportLoading.words ? "Exportando..." : "Exportar Palabras"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportLectures}
              disabled={exportLoading.lectures}
              className="justify-start w-full"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              {exportLoading.lectures ? "Exportando..." : "Exportar Lecturas"}
            </Button>
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Los archivos se descargarán automáticamente en formato JSON.
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
} 