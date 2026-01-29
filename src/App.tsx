import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import React from "react";
import DashboardLayout from "./shared/components/layouts/DashboardLayout";
import LoadingSpinner from "./shared/components/LoadingSpinner";
import { toast } from "sonner";

// Importar todas las rutas lazy load
import {
  DashboardPage,
  LecturesPage,
  LectureDetailPage,
  AnkiGamePage,
  LectureGeneratorPage,
  SettingsPage,
  ImportSettingsPage,
  ExportSettingsPage,
  SystemInfoPage,
  SettingsIndexRedirect,
  WordsPage,
  ExpressionsPage,
  ProfilePage,
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
    <BrowserRouter>
      <DashboardLayout>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lectures" element={<LecturesPage />} />
            <Route path="/lectures/:id" element={<LectureDetailPage />} />
            <Route path="/games/anki" element={<AnkiGamePage />} />
            <Route
              path="/generator/lecture"
              element={<LectureGeneratorPage />}
            />
            <Route path="/settings" element={<SettingsPage />}>
              <Route index element={<SettingsIndexRedirect />} />
              <Route path="import" element={<ImportSettingsPage />} />
              <Route path="export" element={<ExportSettingsPage />} />
              <Route path="labs" element={<LabsPage />} />
              <Route path="system" element={<SystemInfoPage />} />
            </Route>

            <Route path="/words" element={<WordsPage />} />
            <Route path="/my-words" element={<WordsPage />} />
            <Route path="/expressions" element={<ExpressionsPage />} />
            <Route path="/my-expressions" element={<ExpressionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users" element={<UsersPage />} />

            {/* Catch-all route para rutas desconocidas */}
            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </BrowserRouter>
  );
}
