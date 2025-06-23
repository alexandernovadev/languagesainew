import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientLayout from "./app/ClientLayout";
import DashboardPage from "./app/DashboardPage";
// Importa todas las páginas principales
import LecturesPage from "./app/lectures/LecturesPage";
import LectureDetailPage from "./app/lectures/LectureDetailPage";
import AnkiGamePage from "./app/games/anki/AnkiGamePage";
import VerbsGamePage from "./app/games/verbs/VerbsGamePage";
import LectureGeneratorPage from "./app/generator/lecture/LectureGeneratorPage";
import ExamGeneratorPage from "./app/generator/exam/ExamGeneratorPage";
import SettingsPage from "./app/settings/SettingsPage";
import StatisticsPage from "./app/statistics/StatisticsPage";
import MyWordsPage from "./app/my-words/MyWordsPage";
import ProfilePage from "./app/profile/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <ClientLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/lectures" element={<LecturesPage />} />
          <Route path="/lectures/:id" element={<LectureDetailPage />} />
          <Route path="/games/anki" element={<AnkiGamePage />} />
          <Route path="/games/verbs" element={<VerbsGamePage />} />
          <Route path="/generator/lecture" element={<LectureGeneratorPage />} />
          <Route path="/generator/exam" element={<ExamGeneratorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/my-words" element={<MyWordsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </ClientLayout>
    </BrowserRouter>
  );
}
