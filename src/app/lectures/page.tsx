import { useEffect, useState } from "react"
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
import { useLectureStore } from "@/lib/store/useLectureStore"
import { Eye, Edit, Trash2, Plus, BookOpen, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Lecture } from "@/models/Lecture"

export default function LecturesPage() {
  const navigate = useNavigate()
  const {
    lectures,
    loading,
    errors,
    getLectures,
    postLecture,
    putLecture,
    deleteLecture,
    actionLoading,
  } = useLectureStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<Lecture, "_id" | "createdAt" | "updatedAt">>({
    time: 0,
    level: "",
    typeWrite: "",
    language: "",
    img: "",
    urlAudio: "",
    content: "",
  })

  // Fetch lectures on mount
  useEffect(() => {
    getLectures()
    // eslint-disable-next-line
  }, [])

  const handleAddLecture = async () => {
    if (formData.content && formData.level && formData.language && formData.typeWrite) {
      await postLecture(formData as Lecture)
      setFormData({
        time: 0,
        level: "",
        typeWrite: "",
        language: "",
        img: "",
        urlAudio: "",
        content: "",
      })
      setIsAddModalOpen(false)
    }
  }

  const handleEditLecture = async () => {
    if (selectedLectureId && formData.content && formData.level && formData.language && formData.typeWrite) {
      await putLecture(selectedLectureId, formData as Lecture)
      setIsEditModalOpen(false)
      setSelectedLectureId(null)
    }
  }

  const openEditModal = (lecture: Lecture) => {
    setFormData({
      time: lecture.time,
      level: lecture.level,
      typeWrite: lecture.typeWrite,
      language: lecture.language,
      img: lecture.img || "",
      urlAudio: lecture.urlAudio || "",
      content: lecture.content,
    })
    setSelectedLectureId(lecture._id)
    setIsEditModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedLectureId) {
      await deleteLecture(selectedLectureId)
      setDeleteDialogOpen(false)
      setSelectedLectureId(null)
    }
  }

  const openDeleteDialog = (lectureId: string) => {
    setSelectedLectureId(lectureId)
    setDeleteDialogOpen(true)
  }

  const viewLecture = (lectureId: string) => {
    navigate(`/lectures/${lectureId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lectures</h1>
          <p className="text-muted-foreground">Gestiona y lee tus materiales de estudio</p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline">{lectures.length} lectures</Badge>
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
                  <Label htmlFor="level">Nivel</Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="Nivel (ej: beginner, intermediate, advanced)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeWrite">Tipo</Label>
                  <Input
                    id="typeWrite"
                    value={formData.typeWrite}
                    onChange={(e) => setFormData({ ...formData, typeWrite: e.target.value })}
                    placeholder="Tipo de escritura (ej: essay, story, article)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="Idioma (ej: English, Spanish)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Duración (minutos)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: Number(e.target.value) })}
                    placeholder="Duración estimada"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img">Imagen (URL)</Label>
                  <Input
                    id="img"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="URL de la imagen"
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
                  <Button onClick={handleAddLecture} disabled={actionLoading.post}>Agregar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid de lecturas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-10">Cargando...</div>
        ) : lectures.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-muted-foreground">No hay lecturas disponibles.</div>
        ) : (
          lectures.map((lecture) => (
            <Card key={lecture._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <img src={lecture.img || "/placeholder.svg"} alt={lecture.language} className="h-full w-full object-cover" />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2">{lecture.language} - {lecture.level}</CardTitle>
                <CardDescription className="line-clamp-2">{lecture.typeWrite}</CardDescription>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {lecture.createdAt ? new Date(lecture.createdAt).toLocaleDateString() : ""}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {lecture.time} min
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => viewLecture(lecture._id)} className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(lecture)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(lecture._id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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
              <Label htmlFor="edit-level">Nivel</Label>
              <Input
                id="edit-level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                placeholder="Nivel (ej: beginner, intermediate, advanced)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-typeWrite">Tipo</Label>
              <Input
                id="edit-typeWrite"
                value={formData.typeWrite}
                onChange={(e) => setFormData({ ...formData, typeWrite: e.target.value })}
                placeholder="Tipo de escritura (ej: essay, story, article)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-language">Idioma</Label>
              <Input
                id="edit-language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="Idioma (ej: English, Spanish)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">Duración (minutos)</Label>
              <Input
                id="edit-time"
                type="number"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: Number(e.target.value) })}
                placeholder="Duración estimada"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-img">Imagen (URL)</Label>
              <Input
                id="edit-img"
                value={formData.img}
                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                placeholder="URL de la imagen"
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
              <Button onClick={handleEditLecture} disabled={actionLoading.put}>Guardar Cambios</Button>
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
              disabled={actionLoading.delete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
