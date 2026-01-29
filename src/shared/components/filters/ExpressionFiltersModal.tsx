import { useState, useEffect } from "react";
import { ModalNova } from "../ui/modal-nova";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { DatePicker } from "../ui/date-picker";
import { difficultyJson, languagesJson, expressionTypesJson } from "@/data/bussiness/shared";
import { ExpressionFilters } from "@/shared/hooks/useExpressions";
import { Filter, Eraser } from "lucide-react";

interface ExpressionFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ExpressionFilters;
  onApplyFilters: (filters: ExpressionFilters) => void;
  onClearFilters: () => void;
}

export function ExpressionFiltersModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters,
}: ExpressionFiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<ExpressionFilters>(filters);

  // Sync local filters with props when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    onOpenChange(false);
  };

  const updateFilter = (key: keyof ExpressionFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === "all" ? undefined : value,
    }));
  };

  // Count active filters (excluding page and limit)
  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) => key !== "page" && key !== "limit" && value !== undefined && value !== ""
  ).length;

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span>Filtros Avanzados</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
      }
      description="Refina tu búsqueda de expresiones"
      size="2xl"
      height="h-[80vh]"
      footer={
        <div className="flex gap-2 justify-between w-full">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            disabled={activeFiltersCount === 0}
            title="Limpiar filtros"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleApply}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      }
    >
      <div className="px-6 py-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Características</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="search">Búsqueda</Label>
              <Input
                id="search"
                placeholder="Buscar en expresión, definición o traducción..."
                value={localFilters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select
                  value={localFilters.difficulty || "all"}
                  onValueChange={(value) => updateFilter("difficulty", value)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Todas las dificultades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {difficultyJson.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={localFilters.language || "all"}
                  onValueChange={(value) => updateFilter("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Todos los idiomas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {languagesJson.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={localFilters.type || "all"}
                onValueChange={(value) => updateFilter("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {expressionTypesJson.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Content/Features Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="hasImage">Tiene Imagen</Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar solo expresiones con imagen
                </p>
              </div>
              <Switch
                id="hasImage"
                checked={localFilters.hasImage === "true"}
                onCheckedChange={(checked) => updateFilter("hasImage", checked ? "true" : undefined)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="hasContext">Tiene Contexto</Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar solo expresiones con contexto
                </p>
              </div>
              <Switch
                id="hasContext"
                checked={localFilters.hasContext === "true"}
                onCheckedChange={(checked) => updateFilter("hasContext", checked ? "true" : undefined)}
              />
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Fecha de Creación</Label>
              <DatePicker
                value={localFilters.createdAt ? new Date(localFilters.createdAt) : undefined}
                onChange={(date) => updateFilter("createdAt", date?.toISOString())}
                placeholder="Seleccionar fecha"
              />
            </div>

            <div className="space-y-2">
              <Label>Fecha de Actualización</Label>
              <DatePicker
                value={localFilters.updatedAt ? new Date(localFilters.updatedAt) : undefined}
                onChange={(date) => updateFilter("updatedAt", date?.toISOString())}
                placeholder="Seleccionar fecha"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ModalNova>
  );
}
