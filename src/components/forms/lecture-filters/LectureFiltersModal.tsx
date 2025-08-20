import { ModalNova } from "@/components/ui/modal-nova";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LevelFilter } from "@/components/forms/word-filters/LevelFilter";
import { LanguageFilter } from "@/components/forms/word-filters/LanguageFilter";
import { TypeWriteFilter } from "./TypeWriteFilter";
import { LectureBooleanFilters } from "./LectureBooleanFilters";
import { TimeRangeFilter } from "./TimeRangeFilter";
import { DateRangeFilter } from "@/components/forms/word-filters/DateRangeFilter";
import { SortFilter } from "@/components/forms/word-filters/SortFilter";
import { useLectureFilters } from "@/hooks/useLectureFilters";
import { Check, X, Book, Settings, ArrowUpDown } from "lucide-react";

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

  const handleApply = () => {
    onFiltersChange(combinedFilters);
    onOpenChange(false);
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title="Filtros de Lecturas"
      description="Refina la lista de lecturas."
      size="4xl"
      height="h-[76dvh]"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {hasActiveFilters && <Badge variant="secondary">{activeFiltersCount}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Limpiar
              </Button>
            )}
            <Button onClick={handleApply} className="min-w-[100px]">
              <Check className="h-4 w-4 mr-1" /> Aplicar
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sticky top-1">
            <TabsTrigger value="basic">
              <Book className="h-4 w-4 mr-2" />
              Básicos
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

          {/* Básicos */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Nivel</h4>
                <LevelFilter value={filters.level} onChange={(v)=>updateFilter("level", v)} />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Idioma</h4>
                <LanguageFilter value={filters.language} onChange={(v)=>updateFilter("language", v)} />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Tipo de Texto</h4>
                <TypeWriteFilter value={filters.typeWrite} onChange={(v)=>updateFilter("typeWrite", v)} />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Otros</h4>
                <LectureBooleanFilters values={booleanFilters} onChange={updateBooleanFilter} />
              </div>
            </div>
          </TabsContent>

          {/* Avanzados */}
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Duración (minutos)</h4>
                <TimeRangeFilter
                  timeMin={filters.timeMin}
                  timeMax={filters.timeMax}
                  onMinChange={(v)=>updateFilter("timeMin", v)}
                  onMaxChange={(v)=>updateFilter("timeMax", v)}
                />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Fechas</h4>
                <DateRangeFilter
                  createdAfter={filters.createdAfter}
                  createdBefore={filters.createdBefore}
                  updatedAfter={filters.updatedAfter}
                  updatedBefore={filters.updatedBefore}
                  onCreatedAfterChange={(v)=>updateFilter("createdAfter", v)}
                  onCreatedBeforeChange={(v)=>updateFilter("createdBefore", v)}
                  onUpdatedAfterChange={(v)=>updateFilter("updatedAfter", v)}
                  onUpdatedBeforeChange={(v)=>updateFilter("updatedBefore", v)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Ordenar */}
          <TabsContent value="sort" className="space-y-4 mt-4">
            <SortFilter
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortByChange={(v)=>updateFilter("sortBy", v)}
              onSortOrderChange={(v)=>updateFilter("sortOrder", v)}
            />
          </TabsContent>


        </Tabs>
      </div>
    </ModalNova>
  );
} 