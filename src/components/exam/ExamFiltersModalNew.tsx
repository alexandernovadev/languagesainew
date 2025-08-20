import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModalNova } from "@/components/ui/modal-nova";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Check, Book, FileText, Settings, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
// Importar componentes de filtro específicos
import { ExamLevelFilter } from "./filters/ExamLevelFilter";
import { ExamLanguageFilter } from "./filters/ExamLanguageFilter";
import { ExamTopicFilter } from "./filters/ExamTopicFilter";
import { ExamSourceFilter } from "./filters/ExamSourceFilter";
import { ExamTypeFilter } from "./filters/ExamTypeFilter";

interface ExamFiltersModalNewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: any; // Filtros actuales provenientes del componente padre
  onFiltersChange: (filters: any) => void;
}

export function ExamFiltersModalNew({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: ExamFiltersModalNewProps) {

  // Filtros locales que solo se aplican al store cuando se da clic en Aplicar
  const [localFilters, setLocalFilters] = useState(filters);
  // Sincronizar filtros locales con los del componente padre cuando se abre el modal
  useEffect(() => {
    if (open) {
      setLocalFilters({ ...filters });
    }
  }, [open, filters]);

  // Mantener sincronizados cuando los filtros cambien desde fuera y el modal esté cerrado
  useEffect(() => {
    if (!open) {
      setLocalFilters({ ...filters });
    }
  }, [filters, open]);

  // Calcular filtros activos basados en filtros locales
  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== "all" && value !== "" && value !== "createdAt" && value !== "desc"
  );

  const activeFiltersCount = Object.values(localFilters).filter(
    (value) => value !== "all" && value !== "" && value !== "createdAt" && value !== "desc"
  ).length;

  // Limpiar filtros locales
  const handleClear = () => {
    const emptyFilters = {
      level: "all",
      language: "all",
      topic: "all",
      source: "all",
      adaptive: "all",
      createdBy: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      createdAfter: "",
      createdBefore: "",
    };
    setLocalFilters(emptyFilters);
  };

  // Aplicar filtros al store y cerrar modal
  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title="🔍 Filtros Avanzados"
      description="Aplica filtros para encontrar los exámenes que necesitas."
      size="4xl"
      height="h-[90dvh]"
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Info de filtros activos */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <>
                <Badge variant="secondary">{activeFiltersCount}</Badge>
                <span className="text-sm text-muted-foreground">
                  {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
          
          {/* Botones */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
            <Button
              onClick={handleApply}
              className="min-w-[100px]"
            >
              <Check className="h-4 w-4 mr-2" />
              Aplicar
            </Button>
          </div>
        </div>
      }
    >
      <div className="px-6 py-4">
        <FiltersContent
          filters={localFilters}
          setFilters={setLocalFilters}
        />
      </div>
    </ModalNova>
  );
}

interface FiltersContentProps {
  filters: any;
  setFilters: (filters: any) => void;
}

function FiltersContent({
  filters,
  setFilters,
}: FiltersContentProps) {
  const updateFilter = (key: string, value: string | undefined) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">
          <Book className="h-4 w-4 mr-2" />
          Básicos
        </TabsTrigger>
        <TabsTrigger value="content">
          <FileText className="h-4 w-4 mr-2" />
          Contenido
        </TabsTrigger>
        <TabsTrigger value="advanced">
          <Settings className="h-4 w-4 mr-2" />
          Avanzados
        </TabsTrigger>
        <TabsTrigger value="sort">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Ordenar
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Nivel de Dificultad</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios niveles
            </p>
            <ExamLevelFilter
              value={filters.level}
              onChange={(value: string | undefined) => {
                updateFilter("level", value || "all");
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Idioma</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios idiomas
            </p>
            <ExamLanguageFilter
              value={filters.language}
              onChange={(value: string | undefined) => {
                updateFilter("language", value || "all");
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Tema</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios temas
            </p>
            <ExamTopicFilter
              value={filters.topic}
              onChange={(value: string | undefined) => {
                updateFilter("topic", value || "all");
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Origen del Examen</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona el origen del examen
            </p>
            <ExamSourceFilter
              value={filters.source}
              onChange={(value: string | undefined) => {
                updateFilter("source", value || "all");
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Tipo de Examen</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona el tipo de examen
            </p>
            <ExamTypeFilter
              value={filters.adaptive}
              onChange={(value: string | undefined) => {
                updateFilter("adaptive", value || "all");
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Creado por</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Ingresa el ID del creador
            </p>
            <Input
              placeholder="ID del creador"
              value={filters.createdBy === "all" ? "" : filters.createdBy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateFilter("createdBy", e.target.value || "all");
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Rango de Fechas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="createdAfter">Creado después de</Label>
                <Input
                  id="createdAfter"
                  type="date"
                  value={filters.createdAfter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateFilter("createdAfter", e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdBefore">Creado antes de</Label>
                <Input
                  id="createdBefore"
                  type="date"
                  value={filters.createdBefore}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateFilter("createdBefore", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="sort" className="space-y-4 mt-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Ordenamiento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy">Ordenar por</Label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  updateFilter("sortBy", e.target.value);
                }}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="createdAt">Fecha de creación</option>
                <option value="updatedAt">Fecha de actualización</option>
                <option value="title">Título</option>
                <option value="level">Nivel</option>
                <option value="language">Idioma</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Orden</Label>
              <select
                id="sortOrder"
                value={filters.sortOrder}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  updateFilter("sortOrder", e.target.value);
                }}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
} 