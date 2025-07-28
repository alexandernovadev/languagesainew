import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, ClipboardList, HelpCircle } from "lucide-react";
import { wordService } from "@/services/wordService";
import { lectureService } from "@/services/lectureService";
import { examService } from "@/services/examService";
import { questionService } from "@/services/questionService";
import { downloadJSON } from "@/utils/common";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "sonner";

export default function ExportSettingsPage() {
  const [exportLoading, setExportLoading] = useState<{
    words: boolean;
    lectures: boolean;
    exams: boolean;
    questions: boolean;
  }>({ words: false, lectures: false, exams: false, questions: false });

  const handleExportWords = async () => {
    setExportLoading((prev) => ({ ...prev, words: true }));
    try {
      const data = await wordService.exportWords();
      downloadJSON(data, "words-export");
      toast.success("Exportación exitosa", {
        description: "Las palabras se han exportado correctamente",
      });
    } catch (error: any) {
      toast.error("Error al exportar", {
        description: error.message || "No se pudieron exportar las palabras",
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
      toast.success("Exportación exitosa", {
        description: "Las lecturas se han exportado correctamente",
      });
    } catch (error: any) {
      toast.error("Error al exportar", {
        description: error.message || "No se pudieron exportar las lecturas",
      });
    } finally {
      setExportLoading((prev) => ({ ...prev, lectures: false }));
    }
  };

  const handleExportExams = async () => {
    setExportLoading((prev) => ({ ...prev, exams: true }));
    try {
      const data = await examService.exportExams();
      downloadJSON(data, "exams-export");
      toast.success("Exportación exitosa", {
        description: "Los exámenes se han exportado correctamente",
      });
    } catch (error: any) {
      toast.error("Error al exportar", {
        description: error.message || "No se pudieron exportar los exámenes",
      });
    } finally {
      setExportLoading((prev) => ({ ...prev, exams: false }));
    }
  };

  const handleExportQuestions = async () => {
    setExportLoading((prev) => ({ ...prev, questions: true }));
    try {
      const data = await questionService.exportQuestions();
      downloadJSON(data, "questions-export");
      toast.success("Exportación exitosa", {
        description: "Las preguntas se han exportado correctamente",
      });
    } catch (error: any) {
      toast.error("Error al exportar", {
        description: error.message || "No se pudieron exportar las preguntas",
      });
    } finally {
      setExportLoading((prev) => ({ ...prev, questions: false }));
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
            <Button
              variant="outline"
              onClick={handleExportExams}
              disabled={exportLoading.exams}
              className="justify-start w-full"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              {exportLoading.exams ? "Exportando..." : "Exportar Exámenes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportQuestions}
              disabled={exportLoading.questions}
              className="justify-start w-full"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              {exportLoading.questions ? "Exportando..." : "Exportar Preguntas"}
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
