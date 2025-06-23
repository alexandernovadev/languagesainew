export interface LectureLevel {
  value: string;
  label: string;
}

export const lectureLevels: LectureLevel[] = [
  { value: "A1", label: "A1 - Principiante" },
  { value: "A2", label: "A2 - Elemental" },
  { value: "B1", label: "B1 - Intermedio" },
  { value: "B2", label: "B2 - Intermedio Alto" },
  { value: "C1", label: "C1 - Avanzado" },
  { value: "C2", label: "C2 - Maestría" },
];
