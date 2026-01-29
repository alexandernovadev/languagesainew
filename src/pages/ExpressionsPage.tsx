import { PageHeader } from "@/shared/components/ui/page-header";

export default function ExpressionsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Expresiones" 
        description="Gestiona tus expresiones"
      />
      <div className="p-4">
        <p>Contenido de expresiones</p>
      </div>
    </div>
  );
}
