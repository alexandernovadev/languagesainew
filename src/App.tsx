import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import React from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import LazyRouteErrorBoundary from "./components/LazyRouteErrorBoundary";
import { toast } from "sonner";

// Importar todas las rutas lazy load
import {
  DashboardPage,
  LecturesPage,
  LectureDetailPage,
  AnkiGamePage,
  VerbsGamePage,
  LectureGeneratorPage,
  ExamGeneratorPage,
  ExamsPage,
  ExamTakingPage,
  ExamHistoryPage,
  SettingsPage,
  GeneralSettingsPage,
  ImportSettingsPage,
  ExportSettingsPage,
  SystemInfoPage,
  SettingsIndexRedirect,

  MyWordsPage,
  QuestionsPage,
  ProfilePage,
  LogsSettingsPage,
  LabsPage,
  UsersPage,
} from "./routes";

// Componente para manejar rutas desconocidas
function NotFoundRedirect() {
  // Mostrar toast cuando se ejecute este componente
  useEffect(() => {
    toast.error("Página no encontrada", {
      description: "Has sido redirigido a la página principal",
    });
  }, []);

  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DashboardLayout>
          <LazyRouteErrorBoundary>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/lectures" element={<LecturesPage />} />
                <Route path="/lectures/:id" element={<LectureDetailPage />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/exams/:examSlug/take" element={<ExamTakingPage />} />
                <Route path="/exam-history" element={<ExamHistoryPage />} />
                <Route path="/games/anki" element={<AnkiGamePage />} />
                <Route path="/games/verbs" element={<VerbsGamePage />} />
                <Route path="/generator/lecture" element={<LectureGeneratorPage />} />
                <Route path="/generator/exam" element={<ExamGeneratorPage />} />
                <Route path="/settings" element={<SettingsPage />}>
                  <Route index element={<SettingsIndexRedirect />} />
                  <Route path="general" element={<GeneralSettingsPage />} />
                  <Route path="import" element={<ImportSettingsPage />} />
                  <Route path="export" element={<ExportSettingsPage />} />
                  <Route path="labs" element={<LabsPage />} />
                  <Route path="system" element={<SystemInfoPage />} />
                  <Route path="logs" element={<LogsSettingsPage />} />
                </Route>


                <Route path="/my-words" element={<MyWordsPage />} />
                <Route path="/questions" element={<QuestionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                
                {/* Catch-all route para rutas desconocidas */}
                <Route path="*" element={<NotFoundRedirect />} />
              </Routes>
            </Suspense>
          </LazyRouteErrorBoundary>
        </DashboardLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
