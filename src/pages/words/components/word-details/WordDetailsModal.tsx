import { ModalNova } from "@/shared/components/ui/modal-nova";
import { IWord } from "@/types/models/Word";
import { WordDetailsCard } from "./WordDetailsCard";
import { LevelButtons } from "@/shared/components/common/LevelButtons";
import { useWordStore } from "../../store/useWordStore";
import { capitalize } from "@/utils/common/string/capitalize";

interface WordDetailsModalProps {
  word: IWord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showLevelButtons?: boolean;
  showRefreshButtons?: boolean;
}

export function WordDetailsModal({
  word,
  open,
  onOpenChange,
  showLevelButtons = true,
  showRefreshButtons = true,
}: WordDetailsModalProps) {
  const { updateWordDifficulty, actionLoading } = useWordStore();

  // Función wrapper para adaptar la interfaz
  const handleUpdateLevel = async (level: "easy" | "medium" | "hard") => {
    if (!(word as any)._id) return;
    try {
      await updateWordDifficulty((word as any)._id, level);
    } catch (error: any) {
      console.error("Error updating level:", error);
    }
  };

  // Crear el footer con los botones de nivel solo si se solicitan
  const footerContent = showLevelButtons ? (
    <div className="w-full">
      <LevelButtons
        onUpdateLevel={handleUpdateLevel}
        loading={actionLoading.updateDifficulty}
        currentLevel={word.difficulty}
        variant="modal"
      />
    </div>
  ) : undefined;

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={`${capitalize(word.word)} | ${capitalize(
        word.spanish?.word || "Sin traducción"
      )}`}
      size="4xl"
      height="h-[calc(100dvh-2rem)]"
      footer={footerContent}
    >
      <div className="p-4 h-full">
        <WordDetailsCard
          word={word}
          variant="modal"
          showLevelButtons={false}
          showRefreshButtons={showRefreshButtons}
        />
      </div>
    </ModalNova>
  );
}
