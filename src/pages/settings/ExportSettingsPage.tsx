import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, HelpCircle, MessageSquare, Users, Eye, X } from "lucide-react";
import { wordService } from "@/services/wordService";
import { lectureService } from "@/services/lectureService";
import { questionService } from "@/services/questionService";
import { expressionService } from "@/services/expressionService";
import { userService } from "@/services/userService";
import { downloadJSON } from "@/utils/common";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";

export default function ExportSettingsPage() {
  const [exportLoading, setExportLoading] = useState<{
    words: boolean;
    lectures: boolean;
    questions: boolean;
    expressions: boolean;
    users: boolean;
  }>({ words: false, lectures: false, questions: false, expressions: false, users: false });

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  const handleExportWords = async () => {
    setExportLoading((prev) => ({ ...prev, words: true }));
    try {
      const data = await wordService.exportWords();
      downloadJSON(data, "words-export");
      toast.success("Exportación exitosa", {
        description: "Las palabras se han exportado correctamente",
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data, message: "Las palabras se han exportado correctamente" }, "Exportar Palabras")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Exportar Palabras");
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
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data, message: "Las lecturas se han exportado correctamente" }, "Exportar Lecturas")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Exportar Lecturas");
    } finally {
      setExportLoading((prev) => ({ ...prev, lectures: false }));
    }
  };

  const handleExportQuestions = async () => {
    setExportLoading((prev) => ({ ...prev, questions: true }));
    try {
      const data = await questionService.exportQuestions();
      downloadJSON(data, "questions-export");
      toast.success("Exportación exitosa", {
        description: "Las preguntas se han exportado correctamente",
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data, message: "Las preguntas se han exportado correctamente" }, "Exportar Preguntas")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Exportar Preguntas");
    } finally {
      setExportLoading((prev) => ({ ...prev, questions: false }));
    }
  };

  const handleExportExpressions = async () => {
    setExportLoading((prev) => ({ ...prev, expressions: true }));
    try {
      const data = await expressionService.exportExpressions();
      downloadJSON(data, "expressions-export");
      toast.success("Exportación exitosa", {
        description: "Las expressions se han exportado correctamente",
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data, message: "Las expressions se han exportado correctamente" }, "Exportar Expressions")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Exportar Expressions");
    } finally {
      setExportLoading((prev) => ({ ...prev, expressions: false }));
    }
  };

  const handleExportUsers = async () => {
    setExportLoading((prev) => ({ ...prev, users: true }));
    try {
      const data = await userService.exportUsers();
      downloadJSON(data, "users-export");
      toast.success("Exportación exitosa", {
        description: "Los usuarios se han exportado correctamente",
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data, message: "Los usuarios se han exportado correctamente" }, "Exportar Usuarios")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Exportar Usuarios");
    } finally {
      setExportLoading((prev) => ({ ...prev, users: false }));
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
              onClick={handleExportQuestions}
              disabled={exportLoading.questions}
              className="justify-start w-full"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              {exportLoading.questions ? "Exportando..." : "Exportar Preguntas"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExpressions}
              disabled={exportLoading.expressions}
              className="justify-start w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {exportLoading.expressions ? "Exportando..." : "Exportar Expressions"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportUsers}
              disabled={exportLoading.users}
              className="justify-start w-full"
            >
              <Users className="mr-2 h-4 w-4" />
              {exportLoading.users ? "Exportando..." : "Exportar Users"}
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
