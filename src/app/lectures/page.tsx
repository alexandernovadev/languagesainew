import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLectureStore } from "@/lib/store/useLectureStore";
import { Eye, Edit, Trash2, Plus, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Lecture } from "@/models/Lecture";

export default function LecturesPage() {
  const navigate = useNavigate();
  const {
    lectures,
    loading,
    errors,
    totalPages,
    currentPage,
    getLectures,
    postLecture,
    putLecture,
    deleteLecture,
    actionLoading,
  } = useLectureStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<
    Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  >({
    time: 0,
    level: "",
    typeWrite: "",
    language: "",
    img: "",
    urlAudio: "",
    content: "",
  });

  // Fetch lectures on mount
  useEffect(() => {
    getLectures(1, 10);
  }, []);

  const handleAddLecture = async () => {
    if (
      formData.content &&
      formData.level &&
      formData.language &&
      formData.typeWrite
    ) {
      await postLecture(formData as Lecture);
      setFormData({
        time: 0,
        level: "",
        typeWrite: "",
        language: "",
        img: "",
        urlAudio: "",
        content: "",
      });
      setIsAddModalOpen(false);
    }
  };

  const handleEditLecture = async () => {
    if (
      selectedLectureId &&
      formData.content &&
      formData.level &&
      formData.language &&
      formData.typeWrite
    ) {
      await putLecture(selectedLectureId, formData as Lecture);
      setIsEditModalOpen(false);
      setSelectedLectureId(null);
    }
  };

  // Validación de campos requeridos
  const isFormValid = formData.content && formData.level && formData.language && formData.typeWrite;

  const openEditModal = (lecture: Lecture) => {
    setFormData({
      time: lecture.time,
      level: lecture.level,
      typeWrite: lecture.typeWrite,
      language: lecture.language,
      img: lecture.img || "",
      urlAudio: lecture.urlAudio || "",
      content: lecture.content,
    });
    setSelectedLectureId(lecture._id);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedLectureId) {
      await deleteLecture(selectedLectureId);
      setDeleteDialogOpen(false);
      setSelectedLectureId(null);
    }
  };

  const openDeleteDialog = (lectureId: string) => {
    setSelectedLectureId(lectureId);
    setDeleteDialogOpen(true);
  };

  const viewLecture = (lectureId: string) => {
    navigate(`/lectures/${lectureId}`);
  };

  const handlePageChange = (page: number) => {
    getLectures(page, 10);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lectures</h1>
          <p className="text-muted-foreground">
            Gestiona y lee tus materiales de estudio
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Página {currentPage} de {totalPages} • {lectures.length} lectures
          </Badge>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>Crear Nueva Lecture</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl">Crear Nueva Lectura</DialogTitle>
                <DialogDescription>
                  Crea una nueva lectura para tu biblioteca. Completa todos los campos para una mejor experiencia.
                </DialogDescription>
              </DialogHeader>
              
              <div className="overflow-y-auto max-h-[calc(90vh-240px)] pr-2 space-y-6 mx-4">
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
              </div>

              {/* Footer con botones */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-6 mx-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddLecture}
                  disabled={actionLoading.post || !isFormValid}
                  className="px-6"
                >
                  {actionLoading.post ? "Creando..." : "Crear Lectura"}
                </Button>
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
          <div className="col-span-3 text-center py-10 text-muted-foreground">
            No hay lecturas disponibles.
          </div>
        ) : (
          lectures.map((lecture) => (
            <Card
              key={lecture._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <img
                  src={lecture.img || "/placeholder.svg"}
                  alt={lecture.language}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2">
                  {lecture.language} - {lecture.level}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {lecture.typeWrite}
                </CardDescription>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {lecture.createdAt
                    ? new Date(lecture.createdAt).toLocaleDateString()
                    : ""}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {lecture.time} min
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewLecture(lecture._id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(lecture)}
                      className="h-8 w-8 p-0"
                    >
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Mostrar páginas */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Editar Lectura</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la lectura. Todos los campos son importantes para una mejor experiencia.
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-240px)] pr-2 space-y-6 mx-4">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-level" className="text-sm font-medium">
                    Nivel de Dificultad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-level"
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
                  <Label htmlFor="edit-typeWrite" className="text-sm font-medium">
                    Tipo de Contenido <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-typeWrite"
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
                  <Label htmlFor="edit-language" className="text-sm font-medium">
                    Idioma <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-language"
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
                  <Label htmlFor="edit-time" className="text-sm font-medium">
                    Duración Estimada (minutos)
                  </Label>
                  <Input
                    id="edit-time"
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
                  <Label htmlFor="edit-img" className="text-sm font-medium">
                    Imagen de Portada (URL)
                  </Label>
                  <Input
                    id="edit-img"
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
                <Label htmlFor="edit-content" className="text-sm font-medium">
                  Contenido Completo <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-content"
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
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6 mx-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditLecture} 
              disabled={actionLoading.put || !isFormValid}
              className="px-6"
            >
              {actionLoading.put ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de eliminar esta lectura?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La lectura será eliminada
              permanentemente.
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
  );
}
