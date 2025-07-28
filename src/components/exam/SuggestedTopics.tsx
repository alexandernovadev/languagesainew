import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { EXAM_PROMPTS } from "./constants/examPrompts";

interface SuggestedTopicsProps {
  onTopicSelect: (topic: string) => void;
  selectedTopic: string;
}

export function SuggestedTopics({
  onTopicSelect,
  selectedTopic,
}: SuggestedTopicsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Temas Sugeridos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ideas para el tema principal de tu examen
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(EXAM_PROMPTS).map(([key, category]) => (
          <div key={key} className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.title}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.prompts.map((prompt) => (
                <Badge
                  key={prompt}
                  variant={selectedTopic === prompt ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                  onClick={() => onTopicSelect(prompt)}
                >
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
