import { PageHeader } from "@/shared/components/ui/page-header";

export default function LectureGeneratorPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Generador de Lecturas" 
        description="Genera lecturas personalizadas con IA"
      />
      <div className="p-4">
        <p>Contenido del generador</p>
      </div>
    </div>
  );
}
