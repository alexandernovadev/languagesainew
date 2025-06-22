import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Filter, BookOpen, Download, Eye, Clock } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { PageLayout } from "@/components/layouts/page-layout"
import { useGenerator } from "@/hooks/use-generator"

export default function LectureGenerator() {
  const { isFilterOpen, setIsFilterOpen, filters, updateFilter, handleFilterSubmit } = useGenerator('lecture')

  return (
    <PageLayout>
      <PageHeader
        title="Lecture Generator"
        description="Crea presentaciones y material educativo con IA"
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
                <DialogTitle>Configurar Presentación</DialogTitle>
                <DialogDescription>Define los parámetros para generar tu material educativo</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFilterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Tema de la Presentación</Label>
                  <Textarea
                    id="topic"
                    placeholder="Describe el tema principal de la presentación..."
                    value={filters.topic}
                    onChange={(e) => updateFilter('topic', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">Objetivos de Aprendizaje</Label>
                  <Textarea
                    id="objectives"
                    placeholder="¿Qué deben aprender los estudiantes?..."
                    value={filters.objectives}
                    onChange={(e) => updateFilter('objectives', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select value={filters.level} onValueChange={(value) => updateFilter('level', value)}>
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
                      onValueChange={(value) => updateFilter('difficulty', value)}
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
                  <Button type="button" variant="outline" onClick={() => setIsFilterOpen(false)}>
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
              <BookOpen className="h-5 w-5" />
              Configuración Rápida
            </CardTitle>
            <CardDescription>Genera una presentación con configuración básica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quickTopic">Tema</Label>
                <Input id="quickTopic" placeholder="Ej: Historia del Arte" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickSlides">Número de slides</Label>
                <Input id="quickSlides" type="number" placeholder="20" min="5" max="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickDuration">Duración (minutos)</Label>
                <Input id="quickDuration" type="number" placeholder="45" min="10" max="120" />
              </div>
            </div>
            <CardFooter>
              <Button className="w-full">Generar Presentación Rápida</Button>
            </CardFooter>
          </CardContent>
        </Card>

        {/* Plantillas */}
        <Card>
          <CardHeader>
            <CardTitle>Plantillas Disponibles</CardTitle>
            <CardDescription>Elige una plantilla para comenzar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Académica", desc: "Para clases universitarias", color: "bg-blue-500" },
                { name: "Corporativa", desc: "Para presentaciones empresariales", color: "bg-green-500" },
                { name: "Creativa", desc: "Para talleres y workshops", color: "bg-purple-500" },
              ].map((template) => (
                <div
                  key={template.name}
                  className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className={`w-full h-24 ${template.color} rounded mb-3 opacity-20`}></div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Presentaciones recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Presentaciones Recientes</CardTitle>
            <CardDescription>Tus últimas presentaciones generadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((lecture) => (
                <div key={lecture} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Introducción a la Física #{lecture}</h4>
                    <p className="text-sm text-muted-foreground">Nivel: B2 • Dificultad: Medio • 25 slides</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        45 min
                      </span>
                      <span>Generado hace {lecture} hora{lecture > 1 ? "s" : ""}</span>
                    </div>
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
  )
}
