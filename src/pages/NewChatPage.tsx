import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { chatService } from "@/services/chatService";
import type { WordSelectionType } from "@/types/models/Chat";
import { ArrowLeft, Clock, Flame, Target, Zap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

const OPTIONS: { type: WordSelectionType; label: string; desc: string; icon: typeof Clock }[] = [
  {
    type: "last10",
    label: "Últimas 10 actualizadas",
    desc: "Las palabras que has visto más recientemente",
    icon: Clock,
  },
  {
    type: "hard10",
    label: "10 difíciles",
    desc: "Palabras que te cuestan más",
    icon: Flame,
  },
  {
    type: "medium10",
    label: "10 medias",
    desc: "Nivel intermedio",
    icon: Target,
  },
  {
    type: "easy10",
    label: "10 fáciles",
    desc: "Para reforzar lo que ya dominas",
    icon: Zap,
  },
];

export default function NewChatPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<WordSelectionType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const chat = await chatService.create(selected, "en");
      navigate(`/chats/${chat._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Error al crear chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-2xl mx-auto">
      <PageHeader
        title="Nuevo chat"
        description="Elige qué palabras practicar"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/chats")}
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        }
      />

      <div className="grid gap-3 sm:gap-4">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => setSelected(opt.type)}
              className={`
                flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 text-left
                transition-all w-full touch-manipulation
                ${isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
                }
              `}
            >
              <div
                className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  ${isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}
                `}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base">{opt.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
              </div>
              <div
                className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2
                  ${isSelected ? "border-primary bg-primary" : "border-muted-foreground"}
                `}
              />
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={() => navigate("/chats")}
        >
          Cancelar
        </Button>
        <Button
          className="flex-1 rounded-xl"
          onClick={handleCreate}
          disabled={!selected || loading}
        >
          {loading ? "Creando…" : "Crear chat"}
        </Button>
      </div>
    </div>
  );
}
