import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ViewExamResultsButton from "./ViewExamResultsButton";

// Ejemplo de uso de los componentes de resultados de examen
export function ExamResultsExample() {
  // Ejemplo de datos de respuesta del backend (como los que mostraste)
  const exampleExamAttempt = {
    _id: "685f66810d184da40fc42706",
    user: {
      _id: "6801f2322d3715f7630392c3",
      username: "novask88",
      email: "admin@example.com",
      firstName: "System",
      lastName: "Administrator",
    },
    exam: {
      _id: "685f64010d184da40fc42403",
      title: "Examen: proposiciones en inglés con la temática de Roma antigua",
      description: "Examen sobre proposiciones en inglés con la temática de Roma antigua",
      language: "es",
      level: "B2",
      topic: "proposiciones en inglés con la temática de Roma antigua",
      timeLimit: 60,
      attemptsAllowed: 3,
      source: "ai",
      version: 1,
      createdAt: "2025-06-28T03:39:45.712Z",
    },
    attemptNumber: 2,
    startedAt: "2025-06-28T03:50:25.894Z",
    status: "submitted",
    answers: [
      {
        question: {
          _id: "685f64010d184da40fc423c9",
          text: "In Ancient Rome, many structures were built using concrete, which ______ invented by the Romans.",
          type: "fill_blank" as const,
          isSingleAnswer: true,
          level: "B2",
          topic: "proposiciones en inglés con la temática de Roma antigua",
          difficulty: 5,
          options: [
            {
              value: "A",
              label: "was",
              isCorrect: true,
              _id: "685f64010d184da40fc423ca"
            },
            {
              value: "B",
              label: "were",
              isCorrect: false,
              _id: "685f64010d184da40fc423cb"
            }
          ],
          correctAnswers: ["A"],
          explanation: "La respuesta correcta es <span style='color: #ff6b6b; font-weight: bold;'>was</span> porque se usa <span style='color: #74b9ff; border: 1px solid #74b9ff; padding: 2px 4px; border-radius: 3px;'>voz pasiva</span> en singular <span style='color: #00b894; text-decoration: underline;'>para referirse a algo inventado</span>.",
          tags: ["grammar", "vocabulary"],
          createdAt: "2025-06-28T03:39:45.640Z",
          updatedAt: "2025-06-28T03:39:45.640Z",
        },
        answer: "A",
        isCorrect: true,
        score: 100,
        feedback: "¡Correcto!",
        submittedAt: "2025-06-28T03:50:34.737Z",
        _id: "685f668a0d184da40fc4270c"
      },
      {
        question: {
          _id: "685f64010d184da40fc423cd",
          text: "Choose the correct sentence: If the Romans hadn't built roads, ______ .",
          type: "multiple_choice" as const,
          isSingleAnswer: true,
          level: "B2",
          topic: "proposiciones en inglés con la temática de Roma antigua",
          difficulty: 5,
          options: [
            {
              value: "A",
              label: "trade would have been more difficult.",
              isCorrect: true,
              _id: "685f64010d184da40fc423ce"
            },
            {
              value: "B",
              label: "trade would be more difficult.",
              isCorrect: false,
              _id: "685f64010d184da40fc423cf"
            }
          ],
          correctAnswers: ["A"],
          explanation: "La opción <span style='color: #ff6b6b; font-weight: bold;'>A</span> es correcta porque sigue la estructura del <span style='color: #74b9ff; border: 1px solid #74b9ff; padding: 2px 4px; border-radius: 3px;'>tercer condicional</span> <span style='color: #00b894; text-decoration: underline;'>para situaciones hipotéticas pasadas</span>.",
          tags: ["grammar", "conditional"],
          createdAt: "2025-06-28T03:39:45.667Z",
          updatedAt: "2025-06-28T03:39:45.667Z",
        },
        answer: "B",
        isCorrect: false,
        score: 0,
        feedback: "Respuesta correcta: trade would have been more difficult.",
        submittedAt: "2025-06-28T03:53:10.082Z",
        _id: "685f67260d184da40fc42713"
      }
    ],
    duration: 605,
    passed: false,
    submittedAt: "2025-06-28T04:00:30.948Z"
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Ejemplo de Resultados de Examen</h1>
      
      {/* Ejemplo 1: Botón simple */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo 1: Botón Simple</CardTitle>
        </CardHeader>
        <CardContent>
          <ViewExamResultsButton examAttempt={exampleExamAttempt} />
        </CardContent>
      </Card>

      {/* Ejemplo 2: Botón con texto personalizado */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo 2: Botón Personalizado</CardTitle>
        </CardHeader>
        <CardContent>
          <ViewExamResultsButton 
            examAttempt={exampleExamAttempt}
            variant="default"
            size="default"
            showIcon={false}
          >
            Revisar Examen Completo
          </ViewExamResultsButton>
        </CardContent>
      </Card>

      {/* Ejemplo 3: En una tabla o lista */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo 3: En una Lista de Intentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{exampleExamAttempt.exam.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Intento #{exampleExamAttempt.attemptNumber} • 
                  {new Date(exampleExamAttempt.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={exampleExamAttempt.passed ? "default" : "destructive"}>
                  {exampleExamAttempt.passed ? "Aprobado" : "No Aprobado"}
                </Badge>
                <ViewExamResultsButton 
                  examAttempt={exampleExamAttempt}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplo 4: Botón con diferentes variantes */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo 4: Diferentes Variantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <ViewExamResultsButton 
              examAttempt={exampleExamAttempt}
              variant="default"
              size="sm"
            />
            <ViewExamResultsButton 
              examAttempt={exampleExamAttempt}
              variant="outline"
              size="sm"
            />
            <ViewExamResultsButton 
              examAttempt={exampleExamAttempt}
              variant="secondary"
              size="sm"
            />
            <ViewExamResultsButton 
              examAttempt={exampleExamAttempt}
              variant="ghost"
              size="sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 