import { IWord } from "./models/Word";
import { ILecture } from "./models/Lecture";
import { IExpression } from "./models/Expression";

export interface WordStats {
  total: number;
  byDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  byLanguage: Record<string, number>;
  byType: Record<string, number>;
  withImage: number;
  withoutImage: number;
  withExamples: number;
  withoutExamples: number;
  withSynonyms: number;
  withoutSynonyms: number;
  totalViews: number;
}

export interface LectureStats {
  total: number;
  byLevel: Record<string, number>;
  byLanguage: Record<string, number>;
  byType: Record<string, number>;
  withImage: number;
  withoutImage: number;
  withAudio: number;
  withoutAudio: number;
  totalReadingTime: number;
}

export interface ExpressionStats {
  total: number;
  byDifficulty: Record<string, number>;
  byLanguage: Record<string, number>;
  byType: Record<string, number>;
  withImage: number;
  withoutImage: number;
  withContext: number;
  withoutContext: number;
}

export interface UserStats {
  total: number;
  byRole: Record<string, number>;
  active: number;
  inactive: number;
}

export interface RecentActivity {
  words: IWord[];
  lectures: ILecture[];
  expressions: IExpression[];
}

export interface DashboardStats {
  words: WordStats;
  lectures: LectureStats;
  expressions: ExpressionStats;
  users: UserStats;
  recentActivity: RecentActivity;
}
