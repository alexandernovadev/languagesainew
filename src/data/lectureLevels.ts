export interface LectureLevel {
  value: string;
  label: string;
}

export const lectureLevels: LectureLevel[] = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Medio" },
  { value: "hard", label: "Difícil" },
];

// Re-exportar las utilidades para mantener compatibilidad
