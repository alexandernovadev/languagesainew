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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
    // If last page, finish game
    if (session.currentPage === totalPages) {
      finishGame();
    }
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
          actions={
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowHistoryModal(true)}>
                  Historial
                </Button>
              </div>
            </div>
          }
        />
        <GameConfigModal
          onStartGame={handleStartGame}
          onResumeGame={undefined}
          hasActiveSession={false}
        />

        {/* History Modal */}
        <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Historial de Partidas</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length === 0 && <div className="text-muted-foreground">No hay partidas guardadas.</div>}
              {history.map((item, idx) => (
                <div
                  key={item.id + item.finishedAt}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                  onClick={() => selectHistory(item)}
                >
                  <div>
                    <div className="font-semibold text-sm">{new Date(item.finishedAt).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Dificultad: {item.config.difficulty}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">{item.score ?? 0}%</span>
                    <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); selectHistory(item); }}>
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={clearHistory}>Borrar Historial</Button>
              <Button onClick={() => setShowHistoryModal(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Details Modal */}
        <Dialog open={!!selectedHistory} onOpenChange={() => selectHistory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalle de Partida</DialogTitle>
            </DialogHeader>
            {selectedHistory && (
              <div className="space-y-2">
                <div><b>Fecha:</b> {new Date(selectedHistory.finishedAt).toLocaleString()}</div>
                <div><b>Dificultad:</b> {selectedHistory.config.difficulty}</div>
                <div><b>Verbos:</b> {selectedHistory.config.totalVerbs}</div>
                <div><b>Correctas:</b> {Object.values(selectedHistory.checkedAnswers).filter(Boolean).length} / {selectedHistory.config.totalVerbs}</div>
                <div><b>Porcentaje:</b> {selectedHistory.score ?? 0}%</div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => selectHistory(null)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            // Only show stats if at least one answer has been checked
            const checkedCount = Object.keys(session.checkedAnswers).length;
            if (checkedCount === 0) return null;
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
            onShowStats={() => setShowStatsModal(true)}
          />
        </div>
      </div>

      {/* Statistics Modal */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estadísticas de la Partida</DialogTitle>
          </DialogHeader>
          {session && (
            <div className="space-y-2">
              <div><b>Fecha:</b> {new Date().toLocaleString()}</div>
              <div><b>Dificultad:</b> {session.config.difficulty}</div>
              <div><b>Verbos:</b> {verbs.length}</div>
              <div><b>Correctas:</b> {Object.values(session.checkedAnswers).filter(Boolean).length} / {verbs.length}</div>
              <div><b>Porcentaje:</b> {Math.round((Object.values(session.checkedAnswers).filter(Boolean).length / verbs.length) * 100)}%</div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { setShowStatsModal(false); resetSession(); }}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
