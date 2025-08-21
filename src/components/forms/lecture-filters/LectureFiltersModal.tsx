import { ModalNova } from "@/components/ui/modal-nova";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LevelFilter } from "./LevelFilter";
import { LanguageFilter } from "./LanguageFilter";
import { TypeWriteFilter } from "./TypeWriteFilter";
import { LectureBooleanFilters } from "./LectureBooleanFilters";
import { TimeRangeFilter } from "./TimeRangeFilter";
import { DateRangeFilter } from "@/components/forms/word-filters/DateRangeFilter";
import { SortFilter } from "./SortFilter";
import { useLectureFilters } from "@/hooks/useLectureFilters";
import { Check, X, Book, FileText, Search, Settings, ArrowUpDown } from "lucide-react";

interface LectureFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (filters: any) => void;
}

export function LectureFiltersModal({ open, onOpenChange, onFiltersChange }: LectureFiltersModalProps) {
  const {
    filters,
    combinedFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount,
    booleanFilters,
    updateBooleanFilter,
  } = useLectureFilters();

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    // No aplicar filtros inmediatamente, solo limpiar internamente
  };

  // Aplicar filtros y cerrar modal
  const handleApplyFilters = () => {
    onFiltersChange(combinedFilters);
    onOpenChange(false);
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title="Filtros Avanzados de Lecturas"
      description="Aplica filtros para encontrar las lecturas que necesitas."
      size="4xl"
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
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
            <Button
              onClick={handleApplyFilters}
              className="min-w-[100px]"
            >
              <Check className="h-4 w-4 mr-2" />
              Aplicar
            </Button>
          </div>
        </div>
      }
    >
      {/* Content Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <FiltersContent
          filters={filters}
          booleanFilters={booleanFilters}
          updateFilter={updateFilter as (key: string, value: any) => void}
          updateBooleanFilter={updateBooleanFilter}
        />
      </div>
    </ModalNova>
  );
}

interface FiltersContentProps {
  filters: any;
  booleanFilters: Record<string, boolean | undefined>;
  updateFilter: (key: string, value: any) => void;
  updateBooleanFilter: (key: string, value: boolean | undefined) => void;
}

function FiltersContent({
  filters,
  booleanFilters,
  updateFilter,
  updateBooleanFilter,
}: FiltersContentProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      {/* Contenedor con scroll horizontal en móvil */}
      <div className="max-sm:overflow-x-auto max-sm:pb-2">
        <TabsList className="grid w-full grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 max-sm:flex max-sm:w-max max-sm:min-w-full">
          <TabsTrigger value="basic" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <Book className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden sm:inline">Básicos</span>
            <span className="sm:hidden">Básicos</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <FileText className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden sm:inline">Contenido</span>
            <span className="sm:hidden">Contenido</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <Search className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden sm:inline">Por Texto</span>
            <span className="sm:hidden">Texto</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <Settings className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden sm:inline">Avanzados</span>
            <span className="sm:hidden">Avanzados</span>
          </TabsTrigger>
          <TabsTrigger value="sort" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden sm:inline">Ordenar</span>
            <span className="sm:hidden">Ordenar</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Básicos */}
      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Nivel de Dificultad</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios niveles
            </p>
            <LevelFilter value={filters.level} onChange={(v) => updateFilter("level", v)} />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Idioma</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios idiomas
            </p>
            <LanguageFilter value={filters.language} onChange={(v) => updateFilter("language", v)} />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Tipo de Texto</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios tipos
            </p>
            <TypeWriteFilter value={filters.typeWrite} onChange={(v) => updateFilter("typeWrite", v)} />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Filtros Específicos</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Filtra por características específicas
            </p>
            <LectureBooleanFilters values={booleanFilters} onChange={updateBooleanFilter} />
          </div>
        </div>
      </TabsContent>

      {/* Contenido */}
      <TabsContent value="content" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Tiempo de Lectura</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Define el rango de tiempo en minutos
            </p>
            <TimeRangeFilter
              timeMin={filters.timeMin}
              timeMax={filters.timeMax}
              onMinChange={(v) => updateFilter("timeMin", v)}
              onMaxChange={(v) => updateFilter("timeMax", v)}
            />
          </div>
        </div>
      </TabsContent>

      {/* Por Texto */}
      <TabsContent value="text" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Búsqueda de Texto</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Busca lecturas por su contenido textual
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Título</Label>
                <Input
                  placeholder="Buscar en título..."
                  value={filters.title || ""}
                  onChange={(e) => updateFilter("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Contenido</Label>
                <Input
                  placeholder="Buscar en contenido..."
                  value={filters.content || ""}
                  onChange={(e) => updateFilter("content", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Avanzados */}
      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Fechas</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Filtra por fechas de creación o actualización
            </p>
            <DateRangeFilter
              createdAfter={filters.createdAfter}
              createdBefore={filters.createdBefore}
              updatedAfter={filters.updatedAfter}
              updatedBefore={filters.updatedBefore}
              onCreatedAfterChange={(v) => updateFilter("createdAfter", v)}
              onCreatedBeforeChange={(v) => updateFilter("createdBefore", v)}
              onUpdatedAfterChange={(v) => updateFilter("updatedAfter", v)}
              onUpdatedBeforeChange={(v) => updateFilter("updatedBefore", v)}
            />
          </div>
        </div>
      </TabsContent>

      {/* Ordenar */}
      <TabsContent value="sort" className="space-y-4 mt-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Ordenamiento</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Define cómo ordenar los resultados
          </p>
          <SortFilter
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortByChange={(v) => updateFilter("sortBy", v)}
            onSortOrderChange={(v) => updateFilter("sortOrder", v)}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
} 