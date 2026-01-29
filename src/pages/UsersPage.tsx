import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Usuarios" 
        description="Gestiona los usuarios del sistema"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - UsersPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de usuarios</p>
        </CardContent>
      </Card>
    </div>
  );
}
