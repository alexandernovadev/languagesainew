import { useState, useEffect } from "react";
import { statisticsService } from "@/services/statisticsService";
import { toast } from "sonner";

interface DashboardStats {
  overview: {
    totalContent: {
      lectures: number;
      words: number;
    };
    contentQuality: {
      lecturesWithAudio: number;
      lecturesWithImages: number;
      wordsWithExamples: number;
      wordsWithImages: number;
      overallQualityScore: number;
    };
    recentActivity: {
      recentLectures: number;
      recentWords: number;
    };
  };
  byLevel: {
    lectures: {
      A1: number;
      A2: number;
      B1: number;
      B2: number;
      C1: number;
      C2: number;
    };
    words: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  byLanguage: {
    lectures: Record<string, number>;
    words: Record<string, number>;
  };
  quality: {
    lecturesWithoutAudio: number;
    lecturesWithoutImages: number;
    wordsWithoutExamples: number;
    wordsWithoutImages: number;
    lectureQualityScore: number;
    wordQualityScore: number;
  };
  engagement: {
    averageLectureTime: number;
    averageWordSeen: number;
  };
}

interface LectureStats {
  overview: {
    total: number;
    recent: number;
    qualityScore: number;
  };
  distribution: {
    byLevel: {
      A1: number;
      A2: number;
      B1: number;
      B2: number;
      C1: number;
      C2: number;
    };
    byLanguage: Record<string, number>;
  };
  quality: {
    withAudio: number;
    withImages: number;
    withoutAudio: number;
    withoutImages: number;
  };
  metrics: {
    averageTimeByLevel: Record<string, number>;
    averageTimeOverall: number;
  };
}

interface WordStats {
  overview: {
    total: number;
    recent: number;
    qualityScore: number;
  };
  distribution: {
    byLevel: {
      easy: number;
      medium: number;
      hard: number;
    };
    byLanguage: Record<string, number>;
  };
  quality: {
    withExamples: number;
    withImages: number;
    withoutExamples: number;
    withoutImages: number;
  };
  metrics: {
    averageSeenByLevel: Record<string, number>;
    averageSeenOverall: number;
  };
}

export function useStatistics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lectureStats, setLectureStats] = useState<LectureStats | null>(null);
  const [wordStats, setWordStats] = useState<WordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar todos los datos en paralelo
      const [dashboardResponse, lectureResponse, wordResponse] = await Promise.all([
        statisticsService.getDashboardStats(),
        statisticsService.getLectureStats(),
        statisticsService.getWordStats()
      ]);
      
      console.log("Dashboard Response:", dashboardResponse);
      console.log("Lecture Response:", lectureResponse);
      console.log("Word Response:", wordResponse);
      
      setStats(dashboardResponse);
      setLectureStats(lectureResponse);
      setWordStats(wordResponse);
    } catch (err: any) {
      console.error("Error loading statistics:", err);
      
      // Manejar diferentes tipos de errores
      if (err.status === 401) {
        setError("Necesitas iniciar sesión para ver las estadísticas");
        toast.error("Necesitas iniciar sesión para ver las estadísticas");
      } else if (err.isNetworkError) {
        setError("Error de conexión con el servidor");
        toast.error("Error de conexión con el servidor");
      } else {
        setError("Error al cargar las estadísticas");
        toast.error("Error al cargar las estadísticas");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    lectureStats,
    wordStats,
    loading,
    error,
    refetch: loadStats
  };
} 