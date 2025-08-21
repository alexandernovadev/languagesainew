import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModalNova } from "@/components/ui/modal-nova";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, X, Info, Check, Book, FileText, Settings, ArrowUpDown } from "lucide-react";

import { useQuestionFilters } from "@/hooks/useQuestionFilters";
import { LevelFilter } from "./LevelFilter";
import { TypeFilter } from "./TypeFilter";
import { DifficultyFilter } from "./DifficultyFilter";
import { BooleanFilters } from "./BooleanFilters";
import { SortFilter } from "./SortFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { TextFilters } from "./TextFilters";

interface QuestionFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (filters: any) => void;
}

export function QuestionFiltersModal({
  open,
  onOpenChange,
  onFiltersChange,
}: QuestionFiltersModalProps) {
  const {
    filters,
    booleanFilters,
    combinedFilters,
    hasActiveFilters,
    activeFiltersCount,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
  } = useQuestionFilters();

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
      title="🔍 Filtros Avanzados"
      description="Aplica filtros para encontrar las preguntas que necesitas."
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
      <div className="px-6 py-4">
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
  booleanFilters: Record<string, boolean>;
  updateFilter: (key: string, value: any) => void;
  updateBooleanFilter: (key: string, value: boolean) => void;
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
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 max-sm:flex max-sm:w-max max-sm:min-w-full">
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

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Nivel de Dificultad</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios niveles
            </p>
            <LevelFilter
              value={filters.level}
              onChange={(value) => {
                updateFilter("level", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Tipo de Pregunta</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios tipos
            </p>
            <TypeFilter
              value={filters.type}
              onChange={(value) => {
                updateFilter("type", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Dificultad</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios niveles de dificultad
            </p>
            <DifficultyFilter
              value={filters.difficulty}
              onChange={(value) => {
                updateFilter("difficulty", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Búsqueda de Texto</h4>
            <TextFilters
              topic={filters.topic}
              tags={filters.tags}
              onTopicChange={(value: string) => {
                updateFilter("topic", value);
              }}
              onTagsChange={(value: string) => {
                updateFilter("tags", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Contenido Disponible</h4>
            <BooleanFilters
              hasMedia={booleanFilters.hasMedia}
              onHasMediaChange={(value: boolean) => {
                updateBooleanFilter("hasMedia", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Rango de Fechas</h4>
            <DateRangeFilter
              createdAfter={filters.createdAfter}
              createdBefore={filters.createdBefore}
              onCreatedAfterChange={(value: string) => {
                updateFilter("createdAfter", value);
              }}
              onCreatedBeforeChange={(value: string) => {
                updateFilter("createdBefore", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="sort" className="space-y-4 mt-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Ordenamiento</h4>
          <SortFilter
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortByChange={(value: string) => {
              updateFilter("sortBy", value);
            }}
            onSortOrderChange={(value: string) => {
              updateFilter("sortOrder", value);
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
