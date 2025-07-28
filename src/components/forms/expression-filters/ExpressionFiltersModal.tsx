import { useState, useEffect } from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Check } from "lucide-react";
import { expressionTypes, expressionLevels, expressionLanguages } from "@/utils/constants/expressionTypes";
import { useExpressionStore } from "@/lib/store/useExpressionStore";

interface ExpressionFiltersModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function ExpressionFiltersModal({
  open,
  onClose,
  onApply,
}: ExpressionFiltersModalProps) {
  const { filters } = useExpressionStore();
  const [localFilters, setLocalFilters] = useState<any>({});

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTypeToggle = (type: string) => {
    const currentTypes = localFilters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t: string) => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange("type", newTypes);
  };

  const handleLevelToggle = (level: string) => {
    const currentLevels = localFilters.difficulty || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l: string) => l !== level)
      : [...currentLevels, level];
    
    handleFilterChange("difficulty", newLevels);
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = localFilters.language || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((l: string) => l !== language)
      : [...currentLanguages, language];
    
    handleFilterChange("language", newLanguages);
  };

  const handleHasImageToggle = () => {
    const currentValue = localFilters.hasImage;
    handleFilterChange("hasImage", !currentValue);
  };

  const handleHasSpanishToggle = () => {
    const currentValue = localFilters.hasSpanish;
    handleFilterChange("hasSpanish", !currentValue);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.type?.length) count += localFilters.type.length;
    if (localFilters.difficulty?.length) count += localFilters.difficulty.length;
    if (localFilters.language?.length) count += localFilters.language.length;
    if (localFilters.hasImage) count++;
    if (localFilters.hasSpanish) count++;
    if (localFilters.createdAt) count++;
    if (localFilters.updatedAt) count++;
    return count;
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={onClose}
      title="Filtros de Expresiones"
      description="Filtra las expresiones según tus criterios"
      size="4xl"
      height="h-[90dvh]"
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Info de filtros activos */}
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <>
                <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
                <span className="text-sm text-muted-foreground">
                  {getActiveFiltersCount()} filtro{getActiveFiltersCount() !== 1 ? 's' : ''} activo{getActiveFiltersCount() !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
          
          {/* Botones */}
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
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
          <div className="space-y-6">
          {/* Tipos de Expresión */}
          <div>
            <Label className="text-base font-semibold">Tipos de Expresión</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {expressionTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={localFilters.type?.includes(type.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeToggle(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Niveles */}
          <div>
            <Label className="text-base font-semibold">Niveles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {expressionLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={localFilters.difficulty?.includes(level.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLevelToggle(level.value)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div>
            <Label className="text-base font-semibold">Idiomas</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {expressionLanguages.map((language) => (
                <Button
                  key={language.value}
                  variant={localFilters.language?.includes(language.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLanguageToggle(language.value)}
                >
                  {language.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Filtros booleanos */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasImage"
                checked={localFilters.hasImage || false}
                onChange={handleHasImageToggle}
                className="rounded"
              />
              <Label htmlFor="hasImage">Solo con imagen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasSpanish"
                checked={localFilters.hasSpanish || false}
                onChange={handleHasSpanishToggle}
                className="rounded"
              />
              <Label htmlFor="hasSpanish">Solo con traducción al español</Label>
            </div>
          </div>

          {/* Filtros de fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="createdAt">Creado desde</Label>
              <Input
                id="createdAt"
                type="date"
                value={localFilters.createdAt || ""}
                onChange={(e) => handleFilterChange("createdAt", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="updatedAt">Actualizado desde</Label>
              <Input
                id="updatedAt"
                type="date"
                value={localFilters.updatedAt || ""}
                onChange={(e) => handleFilterChange("updatedAt", e.target.value)}
              />
            </div>
          </div>

          {/* Filtros activos */}
          {getActiveFiltersCount() > 0 && (
            <div>
              <Label className="text-base font-semibold">Filtros Activos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.type?.map((type: string) => (
                                              <Badge key={type} variant="secondary">
                    {expressionTypes.find(t => t.value === type)?.label || type}
                    <button
                      onClick={() => handleTypeToggle(type)}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {localFilters.difficulty?.map((level: string) => (
                                              <Badge key={level} variant="secondary">
                    {expressionLevels.find(l => l.value === level)?.label || level}
                    <button
                      onClick={() => handleLevelToggle(level)}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {localFilters.language?.map((lang: string) => (
                                              <Badge key={lang} variant="secondary">
                    {expressionLanguages.find(l => l.value === lang)?.label || lang}
                    <button
                      onClick={() => handleLanguageToggle(lang)}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {localFilters.hasImage && (
                  <Badge variant="secondary">
                    Con imagen
                    <button
                      onClick={handleHasImageToggle}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {localFilters.hasSpanish && (
                  <Badge variant="secondary">
                    Con español
                    <button
                      onClick={handleHasSpanishToggle}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalNova>
  );
} 