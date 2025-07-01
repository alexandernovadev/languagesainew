import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { ExamAttemptCard } from "./ExamAttemptCard";
import { useExamAttempts } from "@/hooks/useExamAttempts";
import { ExamAttempt, AttemptStats } from "@/services/examAttemptService";

interface AttemptHistoryProps {
  examId?: string; // Si se proporciona, filtra por examen específico
  onViewDetails?: (attemptId: string) => void;
  onContinue?: (attemptId: string) => void;
  onRetake?: (examId: string) => void;
}

export const AttemptHistory: React.FC<AttemptHistoryProps> = ({
  examId,
  onViewDetails,
  onContinue,
  onRetake,
}) => {
  const { getUserAttempts, getAttemptStats, loading, error, clearError } =
    useExamAttempts();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [stats, setStats] = useState<AttemptStats | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = async () => {
    clearError();

    try {
      const [attemptsData, statsData] = await Promise.all([
        getUserAttempts(),
        getAttemptStats(examId),
      ]);

      if (attemptsData) {
        setAttempts(attemptsData);
      }

      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading attempt data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [examId]);

  const filteredAttempts = attempts.filter((attempt) => {
    if (examId && attempt.exam !== examId) return false;

    switch (activeTab) {
      case "completed":
        return attempt.status === "graded";
      case "in_progress":
        return attempt.status === "in_progress";
      case "submitted":
        return attempt.status === "submitted";
      case "abandoned":
        return attempt.status === "abandoned";
      default:
        return true;
    }
  });

  const getTabCount = (status: string) => {
    return attempts.filter((attempt) => {
      if (examId && attempt.exam !== examId) return false;
      return attempt.status === status;
    }).length;
  };

  const getTotalCount = () => {
    return attempts.filter((attempt) => {
      if (examId && attempt.exam !== examId) return false;
      return true;
    }).length;
  };

  if (loading && attempts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Cargando historial...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estadísticas de Intentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalAttempts}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completedAttempts}
                </div>
                <div className="text-sm text-gray-600">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.inProgressAttempts}
                </div>
                <div className="text-sm text-gray-600">En progreso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.averageScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Promedio</div>
              </div>
            </div>
            {stats.bestScore > 0 && (
              <div className="mt-4 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Mejor puntuación: {stats.bestScore}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historial de Intentos</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-1">
                Todos
                <Badge variant="secondary" className="ml-1">
                  {getTotalCount()}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Completados
                <Badge variant="secondary" className="ml-1">
                  {getTabCount("graded")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="in_progress"
                className="flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                En progreso
                <Badge variant="secondary" className="ml-1">
                  {getTabCount("in_progress")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="submitted"
                className="flex items-center gap-1"
              >
                Enviados
                <Badge variant="secondary" className="ml-1">
                  {getTabCount("submitted")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="abandoned"
                className="flex items-center gap-1"
              >
                Abandonados
                <Badge variant="secondary" className="ml-1">
                  {getTabCount("abandoned")}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredAttempts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay intentos en esta categoría</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAttempts.map((attempt) => (
                    <ExamAttemptCard
                      key={attempt._id}
                      attempt={attempt}
                      onViewDetails={onViewDetails}
                      onContinue={onContinue}
                      onRetake={onRetake}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
