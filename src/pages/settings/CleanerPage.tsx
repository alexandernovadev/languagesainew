import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  AlertTriangle,
  FileText,
  ClipboardList,
  Users,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";

interface CleanerPageProps {}

export default function CleanerPage({}: CleanerPageProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteAttemptsModal, setShowDeleteAttemptsModal] = useState(false);
  const [showDeleteExamsModal, setShowDeleteExamsModal] = useState(false);
  const [showDeleteQuestionsModal, setShowDeleteQuestionsModal] =
    useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDeleteAttempts = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await api.delete(`/api/cleaner/exam-attempts`);
      setMessage({
        type: "success",
        text: "TODOS los intentos de examen han sido eliminados exitosamente.",
      });
      setShowDeleteAttemptsModal(false);
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Error al eliminar los intentos de examen.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExams = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await api.delete(`/api/cleaner/exams`);
      setMessage({
        type: "success",
        text: "TODOS los exámenes han sido eliminados exitosamente.",
      });
      setShowDeleteExamsModal(false);
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Error al eliminar los exámenes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestions = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await api.delete(`/api/cleaner/questions`);
      setMessage({
        type: "success",
        text: "TODAS las preguntas han sido eliminadas exitosamente.",
      });
      setShowDeleteQuestionsModal(false);
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Error al eliminar las preguntas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Cleaner"
        description="Elimina datos masivamente de tu cuenta. Esta acción es irreversible."
      />

      {message && (
        <Alert
          className={`mb-6 ${
            message.type === "success"
              ? "border-green-500 bg-green-500/10"
              : "border-red-500 bg-red-500/10"
          }`}
        >
          <AlertTriangle
            className={`h-4 w-4 ${
              message.type === "success" ? "text-green-200" : "text-red-600"
            }`}
          />
          <AlertDescription
            className={
              message.type === "success" ? "text-green-200" : "text-red-800"
            }
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Borrar Intentos */}
        <Card className="border-2 border-red-300 dark:border-red-600 bg-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Users className="h-5 w-5" />
              Borrar Intentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Elimina TODOS los intentos de examen de la base de datos. Esto incluye
              respuestas, calificaciones y feedback de IA de todos los usuarios.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAttemptsModal(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Borrar Intentos
            </Button>
          </CardContent>
        </Card>

        {/* Borrar Exámenes */}
        <Card className="border-2 border-orange-300 dark:border-orange-600 bg-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <FileText className="h-5 w-5" />
              Borrar Exámenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Elimina TODOS los exámenes de la base de datos. Esto también eliminará todos
              los intentos asociados de todos los usuarios.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteExamsModal(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Borrar Exámenes
            </Button>
          </CardContent>
        </Card>

        {/* Borrar Preguntas */}
        <Card className="border-2 border-purple-300 dark:border-purple-600 bg-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <ClipboardList className="h-5 w-5" />
              Borrar Preguntas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Elimina TODAS las preguntas de la base de datos. Esto puede afectar exámenes
              que las contengan.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteQuestionsModal(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Borrar Preguntas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modal Borrar Intentos */}
      <Dialog
        open={showDeleteAttemptsModal}
        onOpenChange={setShowDeleteAttemptsModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Eliminación de Intentos
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar TODOS los intentos de
              examen de la base de datos? Esta acción es irreversible y eliminará:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>TODOS los intentos de examen de todos los usuarios</li>
                <li>Todas las respuestas y calificaciones</li>
                <li>Todos los feedback de IA</li>
                <li>Todas las estadísticas de rendimiento</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteAttemptsModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAttempts}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Todo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Borrar Exámenes */}
      <Dialog
        open={showDeleteExamsModal}
        onOpenChange={setShowDeleteExamsModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Eliminación de Exámenes
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar TODOS los exámenes de la
              base de datos? Esta acción es irreversible y eliminará:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>TODOS los exámenes de todos los usuarios</li>
                <li>Todos los intentos asociados a esos exámenes</li>
                <li>Todas las calificaciones y feedback</li>
                <li>Todas las estadísticas relacionadas</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteExamsModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteExams}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Todo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Borrar Preguntas */}
      <Dialog
        open={showDeleteQuestionsModal}
        onOpenChange={setShowDeleteQuestionsModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Eliminación de Preguntas
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar TODAS las preguntas de la
              base de datos? Esta acción es irreversible y eliminará:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>TODAS las preguntas de todos los usuarios</li>
                <li>Todas las explicaciones gramaticales</li>
                <li>Todos los tags y metadatos</li>
                <li>
                  Los exámenes que contengan estas preguntas pueden quedar
                  incompletos
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteQuestionsModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQuestions}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Todo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
