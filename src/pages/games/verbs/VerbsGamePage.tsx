import { useState, useEffect } from "react";
import {
  Card,
  CardContent
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
import verbsData from "@/lib/data/verbsPaticiple.json";

// Datos de verbos irregulares
const irregularVerbs = verbsData.map((verb, idx) => ({
  id: idx + 1,
  infinitive: verb["Verb"],
  past: verb["Past"],
  participle: verb["Past Participle (PP)"],
  meaning: verb["Spanish"],
}));

// Nueva función para generar para cada verbo una columna aleatoria para el input
function getRandomField(): "infinitive" | "past" | "participle" {
  const fields = ["infinitive", "past", "participle"] as const;
  return fields[Math.floor(Math.random() * fields.length)];
}

export default function VerbsGamePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{
    [key: number]: { infinitive?: string; past?: string; participle?: string };
  }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState<{
    [key: number]: boolean;
  }>({});

  // Para cada página, generamos una asignación aleatoria de campo a preguntar por fila
  const [inputFields, setInputFields] = useState<{ [key: number]: "infinitive" | "past" | "participle" }>({});

  const itemsPerPage = 10;
  const totalPages = Math.ceil(irregularVerbs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVerbs = irregularVerbs.slice(startIndex, endIndex);

  // Cuando cambia la página, generamos nuevos campos aleatorios
  useEffect(() => {
    const newFields: { [key: number]: "infinitive" | "past" | "participle" } = {};
    currentVerbs.forEach((verb) => {
      newFields[verb.id] = getRandomField();
    });
    setInputFields(newFields);
    // Limpiar respuestas y checks solo de la página actual
    // (opcional, si quieres que se reinicie al cambiar de página)
    // setUserAnswers({});
    // setCheckedAnswers({});
    setShowAnswers(false);
  }, [currentPage]);

  const handleInputChange = (
    verbId: number,
    field: "infinitive" | "past" | "participle",
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
      [key: number]: boolean;
    } = {};

    currentVerbs.forEach((verb) => {
      const userAnswer = userAnswers[verb.id];
      const field = inputFields[verb.id];
      if (userAnswer && field) {
        let correct = false;
        if (field === "infinitive") {
          correct = userAnswer.infinitive?.toLowerCase().trim() === verb.infinitive.toLowerCase();
        } else if (field === "past") {
          correct = userAnswer.past?.toLowerCase().trim() === verb.past.toLowerCase();
        } else if (field === "participle") {
          correct = userAnswer.participle?.toLowerCase().trim() === verb.participle.toLowerCase();
        }
        newCheckedAnswers[verb.id] = correct;
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

  const getInputClassName = (verbId: number) => {
    if (!showAnswers) return "";
    const isCorrect = checkedAnswers[verbId];
    return isCorrect
      ? "border-green-500 bg-green-50 dark:bg-green-950"
      : "border-red-500 bg-red-50 dark:bg-red-950";
  };

  const correctAnswers = Object.values(checkedAnswers).reduce((acc, answer) => {
    return acc + (answer ? 1 : 0);
  }, 0);

  const totalAnswers = Object.keys(checkedAnswers).length;

  return (
    <PageLayout>
      <PageHeader
        title="Verbs Participios"
        description="Practica los verbos irregulares y sus participios."
        actions={
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
        }
      />
      <div className="space-y-6">
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
                  {currentVerbs.map((verb) => {
                    const field = inputFields[verb.id];
                    return (
                      <TableRow key={verb.id}>
                        <TableCell className="font-medium">
                          {field === "infinitive" ? (
                            <Input
                              placeholder="..."
                              value={userAnswers[verb.id]?.infinitive || ""}
                              onChange={(e) =>
                                handleInputChange(verb.id, "infinitive", e.target.value)
                              }
                              className={`min-w-[120px] md:min-w-[180px] ${getInputClassName(verb.id)}`}
                              disabled={showAnswers}
                            />
                          ) : (
                            verb.infinitive
                          )}
                          {showAnswers && field === "infinitive" && !checkedAnswers[verb.id] && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Respuesta: {verb.infinitive}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {field === "past" ? (
                            <Input
                              placeholder="..."
                              value={userAnswers[verb.id]?.past || ""}
                              onChange={(e) =>
                                handleInputChange(verb.id, "past", e.target.value)
                              }
                              className={`min-w-[120px] md:min-w-[180px] ${getInputClassName(verb.id)}`}
                              disabled={showAnswers}
                            />
                          ) : (
                            verb.past
                          )}
                          {showAnswers && field === "past" && !checkedAnswers[verb.id] && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Respuesta: {verb.past}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {field === "participle" ? (
                            <Input
                              placeholder="..."
                              value={userAnswers[verb.id]?.participle || ""}
                              onChange={(e) =>
                                handleInputChange(verb.id, "participle", e.target.value)
                              }
                              className={`min-w-[120px] md:min-w-[180px] ${getInputClassName(verb.id)}`}
                              disabled={showAnswers}
                            />
                          ) : (
                            verb.participle
                          )}
                          {showAnswers && field === "participle" && !checkedAnswers[verb.id] && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Respuesta: {verb.participle}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground capitalize font-bold text-base md:text-lg">
                          {verb.meaning}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {(() => {
              const pages = [];
              const pageWindow = 2; // Cuántos a la izquierda/derecha
              let start = Math.max(1, currentPage - pageWindow);
              let end = Math.min(totalPages, currentPage + pageWindow);

              if (start > 1) {
                pages.push(
                  <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(1);
                      setShowAnswers(false);
                    }}
                  >
                    1
                  </Button>
                );
                if (start > 2) {
                  pages.push(
                    <span key="start-ellipsis" className="px-1 text-muted-foreground">...</span>
                  );
                }
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(i);
                      setShowAnswers(false);
                    }}
                  >
                    {i}
                  </Button>
                );
              }

              if (end < totalPages) {
                if (end < totalPages - 1) {
                  pages.push(
                    <span key="end-ellipsis" className="px-1 text-muted-foreground">...</span>
                  );
                }
                pages.push(
                  <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(totalPages);
                      setShowAnswers(false);
                    }}
                  >
                    {totalPages}
                  </Button>
                );
              }
              return pages;
            })()}
          </div>

          <Button
            variant="outline"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
