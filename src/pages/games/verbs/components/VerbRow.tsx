import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Verb, VerbField } from "../types";
import { WordDetailsModal } from "@/components/word-details";
import { useWordStore } from "@/lib/store/useWordStore";
import { useState } from "react";

interface VerbRowProps {
  verb: Verb;
  field: VerbField;
  userAnswer: string | undefined;
  showAnswers: boolean;
  isCorrect: boolean;
  onInputChange: (verbId: number, field: VerbField, value: string) => void;
}

export function VerbRow({
  verb,
  field,
  userAnswer,
  showAnswers,
  isCorrect,
  onInputChange,
}: VerbRowProps) {
  const { getWordByName, activeWord } = useWordStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>("");

  const openWordModal = async (word: string) => {
    setIsModalOpen(true);
    setIsSearching(true);
    setCurrentWord(word);
    
    try {
      await getWordByName(word);
    } catch (error) {
      // Error manejado por el store
    } finally {
      setIsSearching(false);
    }
  };

  const closeWordModal = () => {
    setIsModalOpen(false);
    setIsSearching(false);
    setCurrentWord("");
  };

  const getInputClassName = () => {
    if (!showAnswers) return "";
    return isCorrect
      ? "border-green-500 bg-green-50 dark:bg-green-950"
      : "border-red-500 bg-red-50 dark:bg-red-950";
  };

  const renderField = (fieldType: VerbField, value: string) => {
    if (field === fieldType) {
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="..."
            value={userAnswer || ""}
            onChange={(e) => onInputChange(verb.id, fieldType, e.target.value)}
            className={`min-w-[90px] md:min-w-[120px] px-2 py-1 text-sm h-7 ${getInputClassName()}`}
            disabled={showAnswers}
          />
          {showAnswers && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openWordModal(value)}
              className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
              title={`Ver detalles de "${value}"`}
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          {showAnswers && !isCorrect && (
            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              Respuesta: {value}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <span>{value}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openWordModal(value)}
          className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
          title={`Ver detalles de "${value}"`}
        >
          <Eye className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <TableRow className="py-0.5 h-8">
        <TableCell className="font-medium py-1 text-sm">
          {renderField("infinitive", verb.infinitive)}
        </TableCell>
        <TableCell className="py-1 text-sm">
          {renderField("past", verb.past)}
        </TableCell>
        <TableCell className="py-1 text-sm">
          {renderField("participle", verb.participle)}
        </TableCell>
        <TableCell className="text-muted-foreground capitalize font-bold text-xs md:text-sm py-1">
          {verb.meaning}
        </TableCell>
      </TableRow>

      {/* Modal para detalles de palabra */}
      {activeWord && (
        <WordDetailsModal
          word={activeWord}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          showLevelButtons={true}
          showRefreshButtons={true}
        />
      )}

      {/* Modal para palabra no encontrada */}
      {isModalOpen && !activeWord && !isSearching && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg p-6 max-w-md">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Palabra no encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                La palabra "{currentWord}" no existe en la base de datos.
              </p>
              <Button onClick={closeWordModal} className="w-full">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isModalOpen && isSearching && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg p-6 max-w-md">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Buscando palabra...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
