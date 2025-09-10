import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Users,
  Database,
} from "lucide-react";
import { labsService } from "@/services/labsService";
import { LabsSection } from "./components/labs-section";
import { LabsActionCard } from "./components/labs-action-card";
import { ConfirmationModal } from "@/shared/components/ui/confirmation-modal";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageLayout } from "@/shared/components/layouts/page-layout";
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
        description="Herramientas de desarrollo y mantenimiento del sistema"
      />

      <div className="space-y-8">
        {/* User Management */}
        <LabsSection
          title="Gestión de Usuarios"
          description="Operaciones relacionadas con usuarios del sistema"
          icon={Users}
        >
          <LabsActionCard
            title="Crear Usuario Admin"
            description="Crea un usuario administrador para desarrollo"
            icon={UserPlus}
            onAction={() =>
              handleAction(
                "createAdminUser",
                () => labsService.createAdminUser(),
                true,
                "Crear Usuario Admin",
                "¿Estás seguro de que quieres crear un usuario administrador? Esto eliminará cualquier admin existente y creará uno nuevo."
              )
            }
            loading={loading === "createAdminUser"}
            variant="info"
          />
        </LabsSection>

        {/* Backup & Maintenance */}
        <LabsSection
          title="Backup y Mantenimiento"
          description="Operaciones de respaldo y mantenimiento del sistema"
          icon={Database}
        >
          <LabsActionCard
            title="Enviar Backup por Email"
            description="Envía un backup de todas las colecciones por email"
            icon={Mail}
            onAction={() =>
              handleAction(
                "sendBackupByEmail",
                () => labsService.sendBackupByEmail(),
                true,
                "Enviar Backup por Email",
                "¿Estás seguro de que quieres enviar un backup por email? Esto enviará un archivo con todos los datos de la base de datos."
              )
            }
            loading={loading === "sendBackupByEmail"}
            variant="info"
          />
        </LabsSection>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        description={confirmation.description}
      />
    </PageLayout>
  );
}