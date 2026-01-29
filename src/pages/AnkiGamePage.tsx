import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function AnkiGamePage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Juego Anki" 
        description="Practica con tarjetas Anki"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - AnkiGamePage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido del juego Anki</p>
        </CardContent>
      </Card>
    </div>
  );
}
