import { PageHeader } from "@/shared/components/ui/page-header";

export default function LectureDetailPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Detalle de Lectura" 
        description="Detalles de la lectura"
      />
      <div className="p-4">
        <p>Contenido del detalle</p>
      </div>
    </div>
  );
}
