import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './app/ClientLayout';
import Dashboard from './app/page';
// Importa todas las páginas principales
import Lectures from './app/lectures/page';
import LectureDetail from './app/lectures/[id]/page';
import GamesAnki from './app/games/anki/page';
import GamesVerbs from './app/games/verbs/page';
import GeneratorLecture from './app/generator/lecture/page';
import GeneratorExam from './app/generator/exam/page';
import Settings from './app/settings/page';
import Statistics from './app/statistics/page';
import MyWords from './app/my-words/page';

export default function App() {
  return (
    <BrowserRouter>
      <ClientLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lectures/:id" element={<LectureDetail />} />
          <Route path="/games/anki" element={<GamesAnki />} />
          <Route path="/games/verbs" element={<GamesVerbs />} />
          <Route path="/generator/lecture" element={<GeneratorLecture />} />
          <Route path="/generator/exam" element={<GeneratorExam />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/my-words" element={<MyWords />} />
        </Routes>
      </ClientLayout>
    </BrowserRouter>
  );
} 