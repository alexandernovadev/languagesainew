import { PageHeader } from "@/shared/components/ui/page-header";

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Usuarios" 
        description="Gestiona los usuarios del sistema"
      />
      <div className="p-4">
        <p>Contenido de usuarios</p>
      </div>
    </div>
  );
}
