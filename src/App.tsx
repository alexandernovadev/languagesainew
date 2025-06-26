import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
// Importa todas las páginas principales
import LecturesPage from "./pages/lectures/LecturesPage";
import LectureDetailPage from "./pages/lectures/LectureDetailPage";
import AnkiGamePage from "./pages/games/anki/AnkiGamePage";
import VerbsGamePage from "./pages/games/verbs/VerbsGamePage";
import LectureGeneratorPage from "./pages/generator/lecture/LectureGeneratorPage";
import ExamGeneratorPage from "./pages/generator/exam/ExamGeneratorPage";
import ExamsPage from "./pages/ExamsPage";
import ExamTakingPage from "./pages/exams/ExamTakingPage";
import ExamResultsPage from "./pages/exams/ExamResultsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import GeneralSettingsPage from "./pages/settings/GeneralSettingsPage";
import ImportSettingsPage from "./pages/settings/ImportSettingsPage";
import ExportSettingsPage from "./pages/settings/ExportSettingsPage";
import SystemInfoPage from "./pages/settings/SystemInfoPage";
import SettingsIndexRedirect from "./pages/settings/index";
import StatisticsPage from "./pages/statistics/StatisticsPage";
import MyWordsPage from "./pages/my-words/MyWordsPage";
import QuestionsPage from "./pages/questions/QuestionsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import LogsSettingsPage from "./pages/settings/LogsSettingsPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DashboardLayout>
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
        </DashboardLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
