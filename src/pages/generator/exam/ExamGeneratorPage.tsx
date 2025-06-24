import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, FileText, Download, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useGenerator } from "@/hooks/use-generator";

export default function ExamGeneratorPage() {
  const {
    isFilterOpen,
    setIsFilterOpen,
    filters,
    updateFilter,
    handleFilterSubmit,
  } = useGenerator("exam");

  return (
    <PageLayout>
      <PageHeader
        title="Exam Generator"
        description="Genera exámenes personalizados con IA."
        actions={
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Configurar Examen</DialogTitle>
                <DialogDescription>
                  Define los parámetros para generar tu examen personalizado
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFilterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Tema del Examen</Label>
                  <Textarea
                    id="topic"
                    placeholder="Describe el tema principal del examen..."
                    value={filters.topic}
                    onChange={(e) => updateFilter("topic", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">
                    Instrucciones Adicionales
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Instrucciones específicas para el examen..."
                    value={filters.instructions}
                    onChange={(e) =>
                      updateFilter("instructions", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select
                      value={filters.level}
                      onValueChange={(value) => updateFilter("level", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Principiante</SelectItem>
                        <SelectItem value="A2">A2 - Elemental</SelectItem>
                        <SelectItem value="B1">B1 - Intermedio</SelectItem>
                        <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                        <SelectItem value="C1">C1 - Avanzado</SelectItem>
                        <SelectItem value="C2">C2 - Maestría</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select
                      value={filters.difficulty}
                      onValueChange={(value) =>
                        updateFilter("difficulty", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Medio</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Aplicar Filtros</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Contenido principal */}
      <div className="grid gap-6">
        {/* Configuración rápida */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configuración Rápida
            </CardTitle>
            <CardDescription>
              Genera un examen con configuración básica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quickTopic">Tema</Label>
                <Input id="quickTopic" placeholder="Ej: Matemáticas básicas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickQuestions">Número de preguntas</Label>
                <Input
                  id="quickQuestions"
                  type="number"
                  placeholder="10"
                  min="1"
                  max="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickTime">Tiempo (minutos)</Label>
                <Input
                  id="quickTime"
                  type="number"
                  placeholder="60"
                  min="5"
                  max="180"
                />
              </div>
            </div>
            <CardFooter>
              <Button className="w-full">Generar Examen Rápido</Button>
            </CardFooter>
          </CardContent>
        </Card>

        {/* Exámenes generados */}
        <Card>
          <CardHeader>
            <CardTitle>Exámenes Recientes</CardTitle>
            <CardDescription>Tus últimos exámenes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((exam) => (
                <div
                  key={exam}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">
                      Examen de Matemáticas #{exam}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nivel: B1 • Dificultad: Medio • 15 preguntas
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Generado hace {exam} hora{exam > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
