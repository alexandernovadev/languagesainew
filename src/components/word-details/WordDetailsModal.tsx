import { ModalNova } from "@/components/ui/modal-nova";
import { Button } from "@/components/ui/button";
import { Word } from "@/models/Word";
import { WordDetailsCard } from "./WordDetailsCard";
import { cn } from "@/utils/common/classnames";
import { useWordStore } from "@/lib/store/useWordStore";
import { toast } from "sonner";

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

  const handleUpdateLevel = async (level: "easy" | "medium" | "hard") => {
    if (!word._id) return;

    try {
      await updateWordLevel(word._id, level);
      toast.success(`Nivel actualizado a ${level}`);
    } catch (error: any) {
      toast.error(`Error al actualizar nivel: ${error.message}`);
    }
  };

  const levelButtons = showLevelButtons ? (
    <div className="flex justify-center gap-2">
      {(["easy", "medium", "hard"] as const).map((level) => (
        <Button
          key={level}
          onClick={() => handleUpdateLevel(level)}
          disabled={actionLoading.updateLevel}
          variant="outline"
          size="sm"
          className={cn(
            "capitalize px-3 py-1 text-xs",
            level === "easy" &&
              "border-green-600 text-green-400 hover:bg-green-600 hover:text-white",
            level === "medium" &&
              "border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white",
            level === "hard" &&
              "border-red-600 text-red-400 hover:bg-red-600 hover:text-white",
            actionLoading.updateLevel && "opacity-50"
          )}
        >
          {level}
        </Button>
      ))}
    </div>
  ) : undefined;

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      size="2xl"
      height="h-[90dvh]"
      footer={levelButtons}
    >
      <div className="p-4">
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
