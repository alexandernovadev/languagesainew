import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { toast } from "sonner";
import { labsService } from "@/services/labsService";
import { UserPlus, Mail, Loader2, AlertTriangle, Trash2 } from "lucide-react";

type DangerousOperation = "words" | "expressions" | "lectures" | null;

export default function LabsPage() {
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isSendingBackup, setIsSendingBackup] = useState(false);
  
  // Dangerous operations states
  const [isDeletingWords, setIsDeletingWords] = useState(false);
  const [isDeletingExpressions, setIsDeletingExpressions] = useState(false);
  const [isDeletingLectures, setIsDeletingLectures] = useState(false);
  
  // Confirmation dialogs state
  const [pendingOperation, setPendingOperation] = useState<DangerousOperation>(null);
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      const response = await labsService.createAdminUser();
      if (response.success) {
        toast.success(response.message || "Admin user created successfully");
      } else {
        toast.error(response.message || "Failed to create admin user");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating admin user");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleSendBackup = async () => {
    setIsSendingBackup(true);
    try {
      const response = await labsService.sendBackupByEmail();
      if (response.success) {
        toast.success(response.message || "Backup sent successfully");

        // Mostrar estadísticas del backup si están disponibles
        if (response.data) {
          const { wordsCount, lecturesCount, expressionsCount } = response.data;
          toast.info(
            `Backup includes: ${wordsCount || 0} words, ${lecturesCount || 0} lectures, ${expressionsCount || 0} expressions`,
            { duration: 5000 }
          );
        }
      } else {
        toast.error(response.message || "Failed to send backup");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending backup");
    } finally {
      setIsSendingBackup(false);
    }
  };

  // Dangerous Operations - Initial Click Handlers
  const handleDeleteAllWords = () => {
    setPendingOperation("words");
    setShowFirstConfirm(true);
  };

  const handleDeleteAllExpressions = () => {
    setPendingOperation("expressions");
    setShowFirstConfirm(true);
  };

  const handleDeleteAllLectures = () => {
    setPendingOperation("lectures");
    setShowFirstConfirm(true);
  };

  // First confirmation handler
  const handleFirstConfirm = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(true);
  };

  // Second confirmation handler - Execute the operation
  const handleSecondConfirm = async () => {
    if (!pendingOperation) return;

    const operationMap = {
      words: {
        execute: labsService.deleteAllWords.bind(labsService),
        setLoading: setIsDeletingWords,
        successLabel: "palabras",
      },
      expressions: {
        execute: labsService.deleteAllExpressions.bind(labsService),
        setLoading: setIsDeletingExpressions,
        successLabel: "expresiones",
      },
      lectures: {
        execute: labsService.deleteAllLectures.bind(labsService),
        setLoading: setIsDeletingLectures,
        successLabel: "lecturas",
      },
    };

    const operation = operationMap[pendingOperation];
    operation.setLoading(true);

    try {
      const response = await operation.execute();
      if (response.success) {
        const { deletedCount, timestamp } = response.data;
        toast.success(`✅ ${deletedCount} ${operation.successLabel} eliminadas exitosamente`);
        toast.info(`Eliminado a las: ${new Date(timestamp).toLocaleString()}`, { duration: 5000 });
        setShowSecondConfirm(false);
        setPendingOperation(null);
      } else {
        toast.error(response.message || `Failed to delete ${pendingOperation}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Error deleting ${pendingOperation}`);
    } finally {
      operation.setLoading(false);
    }
  };

  // Cancel handler
  const handleCancelConfirm = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(false);
    setPendingOperation(null);
  };

  // Get operation labels for dialogs
  const getOperationLabel = () => {
    const labels = {
      words: "palabras",
      expressions: "expresiones",
      lectures: "lecturas",
    };
    return pendingOperation ? labels[pendingOperation] : "";
  };

  const isOperationLoading = () => {
    return isDeletingWords || isDeletingExpressions || isDeletingLectures;
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Labs"
        description="Funciones experimentales y herramientas de desarrollo"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Card 1: Crear Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create Admin User
            </CardTitle>
            <CardDescription>
              Create a new administrator user for development and testing purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreateAdmin}
              disabled={isCreatingAdmin}
              className="w-full"
              size="lg"
            >
              {isCreatingAdmin ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Admin User"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Enviar Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Backup by Email
            </CardTitle>
            <CardDescription>
              Send a complete system backup via email with detailed statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSendBackup}
              disabled={isSendingBackup}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              {isSendingBackup ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Backup"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-1">
            <li>Admin user creation is for development purposes only</li>
            <li>Backup emails include all words, lectures, and expressions</li>
            <li>These operations may take a few moments to complete</li>
          </ul>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            ⚠️ Operaciones IRREVERSIBLES que eliminarán datos permanentemente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Delete All Words */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base sm:text-lg">Delete All Words</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                Elimina TODAS las palabras de la base de datos. No se puede deshacer.
              </p>
            </div>
            <Button
              onClick={handleDeleteAllWords}
              disabled={isDeletingWords}
              variant="destructive"
              className="w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              {isDeletingWords ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Words
                </>
              )}
            </Button>
          </div>

          {/* Delete All Expressions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base sm:text-lg">Delete All Expressions</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                Elimina TODAS las expresiones de la base de datos. No se puede deshacer.
              </p>
            </div>
            <Button
              onClick={handleDeleteAllExpressions}
              disabled={isDeletingExpressions}
              variant="destructive"
              className="w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              {isDeletingExpressions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Expressions
                </>
              )}
            </Button>
          </div>

          {/* Delete All Lectures */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base sm:text-lg">Delete All Lectures</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                Elimina TODAS las lecturas de la base de datos. No se puede deshacer.
              </p>
            </div>
            <Button
              onClick={handleDeleteAllLectures}
              disabled={isDeletingLectures}
              variant="destructive"
              className="w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              {isDeletingLectures ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Lectures
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* First Confirmation Dialog */}
      <AlertDialogNova
        open={showFirstConfirm}
        onOpenChange={setShowFirstConfirm}
        title="⚠️ ¿Estás ABSOLUTAMENTE SEGURO?"
        description={
          <>
            Esto eliminará <strong>TODAS las {getOperationLabel()}</strong> de la base de datos.
            <br />
            <br />
            Esta es una operación <strong className="text-destructive">IRREVERSIBLE</strong>.
          </>
        }
        onConfirm={handleFirstConfirm}
        onCancel={handleCancelConfirm}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
        confirmVariant="destructive"
      />

      {/* Second Confirmation Dialog (Final Warning) */}
      <AlertDialogNova
        open={showSecondConfirm}
        onOpenChange={setShowSecondConfirm}
        title="⚠️ ÚLTIMA ADVERTENCIA"
        description={
          <>
            Esta acción <strong className="text-destructive">NO SE PUEDE DESHACER</strong>.
            <br />
            <br />
            Se eliminarán <strong>PERMANENTEMENTE</strong> todas las {getOperationLabel()}.
            <br />
            <br />
            ¿Deseas continuar con la eliminación?
          </>
        }
        onConfirm={handleSecondConfirm}
        onCancel={handleCancelConfirm}
        confirmText="Sí, eliminar todo"
        cancelText="No, cancelar"
        loading={isOperationLoading()}
        confirmVariant="destructive"
        shouldAutoCloseOnConfirm={false}
      />
    </div>
  );
}
