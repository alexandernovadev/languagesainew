import { Outlet } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Configuración" 
        description="Gestiona la configuración de la aplicación"
      />
      <Outlet />
    </div>
  );
}
