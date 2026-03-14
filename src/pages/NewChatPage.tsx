import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { chatService } from "@/services/chatService";
import { wordService } from "@/services/wordService";
import { useUserStore } from "@/lib/store/user-store";
import type { WordSelectionType } from "@/types/models/Chat";
import { ArrowLeft, Clock, Flame, Target, Zap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

const MIN_WORDS_FOR_CHAT = 10;

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
  const { user } = useUserStore();
  const [selected, setSelected] = useState<WordSelectionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState<boolean | null>(null);

  const language = user?.language || "en";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await wordService.getWords(1, 1, { language });
        const total = res?.data?.total ?? 0;
        if (!cancelled) setCanCreate(total >= MIN_WORDS_FOR_CHAT);
      } catch {
        if (!cancelled) setCanCreate(false);
      }
    })();
    return () => { cancelled = true; };
  }, [language]);

  const handleCreate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const language = user?.language || "en";
      const chat = await chatService.create(selected, language);
      navigate(`/chats/${chat._id}`);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Error al crear chat";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (canCreate === null) {
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
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (canCreate === false) {
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
        <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-6 text-center">
          <p className="text-amber-700 dark:text-amber-400 font-medium">
            Debes agregar más de 10 palabras al diccionario
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            No hay suficientes palabras en tu idioma ({language}) para crear un chat.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => navigate("/words")}
          >
            Ir al diccionario
          </Button>
        </div>
      </div>
    );
  }

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
