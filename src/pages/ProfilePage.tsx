import { PageHeader } from "@/shared/components/ui/page-header";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Mi Perfil" 
        description="Gestiona tu perfil de usuario"
      />
      <div className="p-4">
        <p>Contenido del perfil</p>
      </div>
    </div>
  );
}
