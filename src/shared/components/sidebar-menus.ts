import {
  Home,
  Settings,
  BookOpen,
  RotateCcw,
  Users,
  BookMarked,
  FileDown,
  FileUp,
  FileSpreadsheet,
  Info,
  BookOpenCheck,
  Quote,
  Volume2,
  Sparkles,
  FileCode,
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
    title: "Guía de Pronunciación",
    url: "/pronunciation",
    icon: Volume2,
  },
];

export const generatorItems = [
  {
    title: "Generador de Lecturas",
    url: "/generator/lecture",
    icon: BookOpenCheck,
  },
];

export const gamesItems = [
  {
    title: "Juego Anki",
    url: "/games/anki",
    icon: RotateCcw,
  },
];

export const configSettingsItems = [
  {
    title: "Usuarios",
    url: "/users",
    icon: Users,
  },
  {
    title: "Configuración de AI",
    url: "/settings/ai-config",
    icon: Sparkles,
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
    title: "Información del Sistema",
    url: "/settings/system",
    icon: Info,
  },
];
