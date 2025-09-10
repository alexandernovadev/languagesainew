import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModalNova } from "@/components/ui/modal-nova";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Filter,
  X,
  Info,
  Check,
  Book,
  FileText,
  Search,
  Settings,
  ArrowUpDown,
} from "lucide-react";

import { useExpressionFilters, ExpressionBooleanFilters } from "../../hooks/useExpressionFilters";
import { LevelFilter } from "./LevelFilter";
import { LanguageFilter } from "./LanguageFilter";
import { TypeFilter } from "./TypeFilter";
import { BooleanSelectFilter } from "@/components/forms/common/BooleanSelectFilter";
import { SortFilter } from "./SortFilter";
import { DateRangeFilter } from "@/components/forms/common/DateRangeFilter";
import { TextFilters } from "@/components/forms/common/TextFilters";

interface ExpressionFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (filters: any) => void;
}

export function ExpressionFiltersModal({
  open,
  onOpenChange,
  onFiltersChange,
}: ExpressionFiltersModalProps) {
  const {
    filters,
    booleanFilters,
    combinedFilters,
    hasActiveFilters,
    activeFiltersCount,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
  } = useExpressionFilters();

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
      title="Filtros Avanzados de Expresiones"
      description="Aplica filtros para encontrar las expresiones que necesitas."
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
            <Button onClick={handleApplyFilters} className="min-w-[100px]">
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
  booleanFilters: ExpressionBooleanFilters;
  updateFilter: (key: string, value: any) => void;
  updateBooleanFilter: (
    key: keyof ExpressionBooleanFilters,
    value: boolean | undefined
  ) => void;
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

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Dificultad</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona una o varias dificultades
            </p>
            <LevelFilter
              value={filters.difficulty}
              onChange={(value) => {
                updateFilter("difficulty", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Idioma</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios idiomas
            </p>
            <LanguageFilter
              value={filters.language}
              onChange={(value) => {
                updateFilter("language", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Tipo de Expresión</h4>
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
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Contenido Disponible</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Filtra por características de contenido de las expresiones
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Ejemplos</Label>
                <BooleanSelectFilter
                  value={booleanFilters.hasExamples}
                  onChange={(value) =>
                    updateBooleanFilter("hasExamples", value as boolean)
                  }
                  placeholder="Seleccionar estado de ejemplos"
                  withText="Con ejemplos"
                  withoutText="Sin ejemplos"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Imagen</Label>
                <BooleanSelectFilter
                  value={booleanFilters.hasImage}
                  onChange={(value) =>
                    updateBooleanFilter("hasImage", value as boolean)
                  }
                  placeholder="Seleccionar estado de imagen"
                  withText="Con imagen"
                  withoutText="Sin imagen"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Traducción al Español</Label>
                <BooleanSelectFilter
                  value={booleanFilters.hasSpanish}
                  onChange={(value) =>
                    updateBooleanFilter("hasSpanish", value as boolean)
                  }
                  placeholder="Seleccionar estado de traducción"
                  withText="Con traducción al español"
                  withoutText="Sin traducción al español"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Contexto</Label>
                <BooleanSelectFilter
                  value={booleanFilters.hasContext}
                  onChange={(value) =>
                    updateBooleanFilter("hasContext", value as boolean)
                  }
                  placeholder="Seleccionar estado de contexto"
                  withText="Con contexto"
                  withoutText="Sin contexto"
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="text" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Búsqueda de Texto</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Busca expresiones por su contenido textual
            </p>
            <TextFilters
              definition={filters.definition}
              expression={filters.expression}
              spanishExpression={filters.spanishExpression}
              spanishDefinition={filters.spanishDefinition}
              onDefinitionChange={(value) => {
                updateFilter("definition", value);
              }}
              onExpressionChange={(value) => {
                updateFilter("expression", value);
              }}
              onSpanishExpressionChange={(value) => {
                updateFilter("spanishExpression", value);
              }}
              onSpanishDefinitionChange={(value) => {
                updateFilter("spanishDefinition", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Rango de Fechas</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Filtra por fechas de creación y actualización
            </p>
            <DateRangeFilter
              createdAfter={filters.createdAfter}
              createdBefore={filters.createdBefore}
              updatedAfter={filters.updatedAfter}
              updatedBefore={filters.updatedBefore}
              onCreatedAfterChange={(value) => {
                updateFilter("createdAfter", value);
              }}
              onCreatedBeforeChange={(value) => {
                updateFilter("createdBefore", value);
              }}
              onUpdatedAfterChange={(value) => {
                updateFilter("updatedAfter", value);
              }}
              onUpdatedBeforeChange={(value) => {
                updateFilter("updatedBefore", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="sort" className="space-y-4 mt-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Ordenamiento</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Configura cómo se ordenan los resultados
          </p>
          <SortFilter
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortByChange={(value) => {
              updateFilter("sortBy", value);
            }}
            onSortOrderChange={(value) => {
              updateFilter("sortOrder", value);
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
} 