import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Target,
  Trophy,
  SlidersHorizontal,
  Search,
  RefreshCw,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { useExamAttempts } from "@/hooks/useExamAttempts";
import { ExamAttemptCard } from "@/components/exam/ExamAttemptCard";
import { ExamAttempt, AttemptStats } from "@/services/examAttemptService";
import { formatDateShort } from "@/utils/common/time/formatDate";
import { getAllExamLevels } from "@/utils/common/examTypes";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import ExamHistoryFiltersModal from "@/components/exam/ExamHistoryFiltersModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExamHistoryFilters {
  status: string;
  level: string;
  language: string;
  dateRange: string;
  scoreRange: string;
}

export default function ExamHistoryPage() {
  const { getUserAttempts, getAttemptStats, loading, error } =
    useExamAttempts();

  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [stats, setStats] = useState<AttemptStats | null>(null);
  const [filters, setFilters] = useState<ExamHistoryFilters>({
    status: "all",
    level: "all",
    language: "all",
    dateRange: "all",
    scoreRange: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // ----- Active filters info -----
  const hasActiveFilters =
    Object.values(filters).some((v) => v && v !== "all") || !!searchTerm;

  // Contar filtros activos (considerar multiples valores separados por coma)
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        if (typeof value === "string" && value.includes(",")) {
          count += value.split(",").length;
        } else {
          count += 1;
        }
      }
    });
    if (searchTerm) count += 1;
    return count;
  }, [filters, searchTerm]);

  const getActiveFiltersDescription = React.useCallback(() => {
    const desc: string[] = [];

    if (filters.status && filters.status !== "all")
      desc.push(`Estado: ${filters.status}`);
    if (filters.level && filters.level !== "all") desc.push(`Nivel: ${filters.level}`);
    if (filters.language && filters.language !== "all") desc.push(`Idioma: ${filters.language}`);
    if (filters.dateRange && filters.dateRange !== "all")
      desc.push(`Fecha: ${filters.dateRange}`);
    if (filters.scoreRange && filters.scoreRange !== "all")
      desc.push(`Puntuación: ${filters.scoreRange}`);
    if (searchTerm) desc.push(`Búsqueda: "${searchTerm}"`);

    return desc;
  }, [filters, searchTerm]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attemptsData, statsData] = await Promise.all([
        getUserAttempts(),
        getAttemptStats(),
      ]);

      // Ensure attemptsData is an array
      setAttempts(Array.isArray(attemptsData) ? attemptsData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading exam history:", error);
      toast.error("Error al cargar el historial de exámenes");
      // Set empty array on error
      setAttempts([]);
    }
  };

  // Filter attempts based on current filters
  const filteredAttempts = (Array.isArray(attempts) ? attempts : []).filter(
    (attempt) => {
      // Status filter (multi-select)
      if (filters.status && filters.status !== "all") {
        const allowed = filters.status.split(",");
        if (!allowed.includes(attempt.status)) return false;
      }

      // Level filter (multi-select)
      if (filters.level && filters.level !== "all") {
        const allowed = filters.level.split(",");
        if (!allowed.includes(attempt.exam.level)) return false;
      }

      // Language filter (multi-select)
      if (filters.language && filters.language !== "all") {
        const allowed = filters.language.split(",");
        if (!allowed.includes(attempt.exam.language)) return false;
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange !== "all") {
        const ranges = filters.dateRange.split(",");

        // At least one range must match
        const matchRange = (range: string): boolean => {
          const attemptDate = new Date(attempt.startTime);
          const now = new Date();
          const daysDiff = Math.floor(
            (now.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          switch (range) {
            case "today":
              return daysDiff === 0;
            case "week":
              return daysDiff <= 7;
            case "month":
              return daysDiff <= 30;
            case "year":
              return daysDiff <= 365;
            default:
              return false;
          }
        };

        if (!ranges.some(matchRange)) return false;
      }
      // Score range filter (multi-select)
      if (
        filters.scoreRange &&
        filters.scoreRange !== "all" &&
        attempt.score !== undefined &&
        attempt.maxScore !== undefined
      ) {
        const ranges = filters.scoreRange.split(",");
        const percentage = (attempt.score / attempt.maxScore) * 100;

        const passRange = (range: string): boolean => {
          switch (range) {
            case "excellent":
              return percentage >= 90;
            case "good":
              return percentage >= 80 && percentage < 90;
            case "average":
              return percentage >= 60 && percentage < 80;
            case "poor":
              return percentage < 60;
            default:
              return false;
          }
        };

        if (!ranges.some(passRange)) return false;
      }

      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const examTitle = attempt.exam.title.toLowerCase();
        const examTopic = attempt.exam.topic?.toLowerCase() || "";

        if (
          !examTitle.includes(searchLower) &&
          !examTopic.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    }
  );

  // Calculate additional stats
  const calculateStats = () => {
    if (!Array.isArray(filteredAttempts) || !filteredAttempts.length)
      return null;

    const gradedAttempts = filteredAttempts.filter(
      (a) => a.status === "graded"
    );
    const totalScore = gradedAttempts.reduce(
      (sum, a) => sum + (a.score || 0),
      0
    );
    const totalMaxScore = gradedAttempts.reduce(
      (sum, a) => sum + (a.maxScore || 0),
      0
    );
    const averageScore =
      totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

    const recentAttempts = filteredAttempts.filter((a) => {
      const daysDiff = Math.floor(
        (new Date().getTime() - new Date(a.startTime).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 7;
    });

    const improvement =
      recentAttempts.length >= 2
        ? (recentAttempts[0].score || 0) -
          (recentAttempts[recentAttempts.length - 1].score || 0)
        : 0;

    return {
      totalAttempts: filteredAttempts.length,
      gradedAttempts: gradedAttempts.length,
      averageScore,
      recentAttempts: recentAttempts.length,
      improvement,
      completionRate: (gradedAttempts.length / filteredAttempts.length) * 100,
    };
  };

  const currentStats = calculateStats();

  const handleFilterChange = (key: keyof ExamHistoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      level: "all",
      language: "all",
      dateRange: "all",
      scoreRange: "all",
    });
    setSearchTerm("");
  };

  const getScoreVariant = (percentage: number) => {
    if (percentage >= 90) return "default";
    if (percentage >= 80) return "blue";
    if (percentage >= 60) return "yellow";
    return "destructive";
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0)
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (improvement < 0)
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Historial de Exámenes"
        description="Revisa tu progreso y rendimiento en todos los exámenes"
        actions={
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFiltersModalOpen(true)}
                    className="h-10 w-10 p-0 relative"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {hasActiveFilters && (
                      <Badge className="absolute -top-1 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-green-600 text-white">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    {hasActiveFilters ? (
                      <div>
                        <div className="font-medium mb-1">
                          {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""} activo{activeFiltersCount !== 1 ? "s" : ""}
                        </div>
                        <div className="space-y-1">
                          {getActiveFiltersDescription().map((d, idx) => (
                            <div key={idx} className="text-muted-foreground">
                              • {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>Filtrar historial</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadData}
                    disabled={loading}
                    className="h-10 w-10 p-0"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualizar historial</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />



      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        {/* Contenedor con scroll horizontal en móvil */}
        <div className="max-sm:overflow-x-auto max-sm:pb-2">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 max-sm:flex max-sm:w-max max-sm:min-w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2 max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
              <BarChart3 className="h-4 w-4" />
              <span className="max-sm:hidden sm:inline">Resumen</span>
              <span className="sm:hidden">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="attempts" className="flex items-center gap-2 max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
              <BookOpen className="h-4 w-4" />
              <span className="max-sm:hidden sm:inline">Intentos</span>
              <span className="sm:hidden">Intentos</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
              <TrendingUp className="h-4 w-4" />
              <span className="max-sm:hidden sm:inline">Análisis</span>
              <span className="sm:hidden">Análisis</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Intentos
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentStats?.totalAttempts || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentStats?.recentAttempts || 0} en la última semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge
                    variant={getScoreVariant(currentStats?.averageScore || 0)}
                  >
                    {Math.round(currentStats?.averageScore || 0)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentStats?.gradedAttempts || 0} exámenes calificados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Finalización
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(currentStats?.completionRate || 0)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentStats?.gradedAttempts || 0} de{" "}
                  {currentStats?.totalAttempts || 0} completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getImprovementIcon(currentStats?.improvement || 0)}
                  <span className="text-2xl font-bold">
                    {Math.abs(currentStats?.improvement || 0)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  puntos de mejora reciente
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(filteredAttempts)
                  ? filteredAttempts.slice(0, 5).map((attempt) => (
                      <div
                        key={attempt._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{attempt.exam.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateShort(attempt.startTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{attempt.exam.level}</Badge>
                          {attempt.status === "graded" &&
                            attempt.score !== undefined && (
                              <Badge
                                variant={getScoreVariant(
                                  (attempt.score / (attempt.maxScore || 1)) *
                                    100
                                )}
                              >
                                {attempt.score}/{attempt.maxScore}
                              </Badge>
                            )}
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attempts Tab */}
        <TabsContent value="attempts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredAttempts)
              ? filteredAttempts.map((attempt) => (
                  <ExamAttemptCard
                    key={attempt._id}
                    attempt={attempt}
                    onViewDetails={(attemptId) => {
                      // Handle view details
                      console.log("View details:", attemptId);
                    }}
                    onContinue={(attemptId) => {
                      // Handle continue attempt
                      console.log("Continue attempt:", attemptId);
                    }}
                    onRetake={(examId) => {
                      // Handle retake exam
                      console.log("Retake exam:", examId);
                    }}
                  />
                ))
              : null}
          </div>

          {(!Array.isArray(filteredAttempts) ||
            filteredAttempts.length === 0) && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No se encontraron intentos
                </h3>
                <p className="text-muted-foreground text-center">
                  No hay intentos que coincidan con los filtros aplicados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {stats && (
            <>
              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendencias de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">
                        Puntuación Promedio por Nivel
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(stats.averageScoreByLevel || {}).map(
                          ([level, score]) => (
                            <div
                              key={level}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium">
                                {level}
                              </span>
                              <div className="flex items-center gap-2">
                                <Progress value={score} className="w-20 h-2" />
                                <span className="text-sm">
                                  {Math.round(score)}%
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Intentos por Idioma</h4>
                      <div className="space-y-3">
                        {Object.entries(stats.attemptsByLanguage || {}).map(
                          ([language, count]) => (
                            <div
                              key={language}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium">
                                {language}
                              </span>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Tiempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(stats.averageTimePerQuestion || 0)} min
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tiempo promedio por pregunta
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(stats.averageCompletionTime || 0)} min
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tiempo promedio de completado
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.totalStudyTime || 0} min
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tiempo total de estudio
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Filters Modal */}
      <ExamHistoryFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        searchTerm={searchTerm}
        onFiltersChange={setFilters}
        onSearchChange={setSearchTerm}
        onApplyFilters={() => {
          // Los filtros se aplican automáticamente
        }}
        onClearFilters={clearFilters}
      />
    </PageLayout>
  );
}
