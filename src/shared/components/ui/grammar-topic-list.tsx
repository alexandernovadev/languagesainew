import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/utils/common/classnames";

interface GrammarTopic {
  value: string;
  label: string;
}

interface GrammarCategory {
  value: string;
  label: string;
  children: GrammarTopic[];
}

interface GrammarTopicListProps {
  categories: GrammarCategory[];
  selectedTopic: string | null;
  expandedCategories: Set<string>;
  onSelectTopic: (value: string) => void;
  onToggleCategory: (value: string) => void;
}

export function GrammarTopicList({
  categories,
  selectedTopic,
  expandedCategories,
  onSelectTopic,
  onToggleCategory,
}: GrammarTopicListProps) {
  return (
    <div className="p-2 space-y-0.5">
      {categories.map((category) => (
        <div key={category.value}>
          <button
            onClick={() => onToggleCategory(category.value)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
          >
            {expandedCategories.has(category.value) ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">{category.label}</span>
          </button>
          {expandedCategories.has(category.value) && (
            <div className="ml-4 pl-2 border-l border-border space-y-0.5">
              {category.children.map((topic) => (
                <button
                  key={topic.value}
                  onClick={() => onSelectTopic(topic.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                    selectedTopic === topic.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
