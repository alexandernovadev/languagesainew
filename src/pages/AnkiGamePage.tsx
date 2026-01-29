import { PageHeader } from "@/shared/components/ui/page-header";

export default function AnkiGamePage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Juego Anki" 
        description="Practica con tarjetas Anki"
      />
      <div className="p-4">
        <p>Contenido del juego Anki</p>
      </div>
    </div>
  );
}
