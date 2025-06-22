import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Lecture } from "@/models/Lecture";

interface LectureFormProps {
  initialData?: Partial<Lecture>;
  onSubmit: (data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitText?: string;
}

export function LectureForm({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Guardar"
}: LectureFormProps) {
  const [formData, setFormData] = useState<Omit<Lecture, "_id" | "createdAt" | "updatedAt">>({
    time: 0,
    level: "",
    typeWrite: "",
    language: "",
    img: "",
    urlAudio: "",
    content: "",
    ...initialData
  });

  const isFormValid = formData.content && formData.level && formData.language && formData.typeWrite;

  const handleSubmit = async () => {
    if (isFormValid) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(90vh-240px)] pr-2 space-y-6 mx- px-3">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary border-b pb-2">
          Información Básica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium">
              Nivel de Dificultad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="level"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              placeholder="Ej: A1, B2, C1..."
              className={`h-10 ${!formData.level ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            <p className="text-xs text-muted-foreground">
              Define el nivel de dificultad de la lectura
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="typeWrite" className="text-sm font-medium">
              Tipo de Contenido <span className="text-red-500">*</span>
            </Label>
            <Input
              id="typeWrite"
              value={formData.typeWrite}
              onChange={(e) =>
                setFormData({ ...formData, typeWrite: e.target.value })
              }
              placeholder="Ej: essay, story, article, analysis..."
              className={`h-10 ${!formData.typeWrite ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            <p className="text-xs text-muted-foreground">
              Especifica el tipo de contenido
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">
              Idioma <span className="text-red-500">*</span>
            </Label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              placeholder="Ej: English, Spanish, French..."
              className={`h-10 ${!formData.language ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            <p className="text-xs text-muted-foreground">
              Idioma principal del contenido
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">
              Duración Estimada (minutos)
            </Label>
            <Input
              id="time"
              type="number"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: Number(e.target.value) })
              }
              placeholder="Ej: 15, 30, 45..."
              className="h-10"
              min="1"
              max="180"
            />
            <p className="text-xs text-muted-foreground">
              Tiempo estimado para completar la lectura
            </p>
          </div>
        </div>
      </div>

      {/* Multimedia */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary border-b pb-2">
          Multimedia
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="img" className="text-sm font-medium">
              Imagen de Portada (URL)
            </Label>
            <Input
              id="img"
              value={formData.img}
              onChange={(e) =>
                setFormData({ ...formData, img: e.target.value })
              }
              placeholder="https://ejemplo.com/imagen.jpg"
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              URL de la imagen que representará la lectura
            </p>
            {formData.img && (
              <div className="mt-2">
                <img 
                  src={formData.img} 
                  alt="Preview" 
                  className="w-32 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary border-b pb-2">
          Contenido de la Lectura
        </h3>
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium">
            Contenido Completo <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Escribe aquí el contenido completo de la lectura..."
            rows={12}
            className={`resize-none font-mono text-sm ${!formData.content ? 'border-red-300 focus:border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {formData.content.length} caracteres
            </span>
            <span>
              Aproximadamente {Math.ceil(formData.content.length / 200)} minutos de lectura
            </span>
          </div>
        </div>
      </div>

      {/* Footer con botones */}
      <div className="flex justify-end gap-3 pt-4 border-t mt-6 mx-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-6"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          className="px-6"
        >
          {loading ? "Guardando..." : submitText}
        </Button>
      </div>
    </div>
  );
} 