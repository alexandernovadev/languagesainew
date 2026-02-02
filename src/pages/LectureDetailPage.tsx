import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import { lectureService } from "@/services/lectureService";
import { ILecture } from "@/types/models/Lecture";
import { ArrowLeft, Clock, BookOpen, Volume2 } from "lucide-react";
import { getDifficultyVariant } from "@/utils/common";
import { getMarkdownTitle, removeFirstH1 } from "@/utils/common/string/markdown";
import { toast } from "sonner";

export default function LectureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<ILecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadLecture();
    }
  }, [id]);

  const loadLecture = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await lectureService.getLectureById(id);
      setLecture(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Error al cargar la lectura";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader 
          title="Cargando..." 
          description="Cargando la lectura"
        />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="space-y-4">
        <PageHeader 
          title="Error" 
          description="No se pudo cargar la lectura"
        />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error || "Lectura no encontrada"}</p>
            <Button onClick={() => navigate("/lectures")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Lecturas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lectureTitle = getMarkdownTitle(lecture.content) || lecture.typeWrite || "Lectura";

  return (
    <div className="space-y-4">
      <PageHeader 
        title={lectureTitle} 
        description="Lee y disfruta del contenido"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/lectures")}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      {/* Image */}
      {lecture.img && (
        <Card>
          <CardContent className="p-0">
            <img
              src={lecture.img}
              alt={lecture.typeWrite || "Lecture"}
              className="w-full h-auto max-h-96 object-cover rounded-t-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant={getDifficultyVariant(lecture.difficulty)}>
              {lecture.difficulty || "N/A"}
            </Badge>
            {lecture.language && (
              <Badge variant="outline">
                {lecture.language.toUpperCase()}
              </Badge>
            )}
            {lecture.time && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lecture.time} min
              </Badge>
            )}
            {lecture.typeWrite && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {lecture.typeWrite}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audio Player */}
      {lecture.urlAudio && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Audio</span>
            </div>
            <audio controls className="w-full">
              <source src={lecture.urlAudio} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Card>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <MarkdownRenderer 
            content={removeFirstH1(lecture.content)} 
            variant="reading"
          />
        </CardContent>
      </Card>
    </div>
  );
}
