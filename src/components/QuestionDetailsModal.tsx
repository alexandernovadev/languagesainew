import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Image,
  Video,
  Radio,
  Link,
  Clock,
  Star,
  Tag,
  Lightbulb,
  CheckCircle,
  XCircle,
  Play,
  Volume2,
} from "lucide-react";
import { Question } from "@/models/Question";
import { questionLevels, questionTypes, questionDifficulties } from "@/data/questionTypes";

interface QuestionDetailsModalProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionDetailsModal({ question, open, onOpenChange }: QuestionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!question) return null;

  const getLevelLabel = (level: string) => {
    return questionLevels.find(l => l.value === level)?.label || level;
  };

  const getTypeLabel = (type: string) => {
    return questionTypes.find(t => t.value === type)?.label || type;
  };

  const getDifficultyLabel = (difficulty: number) => {
    return questionDifficulties.find(d => d.value === difficulty)?.label || `Nivel ${difficulty}`;
  };

  const getDifficultyVariant = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "blue";
      case 2: return "secondary";
      case 3: return "yellow";
      case 4: return "magenta";
      case 5: return "destructive";
      default: return "outline";
    }
  };

  const getMediaIcon = (mediaType?: string) => {
    switch (mediaType) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "audio": return <Radio className="h-4 w-4" />;
      case "link": return <Link className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const playMedia = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const hasMedia = question.media && (question.media.audio || question.media.image || question.media.video);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles de la Pregunta
          </DialogTitle>
          <DialogDescription>
            Información completa de la pregunta y sus configuraciones
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="options">Opciones</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Tema</Label>
                    <p className="text-lg font-medium">{question.topic || "Sin tema"}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{getTypeLabel(question.type)}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Nivel CEFR</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{getLevelLabel(question.level)}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{getTypeLabel(question.type)}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Dificultad</Label>
                    <div className="mt-1">
                      <Badge variant={getDifficultyVariant(question.difficulty)}>
                        {getDifficultyLabel(question.difficulty)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {question.tags && question.tags.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Etiquetas
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Respuestas correctas
                    </Label>
                    <p className="text-lg font-medium">{question.correctAnswers.length}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Creada</Label>
                    <p className="text-sm">
                      {question.createdAt ? new Date(question.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "Fecha no disponible"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenido de la Pregunta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Pregunta</Label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-lg leading-relaxed">{question.text}</p>
                  </div>
                </div>

                {question.explanation && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Explicación
                      </Label>
                      <div className="p-4 rounded-lg border border-primary/40 bg-transparent">
                        <p className="text-sm leading-relaxed text-foreground">{question.explanation}</p>
                      </div>
                    </div>
                  </>
                )}

                {hasMedia && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Multimedia
                      </Label>
                      
                      {question.media?.image && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              <span className="text-sm text-muted-foreground">IMAGEN</span>
                              <span className="text-sm font-mono text-muted-foreground">
                                {question.media.image}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => playMedia(question.media?.image)}
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      )}

                      {question.media?.video && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              <span className="text-sm text-muted-foreground">VIDEO</span>
                              <span className="text-sm font-mono text-muted-foreground">
                                {question.media.video}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => playMedia(question.media?.video)}
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              Reproducir
                            </Button>
                          </div>
                        </div>
                      )}

                      {question.media?.audio && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Radio className="h-4 w-4" />
                              <span className="text-sm text-muted-foreground">AUDIO</span>
                              <span className="text-sm font-mono text-muted-foreground">
                                {question.media.audio}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => playMedia(question.media?.audio)}
                              className="flex items-center gap-2"
                            >
                              <Volume2 className="h-4 w-4" />
                              Reproducir
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Opciones de Respuesta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {question.options && question.options.length > 0 ? (
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-colors duration-150
                          ${option.isCorrect
                            ? "border-green-500 text-green-400 bg-transparent"
                            : "border-muted text-muted-foreground bg-transparent"}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {option.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className={`text-sm font-medium ${option.isCorrect ? "text-green-400" : "text-muted-foreground"}`}>
                            {option.isCorrect ? "Correcta" : "Incorrecta"}
                          </span>
                        </div>
                        <p className={`flex-1 text-lg font-semibold ${option.isCorrect ? "text-green-300" : "text-foreground"}`}>{option.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Respuestas Correctas</Label>
                    <div className="p-4 rounded-lg border border-green-500 bg-transparent">
                      <div className="space-y-2">
                        {question.correctAnswers.map((answer, index) => (
                          <p key={index} className="text-lg font-semibold text-green-400">{answer}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 