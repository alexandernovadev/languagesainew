import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Trophy,
  Filter,
  Search,
  RefreshCw,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { useExamAttempts } from '@/hooks/useExamAttempts';
import { ExamAttemptCard } from '@/components/exam/ExamAttemptCard';
import { ExamAttempt, AttemptStats } from '@/services/examAttemptService';
import { formatDateShort } from '@/utils/common/time/formatDate';
import { getAllExamLevels } from '@/utils/common/examTypes';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { PageLayout } from '@/components/layouts/page-layout';

interface ExamHistoryFilters {
  status: string;
  level: string;
  language: string;
  dateRange: string;
  scoreRange: string;
}

export default function ExamHistoryPage() {
  const { getUserAttempts, getAttemptStats, loading, error } = useExamAttempts();
  
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [stats, setStats] = useState<AttemptStats | null>(null);
  const [filters, setFilters] = useState<ExamHistoryFilters>({
    status: 'all',
    level: 'all',
    language: 'all',
    dateRange: 'all',
    scoreRange: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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
      console.error('Error loading exam history:', error);
      toast.error('Error al cargar el historial de exámenes');
      // Set empty array on error
      setAttempts([]);
    }
  };

  // Filter attempts based on current filters
  const filteredAttempts = (Array.isArray(attempts) ? attempts : []).filter(attempt => {
    // Status filter
    if (filters.status && filters.status !== 'all' && attempt.status !== filters.status) return false;
    
    // Level filter
    if (filters.level && filters.level !== 'all' && attempt.exam.level !== filters.level) return false;
    
    // Language filter
    if (filters.language && filters.language !== 'all' && attempt.exam.language !== filters.language) return false;
    
    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const attemptDate = new Date(attempt.startTime);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case 'today':
          if (daysDiff > 0) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
        case 'year':
          if (daysDiff > 365) return false;
          break;
      }
    }
    
    // Score range filter
    if (filters.scoreRange && filters.scoreRange !== 'all' && attempt.score !== undefined && attempt.maxScore !== undefined) {
      const percentage = (attempt.score / attempt.maxScore) * 100;
      
      switch (filters.scoreRange) {
        case 'excellent':
          if (percentage < 90) return false;
          break;
        case 'good':
          if (percentage < 80 || percentage >= 90) return false;
          break;
        case 'average':
          if (percentage < 60 || percentage >= 80) return false;
          break;
        case 'poor':
          if (percentage >= 60) return false;
          break;
      }
    }
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const examTitle = attempt.exam.title.toLowerCase();
      const examTopic = attempt.exam.topic?.toLowerCase() || '';
      
      if (!examTitle.includes(searchLower) && !examTopic.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate additional stats
  const calculateStats = () => {
    if (!Array.isArray(filteredAttempts) || !filteredAttempts.length) return null;

    const gradedAttempts = filteredAttempts.filter(a => a.status === 'graded');
    const totalScore = gradedAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
    const totalMaxScore = gradedAttempts.reduce((sum, a) => sum + (a.maxScore || 0), 0);
    const averageScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    
    const recentAttempts = filteredAttempts.filter(a => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(a.startTime).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });

    const improvement = recentAttempts.length >= 2 ? 
      (recentAttempts[0].score || 0) - (recentAttempts[recentAttempts.length - 1].score || 0) : 0;

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
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      level: 'all',
      language: 'all',
      dateRange: 'all',
      scoreRange: 'all',
    });
    setSearchTerm('');
  };

  const getScoreVariant = (percentage: number) => {
    if (percentage >= 90) return 'default';
    if (percentage >= 80) return 'blue';
    if (percentage >= 60) return 'yellow';
    return 'destructive';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (improvement < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Historial de Exámenes"
        description="Revisa tu progreso y rendimiento en todos los exámenes"
        actions={
          <Button onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        }
      />

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título o tema..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="submitted">Enviado</SelectItem>
                  <SelectItem value="graded">Calificado</SelectItem>
                  <SelectItem value="abandoned">Abandonado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {getAllExamLevels().map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.scoreRange} onValueChange={(value) => handleFilterChange('scoreRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Puntuación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="excellent">Excelente (90%+)</SelectItem>
                  <SelectItem value="good">Bueno (80-89%)</SelectItem>
                  <SelectItem value="average">Promedio (60-79%)</SelectItem>
                  <SelectItem value="poor">Bajo (&lt;60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {Array.isArray(filteredAttempts) ? filteredAttempts.length : 0} de {Array.isArray(attempts) ? attempts.length : 0} intentos mostrados
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="attempts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Intentos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Intentos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStats?.totalAttempts || 0}</div>
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
                  <Badge variant={getScoreVariant(currentStats?.averageScore || 0)}>
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
                <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(currentStats?.completionRate || 0)}%</div>
                <p className="text-xs text-muted-foreground">
                  {currentStats?.gradedAttempts || 0} de {currentStats?.totalAttempts || 0} completados
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
                {Array.isArray(filteredAttempts) ? filteredAttempts.slice(0, 5).map((attempt) => (
                  <div key={attempt._id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      {attempt.status === 'graded' && attempt.score !== undefined && (
                        <Badge variant={getScoreVariant((attempt.score / (attempt.maxScore || 1)) * 100)}>
                          {attempt.score}/{attempt.maxScore}
                        </Badge>
                      )}
                    </div>
                  </div>
                )) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attempts Tab */}
        <TabsContent value="attempts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredAttempts) ? filteredAttempts.map((attempt) => (
              <ExamAttemptCard
                key={attempt._id}
                attempt={attempt}
                onViewDetails={(attemptId) => {
                  // Handle view details
                  console.log('View details:', attemptId);
                }}
                onContinue={(attemptId) => {
                  // Handle continue attempt
                  console.log('Continue attempt:', attemptId);
                }}
                onRetake={(examId) => {
                  // Handle retake exam
                  console.log('Retake exam:', examId);
                }}
              />
            )) : null}
          </div>

          {(!Array.isArray(filteredAttempts) || filteredAttempts.length === 0) && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron intentos</h3>
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
                      <h4 className="font-medium mb-4">Puntuación Promedio por Nivel</h4>
                      <div className="space-y-3">
                        {Object.entries(stats.averageScoreByLevel || {}).map(([level, score]) => (
                          <div key={level} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{level}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={score} className="w-20 h-2" />
                              <span className="text-sm">{Math.round(score)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Intentos por Idioma</h4>
                      <div className="space-y-3">
                        {Object.entries(stats.attemptsByLanguage || {}).map(([language, count]) => (
                          <div key={language} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{language}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
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
                      <p className="text-sm text-muted-foreground">Tiempo promedio por pregunta</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(stats.averageCompletionTime || 0)} min
                      </div>
                      <p className="text-sm text-muted-foreground">Tiempo promedio de completado</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.totalStudyTime || 0} min
                      </div>
                      <p className="text-sm text-muted-foreground">Tiempo total de estudio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
