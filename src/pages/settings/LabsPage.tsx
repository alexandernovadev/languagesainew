import React, { useState } from "react";
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
  Clock,
  ClipboardList,
} from "lucide-react";
import { labsService } from "@/services/labsService";
import { LabsSection } from "@/components/labs/labs-section";
import { LabsActionCard } from "@/components/labs/labs-action-card";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useResultHandler } from "@/hooks/useResultHandler";

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
  
  // Hook para manejo de resultados
  const { handleApiResult } = useResultHandler();

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
      
      // Show result using global handler
      handleApiResult(result, actionName);
    } catch (error: any) {
      console.error(`Error in ${actionName}:`, error);
      
      // Show error using global handler
      handleApiResult({
        success: false,
        message: error.response?.data?.message || error.message || `Error en ${actionName}`,
        data: error.response?.data || null
      }, actionName);
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

          <LabsActionCard
            title="Recalcular Tiempo de Lecturas"
            description="Recalcula el campo 'time' de todas las lecturas según su contenido (200 wpm, mínimo 1 min si hay texto)"
            icon={Clock}
            onAction={() =>
              handleAction(
                "recalculateLecturesTime",
                () => labsService.recalculateLecturesTime(),
                true,
                "Recalcular Tiempo de Lecturas",
                "¿Recalcular el tiempo de lectura para todas las lecturas? Esto actualizará el campo 'time' basado en la longitud del contenido."
              )
            }
            loading={loading === "recalculateLecturesTime"}
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

          <LabsActionCard
            title="Crear 5 Usuarios de Prueba"
            description="Crea 5 usuarios de prueba con diferentes idiomas para testing"
            icon={Users}
            onAction={() =>
              handleAction(
                "createTestUsers",
                () => labsService.createTestUsers(),
                true,
                "Crear Usuarios de Prueba",
                "¿Estás seguro de que quieres crear 5 usuarios de prueba? Se crearán usuarios con diferentes idiomas para testing."
              )
            }
            loading={loading === "createTestUsers"}
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
            title="Enviar Backup por Email"
            description="Envía un backup completo de todas las colecciones por email"
            icon={FileText}
            onAction={() =>
              handleAction(
                "sendBackupByEmail",
                () => labsService.sendBackupByEmail(),
                false,
                "",
                ""
              )
            }
            loading={loading === "sendBackupByEmail"}
            variant="success"
          />

          <LabsActionCard
            title="Limpiar Todos los Datos"
            description="Elimina TODAS las palabras y lecturas de la base de datos"
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
            title="Eliminar Todas las Palabras"
            description="Elimina TODAS las palabras de la base de datos"
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
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todas las Lecturas"
            description="Elimina TODAS las lecturas de la base de datos"
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
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todas las Expresiones"
            description="Elimina TODAS las expresiones de la base de datos"
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
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Chats de Traducción y Textos Generados"
            description="Elimina TODOS los chats de traducción y textos generados de la base de datos"
            icon={ClipboardList}
            onAction={() =>
              handleAction(
                "cleanTranslationChatsAndTexts",
                () => labsService.cleanTranslationChatsAndTexts(),
                true,
                "Eliminar Chats de Traducción y Textos Generados (PELIGROSO)",
                "⚠️ ADVERTENCIA: Esta acción eliminará TODOS los chats de traducción y textos generados de la base de datos. Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?"
              )
            }
            loading={loading === "cleanTranslationChatsAndTexts"}
            dangerous={true}
            variant="danger"
          />

          <LabsActionCard
            title="Eliminar Todos los Usuarios"
            description="Elimina TODOS los usuarios excepto el actual"
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
