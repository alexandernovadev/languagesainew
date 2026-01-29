import { PageHeader } from "@/shared/components/ui/page-header";

export default function WordsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Palabras" 
        description="Gestiona tus palabras"
      />
      <div className="p-4">
        <p>Contenido de palabras</p>
      </div>
    </div>
  );
}
