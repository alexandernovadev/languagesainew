import { PageHeader } from "@/shared/components/ui/page-header";

export default function LabsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Labs" 
        description="Funciones experimentales"
      />
      <div className="p-4">
        <p>Contenido de labs</p>
      </div>
    </div>
  );
}
