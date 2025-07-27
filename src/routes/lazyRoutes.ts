import { lazy } from "react";

// Lazy load de todas las páginas
export const DashboardPage = lazy(() => import("../pages/DashboardPage"));
export const LecturesPage = lazy(() => import("../pages/lectures/LecturesPage"));
export const LectureDetailPage = lazy(() => import("../pages/lectures/LectureDetailPage"));
export const AnkiGamePage = lazy(() => import("../pages/games/anki/AnkiGamePage"));
export const VerbsGamePage = lazy(() => import("../pages/games/verbs/VerbsGamePage"));
export const LectureGeneratorPage = lazy(() => import("../pages/generator/lecture/LectureGeneratorPage"));
export const ExamGeneratorPage = lazy(() => import("../pages/generator/exam/ExamGeneratorPage"));
export const ExamsPage = lazy(() => import("../pages/ExamsPage"));
export const ExamTakingPage = lazy(() => import("../pages/exams/ExamTakingPage"));
export const ExamHistoryPage = lazy(() => import("../pages/exams/ExamHistoryPage"));
export const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
export const GeneralSettingsPage = lazy(() => import("../pages/settings/GeneralSettingsPage"));
export const ImportSettingsPage = lazy(() => import("../pages/settings/ImportSettingsPage"));
export const ExportSettingsPage = lazy(() => import("../pages/settings/ExportSettingsPage"));
export const SystemInfoPage = lazy(() => import("../pages/settings/SystemInfoPage"));
export const SettingsIndexRedirect = lazy(() => import("../pages/settings/index"));

export const MyWordsPage = lazy(() => import("../pages/my-words/MyWordsPage"));
export const MyExpressionsPage = lazy(() => import("../pages/my-expressions/MyExpressionsPage"));
export const QuestionsPage = lazy(() => import("../pages/questions/QuestionsPage"));
export const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
export const LogsSettingsPage = lazy(() => import("../pages/settings/LogsSettingsPage"));
export const LabsPage = lazy(() => import("../pages/settings/LabsPage"));
export const UsersPage = lazy(() => import("../pages/admin/UsersPage")); 