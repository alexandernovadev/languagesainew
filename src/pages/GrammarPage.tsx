import { useState } from "react";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
import { PageHeader } from "@/shared/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { grammarTopicsJson } from "@/data/bussiness/en";
import { grammarGuideContent } from "@/data/bussiness/en/grammarGuideContent";
import { BookText, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/utils/common/classnames";

export default function GrammarPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(grammarTopicsJson.map((c) => c.value))
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    grammarTopicsJson[0]?.children?.[0]?.value ?? null
  );

  const toggleCategory = (value: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const entry = selectedTopic ? grammarGuideContent[selectedTopic] : null;
  const selectedLabel =
    selectedTopic &&
    grammarTopicsJson
      .flatMap((c) => c.children)
      .find((t) => t.value === selectedTopic)?.label;
  const parentCategory =
    selectedTopic &&
    grammarTopicsJson.find((c) =>
      c.children.some((t) => t.value === selectedTopic)
    )?.label;

  return (
    <div className="space-y-4 flex flex-col flex-1 min-h-0">
      <PageHeader
        title="Grammar Guide"
        description="Estructura y ejemplos para cada tema de gramática en inglés"
      />

      <div className="flex flex-1 min-h-0 gap-4">
        {/* Sidebar - categorías y temas */}
        <Card className="w-64 shrink-0 flex flex-col overflow-hidden h-[calc(100vh-12rem)] min-h-[280px]">
          <CardHeader className="py-3 shrink-0">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookText className="h-4 w-4" />
              Temas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0 pt-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-0.5">
                {grammarTopicsJson.map((category) => (
                  <div key={category.value}>
                    <button
                      onClick={() => toggleCategory(category.value)}
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
                            onClick={() => setSelectedTopic(topic.value)}
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
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        <Card className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <CardContent className="flex-1 overflow-auto p-6">
            {entry && selectedLabel ? (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{selectedLabel}</h2>
                  {parentCategory && (
                    <p className="text-sm text-muted-foreground">
                      {parentCategory}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Estructura
                  </h3>
                  <div
                    className="rounded-lg border border-border bg-gradient-to-br from-muted/50 to-muted/30 p-5 text-sm [&_code]:font-mono [&_code]:text-xs [&_ul]:mt-2 [&_ul]:space-y-1 [&_li]:leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{
                      __html: entry.structure.startsWith("<")
                        ? entry.structure
                        : entry.structure
                            .split("\n")
                            .map((line) => {
                              const t = line.replace(/^•\s*/, "→ ");
                              return t.trim()
                                ? `<p class="mb-2">${escapeHtml(t)}</p>`
                                : "";
                            })
                            .filter(Boolean)
                            .join(""),
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Ejemplos
                  </h3>
                  <ul className="space-y-2">
                    {entry.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="flex gap-3 pl-4 border-l-2 border-primary/30 py-2"
                      >
                        <span className="text-muted-foreground text-sm shrink-0">
                          {i + 1}.
                        </span>
                        <span className="text-foreground">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <BookText className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">Selecciona un tema en el menú</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
