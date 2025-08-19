import { Button } from "@/components/ui/button";

interface DefaultQuestionsGridProps {
  onQuestionClick: (question: string) => void;
  isLoading: boolean;
}

export function DefaultQuestionsGrid({ onQuestionClick, isLoading }: DefaultQuestionsGridProps) {
  const questionCategories = [
    {
      title: "Uso y Contexto",
      icon: "🎯",
      questions: [
        "¿Es formal o informal?",
        "¿Cuándo se usa normalmente?",
        "¿En qué situaciones es apropiado?",
        "¿Hay contextos donde NO se debe usar?"
      ],
    },
    {
      title: "Significado y Variaciones",
      icon: "📚",
      questions: [
        "¿Tiene  mas significados que el que me diste?",
        "¿Cuáles son las variaciones?",
        "¿Hay sinónimos o antónimos?",
        "¿Cómo cambia el significado según el contexto?"
      ],
    },
    {
      title: "Ejemplos y Práctica",
      icon: "💡",
      questions: [
        "Dame 5 ejemplos de uso",
        "Úsala en una conversación real",
        "¿Cómo la usarías en el trabajo?",
        "¿Y en una conversación casual?"
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-1 md:p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 w-full max-w-6xl">
        {questionCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="text-center min-w-0">
            <div className="mb-2 md:mb-3">
              <div className="text-base md:text-lg lg:text-xl mb-1">{category.icon}</div>
              <h5 className="text-xs font-medium text-muted-foreground mb-2 md:mb-3 truncate">
                {category.title}
              </h5>
            </div>
            <div className="space-y-2">
              {category.questions.map((question, questionIndex) => (
                <Button
                  key={`${categoryIndex}-${questionIndex}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuestionClick(question)}
                  disabled={isLoading}
                  className="w-full h-auto text-xs p-3 text-center leading-relaxed hover:bg-accent min-h-[3rem] md:min-h-[3.5rem] chat-question-button"
                  title={question}
                >
                  <span className="px-1 break-words whitespace-normal">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
