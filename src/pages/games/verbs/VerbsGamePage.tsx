import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Check, X, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";

// Datos de verbos irregulares
const irregularVerbs = [
  {
    id: 1,
    infinitive: "be",
    past: "was/were",
    participle: "been",
    meaning: "ser/estar",
  },
  {
    id: 2,
    infinitive: "have",
    past: "had",
    participle: "had",
    meaning: "tener",
  },
  {
    id: 3,
    infinitive: "do",
    past: "did",
    participle: "done",
    meaning: "hacer",
  },
  {
    id: 4,
    infinitive: "say",
    past: "said",
    participle: "said",
    meaning: "decir",
  },
  {
    id: 5,
    infinitive: "get",
    past: "got",
    participle: "gotten",
    meaning: "obtener",
  },
  {
    id: 6,
    infinitive: "make",
    past: "made",
    participle: "made",
    meaning: "hacer",
  },
  { id: 7, infinitive: "go", past: "went", participle: "gone", meaning: "ir" },
  {
    id: 8,
    infinitive: "know",
    past: "knew",
    participle: "known",
    meaning: "saber",
  },
  {
    id: 9,
    infinitive: "take",
    past: "took",
    participle: "taken",
    meaning: "tomar",
  },
  {
    id: 10,
    infinitive: "see",
    past: "saw",
    participle: "seen",
    meaning: "ver",
  },
  {
    id: 11,
    infinitive: "come",
    past: "came",
    participle: "come",
    meaning: "venir",
  },
  {
    id: 12,
    infinitive: "think",
    past: "thought",
    participle: "thought",
    meaning: "pensar",
  },
  {
    id: 13,
    infinitive: "look",
    past: "looked",
    participle: "looked",
    meaning: "mirar",
  },
  {
    id: 14,
    infinitive: "want",
    past: "wanted",
    participle: "wanted",
    meaning: "querer",
  },
  {
    id: 15,
    infinitive: "give",
    past: "gave",
    participle: "given",
    meaning: "dar",
  },
  {
    id: 16,
    infinitive: "use",
    past: "used",
    participle: "used",
    meaning: "usar",
  },
  {
    id: 17,
    infinitive: "find",
    past: "found",
    participle: "found",
    meaning: "encontrar",
  },
  {
    id: 18,
    infinitive: "tell",
    past: "told",
    participle: "told",
    meaning: "contar",
  },
  {
    id: 19,
    infinitive: "ask",
    past: "asked",
    participle: "asked",
    meaning: "preguntar",
  },
  {
    id: 20,
    infinitive: "work",
    past: "worked",
    participle: "worked",
    meaning: "trabajar",
  },
];

export default function VerbsGamePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{
    [key: number]: { past: string; participle: string };
  }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState<{
    [key: number]: { past: boolean; participle: boolean };
  }>({});

  const itemsPerPage = 10;
  const totalPages = Math.ceil(irregularVerbs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVerbs = irregularVerbs.slice(startIndex, endIndex);

  const handleInputChange = (
    verbId: number,
    field: "past" | "participle",
    value: string
  ) => {
    setUserAnswers((prev) => ({
      ...prev,
      [verbId]: {
        ...prev[verbId],
        [field]: value,
      },
    }));
  };

  const checkAnswers = () => {
    const newCheckedAnswers: {
      [key: number]: { past: boolean; participle: boolean };
    } = {};

    currentVerbs.forEach((verb) => {
      const userAnswer = userAnswers[verb.id];
      if (userAnswer) {
        newCheckedAnswers[verb.id] = {
          past:
            userAnswer.past?.toLowerCase().trim() === verb.past.toLowerCase(),
          participle:
            userAnswer.participle?.toLowerCase().trim() ===
            verb.participle.toLowerCase(),
        };
      }
    });

    setCheckedAnswers(newCheckedAnswers);
    setShowAnswers(true);
  };

  const resetPage = () => {
    const currentVerbIds = currentVerbs.map((verb) => verb.id);
    const newUserAnswers = { ...userAnswers };
    const newCheckedAnswers = { ...checkedAnswers };

    currentVerbIds.forEach((id) => {
      delete newUserAnswers[id];
      delete newCheckedAnswers[id];
    });

    setUserAnswers(newUserAnswers);
    setCheckedAnswers(newCheckedAnswers);
    setShowAnswers(false);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setShowAnswers(false);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setShowAnswers(false);
    }
  };

  const getInputClassName = (verbId: number, field: "past" | "participle") => {
    if (!showAnswers) return "";
    const isCorrect = checkedAnswers[verbId]?.[field];
    return isCorrect
      ? "border-green-500 bg-green-50 dark:bg-green-950"
      : "border-red-500 bg-red-50 dark:bg-red-950";
  };

  const correctAnswers = Object.values(checkedAnswers).reduce((acc, answer) => {
    return acc + (answer.past ? 1 : 0) + (answer.participle ? 1 : 0);
  }, 0);

  const totalAnswers = Object.keys(checkedAnswers).length * 2;

  return (
    <PageLayout>
      <PageHeader
        title="Verbs Participios"
        description="Practica los verbos irregulares y sus participios."
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetPage}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button onClick={checkAnswers} disabled={showAnswers}>
              <Check className="h-4 w-4 mr-2" />
              Verificar
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        {showAnswers && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="default" className="text-sm">
                    Página {currentPage} de {totalPages}
                  </Badge>
                  <Badge
                    variant={
                      correctAnswers === totalAnswers ? "default" : "secondary"
                    }
                    className="text-sm"
                  >
                    {correctAnswers}/{totalAnswers} correctas
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((correctAnswers / totalAnswers) * 100)}% de
                  acierto
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla de verbos */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Infinitivo</TableHead>
                    <TableHead className="w-[150px]">Pasado</TableHead>
                    <TableHead className="w-[150px]">Participio</TableHead>
                    <TableHead>Significado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentVerbs.map((verb) => (
                    <TableRow key={verb.id}>
                      <TableCell className="font-medium">
                        {verb.infinitive}
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Input
                            placeholder="..."
                            value={userAnswers[verb.id]?.past || ""}
                            onChange={(e) =>
                              handleInputChange(verb.id, "past", e.target.value)
                            }
                            className={getInputClassName(verb.id, "past")}
                            disabled={showAnswers}
                          />
                          {showAnswers && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              {checkedAnswers[verb.id]?.past ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          )}
                          {showAnswers && !checkedAnswers[verb.id]?.past && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Respuesta: {verb.past}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Input
                            placeholder="..."
                            value={userAnswers[verb.id]?.participle || ""}
                            onChange={(e) =>
                              handleInputChange(
                                verb.id,
                                "participle",
                                e.target.value
                              )
                            }
                            className={getInputClassName(verb.id, "participle")}
                            disabled={showAnswers}
                          />
                          {showAnswers && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              {checkedAnswers[verb.id]?.participle ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          )}
                          {showAnswers &&
                            !checkedAnswers[verb.id]?.participle && (
                              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                Respuesta: {verb.participle}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {verb.meaning}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Navegación */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentPage(page);
                  setShowAnswers(false);
                }}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
