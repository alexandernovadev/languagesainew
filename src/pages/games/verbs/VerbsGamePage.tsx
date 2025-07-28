import { Button } from "@/components/ui/button";
import { RotateCcw, Settings } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { VerbField, GameConfig } from "./types";
import {
  VerbsTable,
  Navigation,
  GameConfigModal,
  GameStatsDisplay,
  GameStatsModal,
} from "./components";
import { useVerbsGameStore } from "@/lib/store/useVerbsGameStore";
import { useGameStats } from "./hooks/useGameStats";
import { checkAnswer } from "./utils";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function VerbsGamePage() {
  // Zustand store
  const {
    session,
    verbs,
    startGame,
    updateAnswers,
    updateCheckedAnswers,
    setShowAnswers,
    setCurrentPage,
    finishGame,
    resetSession,
    clearSession,
    saveGameToHistory,
    history,
    selectHistory,
    selectedHistory,
    clearHistory,
  } = useVerbsGameStore();

  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Save to history and show modal when game is completed
  useEffect(() => {
    if (session && session.completed) {
      saveGameToHistory();
      setShowStatsModal(true);
    }
  }, [session?.completed]);

  // Show config if no session
  const showConfig = !session;

  // Helpers
  const getPageVerbs = () => {
    if (!session) return [];
    const startIndex = (session.currentPage - 1) * session.config.itemsPerPage;
    const endIndex = startIndex + session.config.itemsPerPage;
    return verbs.slice(startIndex, endIndex);
  };

  // Get page verbs and stats
  const pageVerbs = getPageVerbs();
  const stats = useGameStats({ session, verbs, pageVerbs });

  // Check if all required inputs are filled for the current page
  const allInputsFilled =
    session &&
    pageVerbs.every((verb) => {
      const field = session.inputFields[verb.id];
      const answer = session.userAnswers[verb.id]?.[field];
      return answer && answer.trim() !== "";
    });

  // Handlers
  const handleStartGame = (config: GameConfig) => {
    startGame(config);
  };

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
    const newCheckedAnswers = { ...session.checkedAnswers };

    pageVerbs.forEach((verb) => {
      const userAnswer = session.userAnswers[verb.id];
      const field = session.inputFields[verb.id];
      if (userAnswer && field) {
        const correct = checkAnswer(userAnswer[field], verb[field], field);
        newCheckedAnswers[verb.id] = correct;
      }
    });

    updateCheckedAnswers(newCheckedAnswers);
    setShowAnswers(true);

    // If last page, finish game
    if (session.currentPage === stats.totalPages) {
      finishGame();
    }
  };

  const handleResetPage = () => {
    if (!session) return;
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
    if (session.currentPage < stats.totalPages) {
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

  const handleCloseStatsModal = () => {
    setShowStatsModal(false);
    resetSession();
  };

  const handleCloseHistoryModal = () => {
    selectHistory(null);
  };

  // Render
  if (showConfig) {
    return (
      <PageLayout>
        <PageHeader
          title="Juego de Verbos"
          description="Practica los verbos irregulares y sus participios."
          actions={
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowHistoryModal(true)}
                >
                  Historial
                </Button>
              </div>
            </div>
          }
        />
        <GameConfigModal onStartGame={handleStartGame} />

        {/* History Modal */}
        <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Historial de Partidas</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length === 0 && (
                <div className="text-muted-foreground">
                  No hay partidas guardadas.
                </div>
              )}
              {history.map((item, idx) => (
                <div
                  key={item.id + item.finishedAt}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                  onClick={() => selectHistory(item)}
                >
                  <div>
                    <div className="font-semibold text-sm">
                      {new Date(item.finishedAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dificultad: {item.config.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">
                      {item.score ?? 0}%
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectHistory(item);
                      }}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={clearHistory}>
                Borrar Historial
              </Button>
              <Button onClick={() => setShowHistoryModal(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reusable Stats Modal for History */}
        <GameStatsModal
          open={!!selectedHistory}
          onOpenChange={() => selectHistory(null)}
          session={null}
          totalVerbs={0}
          onClose={handleCloseHistoryModal}
          isHistory={true}
          historyItem={selectedHistory}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Juego de Verbos"
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
            Página {session.currentPage} de {stats.totalPages} de {verbs.length}{" "}
            Verbos
          </span>
          <GameStatsDisplay pageStats={stats.pageStats} />
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
            onPrevPage={handlePrevPage}
            onVerify={handleCheckAnswers}
            onNextPage={handleNextPage}
            isVerifying={!session.showAnswers}
            canVerify={!!allInputsFilled}
            isLastPage={session.currentPage === stats.totalPages}
            onShowStats={() => setShowStatsModal(true)}
          />
        </div>
      </div>

      {/* Beautiful Statistics Modal */}
      <GameStatsModal
        open={showStatsModal}
        onOpenChange={setShowStatsModal}
        session={session}
        totalVerbs={verbs.length}
        onClose={handleCloseStatsModal}
      />
    </PageLayout>
  );
}
