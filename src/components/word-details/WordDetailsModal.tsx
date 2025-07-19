import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Word } from "@/models/Word";
import { WordDetailsCard } from "./WordDetailsCard";

interface WordDetailsModalProps {
  word: Word;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showLevelButtons?: boolean;
  showRefreshButtons?: boolean;
  loading?: boolean;
}

export function WordDetailsModal({
  word,
  open,
  onOpenChange,
  showLevelButtons = true,
  showRefreshButtons = true,
  loading = false,
}: WordDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl h-[90vh] flex flex-col bg-zinc-950 border-zinc-800 p-0">
        <DialogHeader className="flex items-center justify-between p-4 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl">📖</span>
            <DialogTitle className="text-sm font-medium text-zinc-300">
              Detalles de la palabra
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-4">
            <WordDetailsCard
              word={word}
              variant="modal"
              showLevelButtons={showLevelButtons}
              showRefreshButtons={showRefreshButtons}
              loading={loading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 