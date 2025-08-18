import {
  Home,
  Settings,
  BookOpen,
  RotateCcw,
  Gamepad2,
  HelpCircle,
  ClipboardList,
  History,
  Users,
  BookMarked,
  FileDown,
  FileUp,
  FileSpreadsheet,
  Info,
  Brain,
  BookOpenCheck,
  Quote,
  Languages,
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
    icon: BookMarked,
  },
  {
    title: "Mis Expresiones",
    url: "/my-expressions",
    icon: Quote,
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
];

export const generatorItems = [
  {
    title: "Generador de Exámenes",
    url: "/generator/exam",
    icon: Brain,
  },
  {
    title: "Generador de Lecturas",
    url: "/generator/lecture",
    icon: BookOpenCheck,
  },
  {
    title: "Traductor",
    url: "/tools/translator",
    icon: Languages,
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
    title: "Usuarios",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "General",
    url: "/settings/general",
    icon: Settings,
  },
  {
    title: "Importar",
    url: "/settings/import",
    icon: FileUp,
  },
  {
    title: "Exportar",
    url: "/settings/export",
    icon: FileDown,
  },
  {
    title: "Labs",
    url: "/settings/labs",
    icon: Settings,
  },
  {
    title: "Registros",
    url: "/settings/logs",
    icon: FileSpreadsheet,
  },
  {
    title: "Información del Sistema",
    url: "/settings/system",
    icon: Info,
  },
];
