import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Mi Perfil" 
        description="Gestiona tu perfil de usuario"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - ProfilePage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido del perfil</p>
        </CardContent>
      </Card>
    </div>
  );
}
