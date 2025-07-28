import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Check, X, BookOpen, Info } from "lucide-react";
import {
  getCategoryKeys,
  getCategoryInfo,
} from "../constants/grammarTopics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GrammarTopicsSelectorProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  error?: string;
}

export function GrammarTopicsSelector({
  selectedTopics,
  onTopicsChange,
  error,
}: GrammarTopicsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  const categoryKeys = getCategoryKeys();

  // Filter topics based on search term
  const filteredCategories = categoryKeys.filter((categoryKey) => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return false;

    if (!searchTerm) return true;

    return (
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.topics.some((topic) =>
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const handleTopicToggle = (topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];

    onTopicsChange(newTopics);
  };

  const handleSelectRandom = () => {
    // Start shaking animation
    setIsShaking(true);

    const allTopics = categoryKeys.flatMap((categoryKey) => {
      const category = getCategoryInfo(categoryKey);
      return category?.topics || [];
    });

    // Select 4 random topics, replacing any previously selected topics
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random());
    const randomTopics = shuffled.slice(0, 4);

    onTopicsChange(randomTopics);

    // Stop shaking after 0.2 seconds
    setTimeout(() => {
      setIsShaking(false);
    }, 200);
  };

  const handleClearAll = () => {
    onTopicsChange([]);
  };

  const handleSelectCategory = (categoryKey: string) => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return;

    const categoryTopics = category.topics;
    const currentCategoryTopics = selectedTopics.filter((topic) =>
      categoryTopics.includes(topic)
    );

    const newTopics =
      currentCategoryTopics.length === categoryTopics.length
        ? selectedTopics.filter((topic) => !categoryTopics.includes(topic))
        : [
            ...selectedTopics.filter(
              (topic) => !categoryTopics.includes(topic)
            ),
            ...categoryTopics,
          ];

    onTopicsChange(newTopics);
  };

  const isCategorySelected = (categoryKey: string) => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return false;

    const categoryTopics = category.topics;
    const selectedCategoryTopics = selectedTopics.filter((topic) =>
      categoryTopics.includes(topic)
    );

    return selectedCategoryTopics.length === categoryTopics.length;
  };

  const isCategoryPartiallySelected = (categoryKey: string) => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return false;

    const categoryTopics = category.topics;
    const selectedCategoryTopics = selectedTopics.filter((topic) =>
      categoryTopics.includes(topic)
    );

    return (
      selectedCategoryTopics.length > 0 &&
      selectedCategoryTopics.length < categoryTopics.length
    );
  };

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar temas de gramática..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectRandom}
            className={`text-xs transition-all duration-200 ${
              isShaking ? "animate-shake" : ""
            }`}
          >
            <Check className="h-3 w-3 mr-1" />
            Seleccionar 4 Aleatorios
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        </div>

        {/* Selected count */}
        {selectedTopics.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className={`cursor-help transition-all duration-200 ${
                      isShaking ? "animate-shake" : ""
                    }`}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    {selectedTopics.length} tema
                    {selectedTopics.length !== 1 ? "s" : ""} seleccionado
                    {selectedTopics.length !== 1 ? "s" : ""}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">Temas seleccionados:</p>
                    <div className="space-y-1">
                      {selectedTopics.map((topic, index) => (
                        <div key={index} className="text-xs">
                          • {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Error display */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        <Separator />

        {/* Categories */}
        <div className="border rounded-lg">
          <div className="p-4">
              <Accordion
                type="multiple"
                value={expandedCategories}
                onValueChange={setExpandedCategories}
                className="space-y-2"
              >
                {filteredCategories.map((categoryKey) => {
                  const category = getCategoryInfo(categoryKey);
                  if (!category) return null;

                  const categoryTopics = category.topics;
                  const selectedCategoryTopics = selectedTopics.filter(
                    (topic) => categoryTopics.includes(topic)
                  );

                  const isSelected = isCategorySelected(categoryKey);
                  const isPartiallySelected =
                    isCategoryPartiallySelected(categoryKey);

                  return (
                    <AccordionItem
                      key={categoryKey}
                      value={categoryKey}
                      className="border rounded-md bg-background"
                    >
                      <div className="flex items-center px-3 py-2 bg-muted/30 rounded-t-md">
                        <Checkbox
                          checked={isSelected || isPartiallySelected}
                          onCheckedChange={() =>
                            handleSelectCategory(categoryKey)
                          }
                          className="mr-3"
                          data-testid={`category-checkbox-${categoryKey}`}
                          aria-label={`Select all topics in ${category.title}`}
                        />
                        <AccordionTrigger className="flex-1 hover:no-underline py-1">
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-base">{category.icon}</span>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">
                                {category.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {selectedCategoryTopics.length} de{" "}
                                {categoryTopics.length} seleccionados
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-3 pb-3">
                        <div className="space-y-1 mt-2 ml-6">
                          {categoryTopics.map((topic) => (
                            <label
                              key={topic}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={selectedTopics.includes(topic)}
                                onCheckedChange={() => handleTopicToggle(topic)}
                                aria-label={`Select topic: ${topic}`}
                              />
                              <span className="text-sm">{topic}</span>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
