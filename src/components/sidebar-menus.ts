import {
  Home,
  Settings,
  BookOpen,
  BarChart3,
  FileText,
  RotateCcw,
  Gamepad2,
  HelpCircle,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Lectures",
    url: "/lectures",
    icon: BookOpen,
  },
  {
    title: "My Words",
    url: "/my-words",
    icon: BookOpen,
  },
  {
    title: "Questions",
    url: "/questions",
    icon: HelpCircle,
  },
  {
    title: "Estadísticas",
    url: "/statistics",
    icon: BarChart3,
  },
];

export const generatorItems = [
  {
    title: "Exam Generator",
    url: "/generator/exam",
    icon: FileText,
  },
  {
    title: "Lecture Generator",
    url: "/generator/lecture",
    icon: BookOpen,
  },
];

export const gamesItems = [
  {
    title: "Anki Game",
    url: "/games/anki",
    icon: RotateCcw,
  },
  {
    title: "Verbs Participios",
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
    title: "Información del Sistema",
    url: "/settings/system",
    icon: BarChart3,
  },
  {
    title: "Logs",
    url: "/settings/logs",
    icon: FileText,
  },
];
