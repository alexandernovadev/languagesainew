import { useMemo } from "react";
import { Verb, CheckedAnswers } from "../types";

interface UseGameStatsProps {
  session: any;
  verbs: Verb[];
  pageVerbs: Verb[];
}

export function useGameStats({ session, verbs, pageVerbs }: UseGameStatsProps) {
  const stats = useMemo(() => {
    if (!session) {
      return {
        totalPages: 1,
        correctAnswers: 0,
        totalAnswers: 0,
        percentage: 0,
        pageStats: null,
      };
    }

    const totalPages = Math.ceil(verbs.length / session.config.itemsPerPage);
    const totalAnswers = Object.keys(session.checkedAnswers).length;
    const correctAnswers = (Object.values(session.checkedAnswers) as boolean[]).reduce(
      (acc: number, answer: boolean) => acc + (answer ? 1 : 0),
      0
    );
    const percentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Page-specific stats when showing answers
    let pageStats = null;
    if (session.showAnswers) {
      const pageCorrect = pageVerbs.filter((v) => session.checkedAnswers[v.id]).length;
      const pageTotal = pageVerbs.length;
      const pagePercentage = pageTotal > 0 ? Math.round((pageCorrect / pageTotal) * 100) : 0;
      
      pageStats = {
        correct: pageCorrect,
        total: pageTotal,
        percentage: pagePercentage,
        color: pagePercentage === 100 ? "text-green-600" : pagePercentage >= 60 ? "text-yellow-600" : "text-red-600",
        icon: pagePercentage === 100 ? "✅" : pagePercentage >= 60 ? "⭐" : "❌",
      };
    }

    return {
      totalPages,
      correctAnswers,
      totalAnswers,
      percentage,
      pageStats,
    };
  }, [session, verbs, pageVerbs]);

  return stats;
} 