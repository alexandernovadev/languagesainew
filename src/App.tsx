import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import LazyRouteErrorBoundary from "./components/LazyRouteErrorBoundary";

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
  ExamResultsPage,
  SettingsPage,
  GeneralSettingsPage,
  ImportSettingsPage,
  ExportSettingsPage,
  SystemInfoPage,
  SettingsIndexRedirect,
  StatisticsPage,
  MyWordsPage,
  QuestionsPage,
  ProfilePage,
  LogsSettingsPage,
} from "./routes";

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
                <Route path="/exams/:examId/take" element={<ExamTakingPage />} />
                <Route path="/exams/:examId/results/:attemptId" element={<ExamResultsPage />} />
                <Route path="/games/anki" element={<AnkiGamePage />} />
                <Route path="/games/verbs" element={<VerbsGamePage />} />
                <Route path="/generator/lecture" element={<LectureGeneratorPage />} />
                <Route path="/generator/exam" element={<ExamGeneratorPage />} />
                <Route path="/settings" element={<SettingsPage />}>
                  <Route index element={<SettingsIndexRedirect />} />
                  <Route path="general" element={<GeneralSettingsPage />} />
                  <Route path="import" element={<ImportSettingsPage />} />
                  <Route path="export" element={<ExportSettingsPage />} />
                  <Route path="system" element={<SystemInfoPage />} />
                  <Route path="logs" element={<LogsSettingsPage />} />
                </Route>
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/my-words" element={<MyWordsPage />} />
                <Route path="/questions" element={<QuestionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Suspense>
          </LazyRouteErrorBoundary>
        </DashboardLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
