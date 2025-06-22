import { Home, Settings, BookOpen, BarChart3, FileText, RotateCcw, Gamepad2 } from "lucide-react"

export const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
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
    title: "Estadísticas",
    url: "/statistics",
    icon: BarChart3,
  },
]

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
]

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
] 