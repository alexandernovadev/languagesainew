import React, { useState } from "react";
import { toast } from "sonner";
import {
  Database,
  Users,
  Sprout,
  HardDrive,
  RefreshCw,
  BarChart3,
  Trash2,
  FileText,
  Save,
  Database as DatabaseIcon,
  UserPlus,
  Sprout as Seedling,
  Eraser,
  ArrowRight,
  BarChart,
  Trash,
  FileX,
  ClipboardList,
} from "lucide-react";
import { labsService } from "@/services/labsService";
import { LabsSection } from "@/components/labs/labs-section";
import { LabsActionCard } from "@/components/labs/labs-action-card";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";

interface ConfirmationState {
  isOpen: boolean;
  action: string;
  title: string;
  description: string;
  onConfirm: () => void;
}

export default function LabsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    action: "",
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleAction = async (
    actionName: string,
    actionFunction: () => Promise<any>,
    requiresConfirmation = false,
    confirmationTitle = "",
    confirmationDescription = ""
  ) => {
    if (requiresConfirmation) {
      setConfirmation({
        isOpen: true,
        action: actionName,
        title: confirmationTitle,
        description: confirmationDescription,
        onConfirm: async () => {
          setConfirmation({ ...confirmation, isOpen: false });
          await executeAction(actionName, actionFunction);
        },
      });
    } else {
      await executeAction(actionName, actionFunction);
    }
  };

  const executeAction = async (
    actionName: string,
    actionFunction: () => Promise<any>
  ) => {
    setLoading(actionName);
    try {
      const result = await actionFunction();
      if (result.success) {
        toast.success(
          result.message || `${actionName} completado exitosamente`
        );
      } else {
        toast.error(result.message || `Error en ${actionName}`);
      }
    } catch (error: any) {
      console.error(`Error in ${actionName}:`, error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Error en ${actionName}`
      );
    } finally {
      setLoading(null);
    }
  };

  const closeConfirmation = () => {
    setConfirmation({ ...confirmation, isOpen: false });
  };

  return (
    <PageLayout>
      <PageHeader
        title="Labs"
        description="Herramientas de desarrollo, mantenimiento y utilidades de base de datos"
      />

      <div className="space-y-8 max-w-full">
        {/* Database Operations */}
        <LabsSection
          title="Operaciones de Base de Datos"
          description="Operaciones masivas en palabras y datos"
          icon={Database}
        >
          <LabsActionCard
            title="Actualizar Nivel de Palabras"
            description="Actualiza el nivel de todas las palabras a un valor específico (easy, medium, hard)"
            category="Database"
            icon={DatabaseIcon}
            onAction={() =>
              handleAction(
                "updateWordsLevel",
                () => labsService.updateWordsLevel({ level: "easy" }),
                true,
                "Actualizar Nivel de Palabras",
                "¿Estás seguro de que quieres actualizar el nivel de todas las palabras a 'easy'? Esta acción afectará a todas las palabras en la base de datos."
              )
            }
            loading={loading === "updateWordsLevel"}
            variant="info"
          />

          <LabsActionCard
            title="Resetear Contador 'Seen'"
            description="Establece el contador 'seen' de todas las palabras a 0"
            category="Database"
            icon={RefreshCw}
            onAction={() =>
              handleAction(
                "resetWordsSeen",
                () => labsService.resetWordsSeenCount({ seen: 0 }),
                true,
                "Resetear Contador 'Seen'",
                "¿Estás seguro de que quieres resetear el contador 'seen' de todas las palabras a 0? Esta acción afectará a todas las palabras en la base de datos."
              )
            }
            loading={loading === "resetWordsSeen"}
            variant="warning"
          />

          <LabsActionCard
            title="Actualizar Idioma de Lecturas"
            description="Establece el idioma de todas las lecturas a un valor específico"
            category="Database"
            icon={FileText}
            onAction={() =>
              handleAction(
                "updateLecturesLanguage",
                () => labsService.updateLecturesLanguage({ language: "en" }),
                true,
                "Actualizar Idioma de Lecturas",
                "¿Estás seguro de que quieres actualizar el idioma de todas las lecturas a 'english'? Esta acción afectará a todas las lecturas en la base de datos."
              )
            }
            loading={loading === "updateLecturesLanguage"}
            variant="info"
          />
        </LabsSection>

        {/* User Management */}
        <LabsSection
          title="Gestión de Usuarios"
          description="Operaciones relacionadas con usuarios del sistema"
          icon={Users}
        >
          <LabsActionCard
            title="Crear Usuario Administrador"
            description="Crea un usuario administrador para desarrollo y pruebas"
            category="Users"
            icon={UserPlus}
            onAction={() =>
              handleAction(
                "createAdminUser",
                () => labsService.createAdminUser(),
                true,
                "Crear Usuario Administrador",
                "¿Estás seguro de que quieres crear un usuario administrador? Este usuario tendrá acceso completo al sistema."
              )
            }
            loading={loading === "createAdminUser"}
            variant="info"
          />
        </LabsSection>

        {/* Data Seeding */}
        <LabsSection
          title="Seeding de Datos"
          description="Cargar datos iniciales y de prueba"
          icon={Sprout}
        >
          <LabsActionCard
            title="Seed de Datos Iniciales"
            description="Ejecuta el seed de datos iniciales para desarrollo"
            category="Seeding"
            icon={Seedling}
            onAction={() =>
              handleAction(
                "seedInitialData",
                () => labsService.seedInitialData(),
                true,
                "Seed de Datos Iniciales",
                "¿Estás seguro de que quieres ejecutar el seed de datos iniciales? Esto cargará datos de prueba en la base de datos."
              )
            }
            loading={loading === "seedInitialData"}
            variant="info"
          />

          <LabsActionCard
            title="Seed de Preguntas desde JSON"
            description="Carga preguntas desde archivo JSON"
            category="Seeding"
            icon={FileText}
            onAction={() =>
              handleAction(
                "seedQuestions",
                () => labsService.seedQuestionsFromJson(),
                true,
                "Seed de Preguntas",
                "¿Estás seguro de que quieres cargar preguntas desde JSON? Esto agregará nuevas preguntas a la base de datos."
              )
            }
            loading={loading === "seedQuestions"}
            variant="info"
          />
        </LabsSection>

        {/* Backup & Maintenance */}
        <LabsSection
          title="Backup y Mantenimiento"
          description="Operaciones de respaldo y limpieza de datos"
          icon={HardDrive}
        >
          <LabsActionCard
            title="Crear Backup"
            description="Crea un backup de todas las colecciones de la base de datos"
            category="Backup"
            icon={Save}
            onAction={() =>
              handleAction(
                "createBackup",
                () => labsService.createBackup(),
                true,
                "Crear Backup",
                "¿Estás seguro de que quieres crear un backup de todas las colecciones? Esto puede tomar varios minutos."
              )
            }
            loading={loading === "createBackup"}
            variant="info"
          />

          <LabsActionCard
            title="Limpiar Todos los Datos"
            description="Elimina TODAS las palabras y lecturas de la base de datos"
            category="Maintenance"
            icon={Eraser}
            onAction={() =>
              handleAction(
                "clearAllData",
                () => labsService.clearAllData(),
                true,
                "Limpiar Todos los Datos (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODAS las palabras y lecturas de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "clearAllData"}
            dangerous={true}
            variant="danger"
          />
        </LabsSection>

        {/* Migration */}
        <LabsSection
          title="Migración"
          description="Operaciones de migración de datos"
          icon={ArrowRight}
        >
          <LabsActionCard
            title="Migrar Palabras al Sistema de Revisión"
            description="Migra las palabras al sistema de revisión (servicio no implementado aún)"
            category="Migration"
            icon={RefreshCw}
            onAction={() =>
              handleAction(
                "migrateWords",
                () => labsService.migrateWordsToReviewSystem(),
                true,
                "Migrar Palabras",
                "¿Estás seguro de que quieres migrar las palabras al sistema de revisión? Esta operación puede tomar tiempo."
              )
            }
            loading={loading === "migrateWords"}
            variant="warning"
          />
        </LabsSection>

        {/* Statistics */}
        <LabsSection
          title="Estadísticas"
          description="Información y métricas de la base de datos"
          icon={BarChart3}
        >
          <LabsActionCard
            title="Obtener Estadísticas de BD"
            description="Obtiene estadísticas básicas de la base de datos para desarrollo"
            category="Statistics"
            icon={BarChart}
            onAction={() =>
              handleAction(
                "getDatabaseStats",
                () => labsService.getDatabaseStats(),
                false
              )
            }
            loading={loading === "getDatabaseStats"}
            variant="info"
          />
        </LabsSection>

        {/* Cleaner Functions - DANGEROUS */}
        <LabsSection
          title="Funciones de Limpieza (PELIGROSAS)"
          description="Operaciones que eliminan datos permanentemente"
          icon={Trash2}
          variant="danger"
        >
          <LabsActionCard
            title="Eliminar Todos los Intentos de Examen"
            description="Elimina TODOS los intentos de examen de la base de datos"
            category="Cleaner"
            icon={Trash}
            onAction={() =>
              handleAction(
                "cleanExamAttempts",
                () => labsService.cleanExamAttempts(),
                true,
                "Eliminar Intentos de Examen (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODOS los intentos de examen de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanExamAttempts"}
            dangerous={true}
            requiresAuth={true}
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todos los Exámenes"
            description="Elimina TODOS los exámenes y sus intentos asociados"
            category="Cleaner"
            icon={FileX}
            onAction={() =>
              handleAction(
                "cleanExams",
                () => labsService.cleanExams(),
                true,
                "Eliminar Todos los Exámenes (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODOS los exámenes y sus intentos asociados de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanExams"}
            dangerous={true}
            requiresAuth={true}
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todas las Preguntas"
            description="Elimina TODAS las preguntas de la base de datos"
            category="Cleaner"
            icon={ClipboardList}
            onAction={() =>
              handleAction(
                "cleanQuestions",
                () => labsService.cleanQuestions(),
                true,
                "Eliminar Todas las Preguntas (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODAS las preguntas de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanQuestions"}
            dangerous={true}
            requiresAuth={true}
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todas las Palabras"
            description="Elimina TODAS las palabras de la base de datos"
            category="Cleaner"
            icon={FileText}
            onAction={() =>
              handleAction(
                "cleanWords",
                () => labsService.cleanWords(),
                true,
                "Eliminar Todas las Palabras (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODAS las palabras de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanWords"}
            dangerous={true}
            requiresAuth={true}
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todas las Lecturas"
            description="Elimina TODAS las lecturas de la base de datos"
            category="Cleaner"
            icon={FileText}
            onAction={() =>
              handleAction(
                "cleanLectures",
                () => labsService.cleanLectures(),
                true,
                "Eliminar Todas las Lecturas (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODAS las lecturas de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanLectures"}
            dangerous={true}
            requiresAuth={true}
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todas las Expresiones"
            description="Elimina TODAS las expresiones de la base de datos"
            category="Cleaner"
            icon={FileText}
            onAction={() =>
              handleAction(
                "cleanExpressions",
                () => labsService.cleanExpressions(),
                true,
                "Eliminar Todas las Expresiones (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODAS las expresiones de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanExpressions"}
            dangerous={true}
            requiresAuth={true}
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todos los Usuarios"
            description="Elimina TODOS los usuarios excepto el actual"
            category="Cleaner"
            icon={Users}
            onAction={() =>
              handleAction(
                "cleanUsers",
                () => labsService.cleanUsers(),
                true,
                "Eliminar Todos los Usuarios (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODOS los usuarios excepto tu usuario actual. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanUsers"}
            dangerous={true}
            requiresAuth={true}
            variant="danger"
          />
        </LabsSection>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        content={confirmation.description}
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={loading !== null}
        variant="danger"
      />
    </PageLayout>
  );
}
