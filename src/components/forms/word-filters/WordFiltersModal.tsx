import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModalNova } from "@/components/ui/modal-nova";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { useWordFilters } from "@/hooks/useWordFilters";
import { LevelFilter } from "./LevelFilter";
import { LanguageFilter } from "./LanguageFilter";
import { TypeFilter } from "./TypeFilter";
import { BooleanSelectFilter } from "@/components/forms/common/BooleanSelectFilter";
import { SortFilter } from "./SortFilter";
import { ViewsRangeFilter } from "./ViewsRangeFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { TextFilters } from "./TextFilters";

interface WordFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (filters: any) => void;
}

export function WordFiltersModal({
  open,
  onOpenChange,
  onFiltersChange,
}: WordFiltersModalProps) {
  const {
    filters,
    booleanFilters,
    combinedFilters,
    hasActiveFilters,
    activeFiltersCount,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
  } = useWordFilters();

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
      title="Filtros Avanzados"
      description="Aplica filtros para encontrar las palabras que necesitas."
      size="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Info de filtros activos */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <>
                <Badge variant="secondary">{activeFiltersCount}</Badge>
                <span className="text-sm text-muted-foreground">
                  {activeFiltersCount} filtro
                  {activeFiltersCount !== 1 ? "s" : ""} activo
                  {activeFiltersCount !== 1 ? "s" : ""}
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
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">
          <Book className="h-4 w-4 mr-2" />
          Básicos
        </TabsTrigger>
        <TabsTrigger value="content">
          <FileText className="h-4 w-4 mr-2" />
          Contenido
        </TabsTrigger>
        <TabsTrigger value="text">
          <Search className="h-4 w-4 mr-2" />
          Por Texto
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
            <LevelFilter
              value={filters.level}
              onChange={(value) => {
                updateFilter("level", value);
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
            <h4 className="text-sm font-medium mb-2">Tipo Gramatical</h4>
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
              Filtra por características de contenido de las palabras
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
                <Label className="text-sm">Sinónimos</Label>
                <BooleanSelectFilter
                  value={booleanFilters.hasSynonyms}
                  onChange={(value) =>
                    updateBooleanFilter("hasSynonyms", value as boolean)
                  }
                  placeholder="Seleccionar estado de sinónimos"
                  withText="Con sinónimos"
                  withoutText="Sin sinónimos"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Code-Switching</Label>
                <BooleanSelectFilter
                  value={booleanFilters.hasCodeSwitching}
                  onChange={(value) =>
                    updateBooleanFilter("hasCodeSwitching", value as boolean)
                  }
                  placeholder="Seleccionar estado de code-switching"
                  withText="Con code-switching"
                  withoutText="Sin code-switching"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Imagen</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Filtra por palabras que tengan o no imagen
            </p>
            <Select
              value={filters.hasImage ?? "all"}
              onValueChange={(v) =>
                updateFilter(
                  "hasImage",
                  v === "all" ? undefined : (v as "true" | "false")
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="true">Con imagen</SelectItem>
                <SelectItem value="false">Sin imagen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="text" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Búsqueda de Texto</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Busca palabras por su contenido textual
            </p>
            <TextFilters
              definition={filters.definition}
              IPA={filters.IPA}
              spanishWord={filters.spanishWord}
              spanishDefinition={filters.spanishDefinition}
              onDefinitionChange={(value) => {
                updateFilter("definition", value);
              }}
              onIPAChange={(value) => {
                updateFilter("IPA", value);
              }}
              onSpanishWordChange={(value) => {
                updateFilter("spanishWord", value);
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
            <h4 className="text-sm font-medium mb-2">Rango de Vistas</h4>
            <ViewsRangeFilter
              seenMin={filters.seenMin}
              seenMax={filters.seenMax}
              onSeenMinChange={(value) => {
                updateFilter("seenMin", value);
              }}
              onSeenMaxChange={(value) => {
                updateFilter("seenMax", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Rango de Fechas</h4>
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
