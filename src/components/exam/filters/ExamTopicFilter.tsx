import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ExamTopicFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const examTopics = [
  { value: "grammar", label: "Gramática" },
  { value: "vocabulary", label: "Vocabulario" },
  { value: "reading", label: "Comprensión Lectora" },
  { value: "listening", label: "Comprensión Auditiva" },
  { value: "speaking", label: "Expresión Oral" },
  { value: "writing", label: "Expresión Escrita" },
  { value: "pronunciation", label: "Pronunciación" },
  { value: "culture", label: "Cultura" },
];

export function ExamTopicFilter({ value, onChange }: ExamTopicFilterProps) {
  const selectedTopics = value && value !== "all" ? value.split(",") : [];

  const handleTopicClick = (topicValue: string) => {
    if (selectedTopics.includes(topicValue)) {
      // Remover tema
      const newTopics = selectedTopics.filter((t) => t !== topicValue);
      onChange(newTopics.length > 0 ? newTopics.join(",") : "all");
    } else {
      // Agregar tema
      const newTopics = [...selectedTopics, topicValue];
      onChange(newTopics.join(","));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tema</Label>
      <div className="flex flex-wrap gap-2">
        {examTopics.map((topic) => {
          const isSelected = selectedTopics.includes(topic.value);
          return (
            <Badge
              key={topic.value}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleTopicClick(topic.value)}
            >
              {topic.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 