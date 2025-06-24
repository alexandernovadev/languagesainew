import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Settings } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { VerbField, GameConfig } from "./types";
import {
  StatisticsCard,
  VerbsTable,
  Navigation,
  GameConfigModal,
} from "./components";
import { useVerbsGameStore } from "@/lib/store/useVerbsGameStore";

export default function VerbsGamePage() {
  // Zustand store
  const {
    session,
    verbs,
    startGame,
    updateAnswers,
    updateCheckedAnswers,
    updateInputFields,
    setShowAnswers,
    setCurrentPage,
    finishGame,
    resetSession,
    clearSession,
  } = useVerbsGameStore();

  // Show config if no session
  const showConfig = !session;

  // Handlers
  const handleStartGame = (config: GameConfig) => {
    startGame(config);
  };

  const handleResumeGame = () => {};

  const handleNewGame = () => {
    clearSession();
  };

  const handleInputChange = (
    verbId: number,
    field: VerbField,
    value: string
  ) => {
    if (!session) return;
    const newUserAnswers = {
      ...session.userAnswers,
      [verbId]: {
        ...session.userAnswers[verbId],
        [field]: value,
      },
    };
    updateAnswers(newUserAnswers);
  };

  const handleCheckAnswers = () => {
    if (!session) return;
    const pageVerbs = getPageVerbs();
    const newCheckedAnswers = { ...session.checkedAnswers };
    pageVerbs.forEach((verb) => {
      const userAnswer = session.userAnswers[verb.id];
      const field = session.inputFields[verb.id];
      if (userAnswer && field) {
        let correct = false;
        if (field === "infinitive") {
          correct =
            userAnswer.infinitive?.toLowerCase().trim() ===
            verb.infinitive.toLowerCase();
        } else if (field === "past") {
          correct =
            userAnswer.past?.toLowerCase().trim() === verb.past.toLowerCase();
        } else if (field === "participle") {
          correct =
            userAnswer.participle?.toLowerCase().trim() ===
            verb.participle.toLowerCase();
        }
        newCheckedAnswers[verb.id] = correct;
      }
    });
    updateCheckedAnswers(newCheckedAnswers);
    setShowAnswers(true);
  };

  const handleResetPage = () => {
    if (!session) return;
    const pageVerbs = getPageVerbs();
    const currentVerbIds = pageVerbs.map((verb) => verb.id);
    const newUserAnswers = { ...session.userAnswers };
    const newCheckedAnswers = { ...session.checkedAnswers };
    currentVerbIds.forEach((id) => {
      delete newUserAnswers[id];
      delete newCheckedAnswers[id];
    });
    updateAnswers(newUserAnswers);
    updateCheckedAnswers(newCheckedAnswers);
    setShowAnswers(false);
  };

  const handleNextPage = () => {
    if (!session) return;
    const totalPages = Math.ceil(verbs.length / session.config.itemsPerPage);
    if (session.currentPage < totalPages) {
      setCurrentPage(session.currentPage + 1);
      setShowAnswers(false);
    }
  };

  const handlePrevPage = () => {
    if (!session) return;
    if (session.currentPage > 1) {
      setCurrentPage(session.currentPage - 1);
      setShowAnswers(false);
    }
  };

  // Helpers
  const getPageVerbs = () => {
    if (!session) return [];
    const startIndex = (session.currentPage - 1) * session.config.itemsPerPage;
    const endIndex = startIndex + session.config.itemsPerPage;
    return verbs.slice(startIndex, endIndex);
  };

  // Check if all required inputs are filled for the current page
  const allInputsFilled =
    session &&
    getPageVerbs().every((verb) => {
      const field = session.inputFields[verb.id];
      const answer = session.userAnswers[verb.id]?.[field];
      return answer && answer.trim() !== "";
    });

  // Computed values
  const pageVerbs = getPageVerbs();
  const totalPages = session
    ? Math.ceil(verbs.length / session.config.itemsPerPage)
    : 1;
  const correctAnswers = session
    ? Object.values(session.checkedAnswers).reduce(
        (acc, answer) => acc + (answer ? 1 : 0),
        0
      )
    : 0;
  const totalAnswers = session ? Object.keys(session.checkedAnswers).length : 0;

  // Render
  if (showConfig) {
    return (
      <PageLayout>
        <PageHeader
          title="Verbs Participios"
          description="Practica los verbos irregulares y sus participios."
        />
        <GameConfigModal
          onStartGame={handleStartGame}
          onResumeGame={undefined}
          hasActiveSession={false}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Verbs Participios"
        description="Practica los verbos irregulares y sus participios."
        actions={
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleNewGame}>
                <Settings className="h-4 w-4 mr-2" />
                Nueva Partida
              </Button>
              <Button variant="outline" onClick={handleResetPage}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        }
      />
      <div className="space-y-6">
        {/* Statistics/header bar above the table */}
        <div className="max-w-4xl mx-auto flex items-center justify-between px-2 py-2 mb-2">
          <span className="text-sm text-muted-foreground">
            Página {session.currentPage} de {totalPages} de {verbs.length}{" "}
            Verbos
          </span>
          {(() => {
            // Show current page stats if verified, else show total so far
            let correct = 0,
              total = 0,
              percent = 0;
            if (session.showAnswers) {
              total = pageVerbs.length;
              correct = pageVerbs.filter(
                (v) => session.checkedAnswers[v.id]
              ).length;
              percent = total > 0 ? Math.round((correct / total) * 100) : 0;
            } else {
              total = verbs.length;
              correct = Object.values(session.checkedAnswers).filter(
                Boolean
              ).length;
              percent = total > 0 ? Math.round((correct / total) * 100) : 0;
            }
            let color = "text-green-600";
            let icon = "✅";
            if (percent < 100 && percent >= 60) {
              color = "text-yellow-600";
              icon = "⭐";
            } else if (percent < 60) {
              color = "text-red-600";
              icon = "❌";
            }
            return (
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-muted shadow-sm`}
              >
                <span className={`text-xl font-bold ${color}`}>{icon}</span>
                <span className={`font-semibold text-lg ${color}`}>
                  {correct}/{total}
                </span>
                <span className="text-muted-foreground">correctas —</span>
                <span className={`font-bold ${color}`}>{percent}%</span>
              </div>
            );
          })()}
        </div>

        {/* Table and navigation in a centered, max-width container */}
        <div className="max-w-4xl mx-auto">
          <VerbsTable
            verbs={pageVerbs}
            inputFields={session.inputFields}
            userAnswers={session.userAnswers}
            showAnswers={session.showAnswers}
            checkedAnswers={session.checkedAnswers}
            onInputChange={handleInputChange}
          />

          <Navigation
            currentPage={session.currentPage}
            totalPages={totalPages}
            totalVerbs={verbs.length}
            onPrevPage={handlePrevPage}
            onVerify={handleCheckAnswers}
            onNextPage={handleNextPage}
            isVerifying={!session.showAnswers}
            canVerify={!!allInputsFilled}
            isLastPage={session.currentPage === totalPages}
          />
        </div>
      </div>
    </PageLayout>
  );
}
