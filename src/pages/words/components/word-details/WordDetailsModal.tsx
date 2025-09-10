import { ModalNova } from "@/components/ui/modal-nova";
import { Word } from "@/models/Word";
import { WordDetailsCard } from "./WordDetailsCard";
import { LevelButtons } from "@/components/common/LevelButtons";
import { useWordStore } from "@/lib/store/useWordStore";
import { capitalize } from "@/utils/common/string/capitalize";

interface WordDetailsModalProps {
  word: Word;
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
  const { updateWordLevel, actionLoading } = useWordStore();

  // Función wrapper para adaptar la interfaz
  const handleUpdateLevel = async (level: "easy" | "medium" | "hard") => {
    if (!word._id) return;
    try {
      await updateWordLevel(word._id, level);
    } catch (error: any) {
      console.error("Error updating level:", error);
    }
  };

  // Crear el footer con los botones de nivel solo si se solicitan
  const footerContent = showLevelButtons ? (
    <div className="w-full">
      <LevelButtons
        onUpdateLevel={handleUpdateLevel}
        loading={actionLoading.updateLevel}
        currentLevel={word.level}
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
