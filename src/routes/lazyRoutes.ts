import { lazy } from "react";

// Lazy load de todas las páginas
export const DashboardPage = lazy(() => import("../pages/DashboardPage"));
export const LecturesPage = lazy(() => import("../pages/lectures/LecturesPage"));
export const LectureDetailPage = lazy(() => import("../pages/lectures/LectureDetailPage"));
export const AnkiGamePage = lazy(() => import("../pages/games/anki/AnkiGamePage"));
export const LectureGeneratorPage = lazy(() => import("../pages/generator/lecture/LectureGeneratorPage"));
export const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
export const ImportSettingsPage = lazy(() => import("../pages/settings/ImportSettingsPage"));
export const ExportSettingsPage = lazy(() => import("../pages/settings/ExportSettingsPage"));
export const SystemInfoPage = lazy(() => import("../pages/settings/SystemInfoPage"));
export const SettingsIndexRedirect = lazy(() => import("../pages/settings/index"));

export const MyWordsPage = lazy(() => import("../pages/my-words/MyWordsPage"));
export const MyExpressionsPage = lazy(() => import("../pages/my-expressions/MyExpressionsPage"));
export const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
export const LabsPage = lazy(() => import("../pages/settings/LabsPage"));
export const UsersPage = lazy(() => import("../pages/admin/UsersPage"));