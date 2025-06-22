"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useLecturesStore } from "@/lib/store/lectures-store"
import { Eye, Edit, Trash2, Plus, BookOpen, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LecturesPage() {
  const router = useRouter()
  const { lectures, addLecture, updateLecture, deleteLecture } = useLecturesStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: "/placeholder.svg?height=200&width=300",
  })

  const handleAddLecture = () => {
    if (formData.title && formData.content) {
      addLecture(formData)
      setFormData({
        title: "",
        description: "",
        content: "",
        image: "/placeholder.svg?height=200&width=300",
      })
      setIsAddModalOpen(false)
    }
  }

  const handleEditLecture = () => {
    if (selectedLecture && formData.title && formData.content) {
      updateLecture(selectedLecture, formData)
      setIsEditModalOpen(false)
      setSelectedLecture(null)
    }
  }

  const openEditModal = (lectureId: string) => {
    const lecture = lectures.find((l) => l.id === lectureId)
    if (lecture) {
      setFormData({
        title: lecture.title,
        description: lecture.description || "",
        content: lecture.content,
        image: lecture.image,
      })
      setSelectedLecture(lectureId)
      setIsEditModalOpen(true)
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedLecture) {
      deleteLecture(selectedLecture)
      setDeleteDialogOpen(false)
      setSelectedLecture(null)
    }
  }

  const openDeleteDialog = (lectureId: string) => {
    setSelectedLecture(lectureId)
    setDeleteDialogOpen(true)
  }

  const viewLecture = (lectureId: string) => {
    router.push(`/lectures/${lectureId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lectures</h1>
          <p className="text-muted-foreground">Gestiona y lee tus materiales de estudio</p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline">{lectures.length}/10 lectures</Badge>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>Crear Nueva Lecture</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Lectura</DialogTitle>
                <DialogDescription>Crea una nueva lectura para tu biblioteca</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título de la lectura"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Breve descripción"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Contenido de la lectura..."
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddLecture}>Agregar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid de lecturas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectures.map((lecture) => (
          <Card key={lecture.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image src={lecture.image || "/placeholder.svg"} alt={lecture.title} fill className="object-cover" />
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2">{lecture.title}</CardTitle>
              {lecture.description && <CardDescription className="line-clamp-2">{lecture.description}</CardDescription>}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(lecture.createdAt).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Lectura
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => viewLecture(lecture.id)} className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(lecture.id)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(lecture.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Lectura</DialogTitle>
            <DialogDescription>Modifica los detalles de la lectura</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título de la lectura"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descripción"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Contenido</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenido de la lectura..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditLecture}>Guardar Cambios</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta lectura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La lectura será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
