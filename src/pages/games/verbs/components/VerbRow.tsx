import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { Verb, VerbField } from "../types";
import { WordDetailsModal } from "@/components/word-details";
import { useWordStore } from "@/lib/store/useWordStore";
import { useState } from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";

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
  const { getWordByName, generateWord, activeWord, setActiveWord } =
    useWordStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  const openWordModal = async (word: string) => {
    setIsModalOpen(true);
    setIsSearching(true);
    setCurrentWord(word);

    try {
      await getWordByName(word);
      // Si no hay error, la palabra existe y activeWord se actualiza automáticamente
    } catch (error) {
      // La palabra no existe - error 404
      // Limpiar activeWord para que no muestre una palabra anterior
      setActiveWord(null);
    } finally {
      setIsSearching(false);
    }
  };

  const closeWordModal = () => {
    setIsModalOpen(false);
    setIsSearching(false);
    setCurrentWord("");
    setIsGenerating(false);
    // Limpiar activeWord al cerrar
    setActiveWord(null);
  };

  const handleGenerateWord = async () => {
    if (!currentWord) return;

    setIsGenerating(true);
    try {
      console.log("Generando palabra:", currentWord);
      const generatedWord = await generateWord(currentWord);
      console.log("Palabra generada exitosamente:", generatedWord);

      // Pequeño delay para asegurar que el backend termine de procesar
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Palabra generada", {
        description: `La palabra "${currentWord}" ha sido generada exitosamente`,
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { word: generatedWord }, message: `La palabra "${currentWord}" ha sido generada exitosamente` }, "Generar Palabra")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });

      // activeWord se actualiza automáticamente en el store
    } catch (error: any) {
      handleApiResult(error, "Generar Palabra");
    } finally {
      setIsGenerating(false);
    }
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
            className={`min-w-[90px] md:min-w-[120px] px-2 py-1 text-base h-7 ${getInputClassName()}`}
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
        <ModalNova
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Palabra no encontrada"
          size="md"
          height="h-auto"
        >
          <div className="text-center py-4 px-6">
            <p className="text-sm text-muted-foreground mb-4">
              La palabra "{currentWord}" no existe en la base de datos.
            </p>
            <Button
              onClick={handleGenerateWord}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando palabra...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generar palabra
                </>
              )}
            </Button>
          </div>
        </ModalNova>
      )}

      {/* Loading state */}
      {isModalOpen && isSearching && (
        <ModalNova
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Buscando palabra..."
          size="md"
          height="h-auto"
        >
          <div className="flex items-center justify-center py-8 px-6">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Buscando palabra...</span>
          </div>
        </ModalNova>
      )}
    </>
  );
}
