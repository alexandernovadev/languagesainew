import { getAllExamLevels } from "@/utils/common/examTypes";

export interface LectureLevel {
  value: string;
  label: string;
}

// Re-exportar las utilidades para mantener compatibilidad
export const lectureLevels: LectureLevel[] = getAllExamLevels();
