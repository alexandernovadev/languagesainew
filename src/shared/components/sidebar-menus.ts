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
