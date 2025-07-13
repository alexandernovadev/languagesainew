import {
  Home,
  Settings,
  BookOpen,
  BarChart3,
  FileText,
  RotateCcw,
  Gamepad2,
  HelpCircle,
  ClipboardList,
  History,
  Trash2,
} from "lucide-react";

export const menuItems = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Lecturas",
    url: "/lectures",
    icon: BookOpen,
  },
  {
    title: "Mis Palabras",
    url: "/my-words",
    icon: BookOpen,
  },
  {
    title: "Preguntas",
    url: "/questions",
    icon: HelpCircle,
  },
  {
    title: "Exámenes",
    url: "/exams",
    icon: ClipboardList,
  },
  {
    title: "Historial de Exámenes",
    url: "/exam-history",
    icon: History,
  },
  {
    title: "Estadísticas",
    url: "/statistics",
    icon: BarChart3,
  },
];

export const generatorItems = [
  {
    title: "Generador de Exámenes",
    url: "/generator/exam",
    icon: FileText,
  },
  {
    title: "Generador de Lecturas",
    url: "/generator/lecture",
    icon: BookOpen,
  },
];

export const gamesItems = [
  {
    title: "Juego Anki",
    url: "/games/anki",
    icon: RotateCcw,
  },
  {
    title: "Juego de Verbos",
    url: "/games/verbs",
    icon: Gamepad2,
  },
];

export const configSettingsItems = [
  {
    title: "General",
    url: "/settings/general",
    icon: Settings,
  },
  {
    title: "Importar",
    url: "/settings/import",
    icon: FileText,
  },
  {
    title: "Exportar",
    url: "/settings/export",
    icon: RotateCcw,
  },
  {
    title: "Limpiador",
    url: "/settings/cleaner",
    icon: Trash2,
  },
  {
    title: "Información del Sistema",
    url: "/settings/system",
    icon: BarChart3,
  },
  {
    title: "Registros",
    url: "/settings/logs",
    icon: FileText,
  },
];
