import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Check, X } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface GrammarTopicItem {
  value: string;
  label: string;
  count: number;
}

interface GrammarTopicGroup {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  totalItems: number;
  items: GrammarTopicItem[];
}

interface GrammarSelectorProps {
  grammarTopicGroups: GrammarTopicGroup[];
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
}

export const GrammarSelector: React.FC<GrammarSelectorProps> = ({
  grammarTopicGroups,
  selectedTopics,
  onTopicsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = grammarTopicGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(group => group.items.length > 0);

  const handleSelectAllInGroup = (groupValue: string) => {
    const group = grammarTopicGroups.find(g => g.value === groupValue);
    if (!group) return;

    const allGroupItemValues = group.items.map(item => item.value);
    const newSelectedTopics = [...selectedTopics];

    const allSelectedInGroup = allGroupItemValues.every(itemValue =>
      selectedTopics.includes(itemValue)
    );

    if (allSelectedInGroup) {
      // Deselect all in group
      onTopicsChange(newSelectedTopics.filter(topic => !allGroupItemValues.includes(topic)));
    } else {
      // Select all in group (add only new ones)
      const topicsToAdd = allGroupItemValues.filter(itemValue => !selectedTopics.includes(itemValue));
      onTopicsChange([...newSelectedTopics, ...topicsToAdd]);
    }
  };

  const handleToggleTopic = (topicValue: string) => {
    if (selectedTopics.includes(topicValue)) {
      onTopicsChange(selectedTopics.filter((topic) => topic !== topicValue));
    } else {
      onTopicsChange([...selectedTopics, topicValue]);
    }
  };

  const handleClearSelection = () => {
    onTopicsChange([]);
  };

  const handleSelectRandom = (count: number) => {
    const allAvailableTopics = grammarTopicGroups.flatMap(group => 
      group.items.map(item => item.value)
    );
    const shuffled = allAvailableTopics.sort(() => 0.5 - Math.random());
    onTopicsChange(shuffled.slice(0, count));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar temas de gramática..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSelectRandom(4)}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          Seleccionar 4 Aleatorios
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSelection}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        {filteredGroups.map((group) => {
          const GroupIcon = group.icon;
          const selectedCountInGroup = selectedTopics.filter(topic => 
            group.items.some(item => item.value === topic)
          ).length;
          const allItemsInGroupSelected = group.items.every(item => 
            selectedTopics.includes(item.value)
          );

          return (
            <Card key={group.value} className="mb-2 last:mb-0">
              <AccordionItem value={group.value} className="border-b-0">
                <AccordionTrigger className="py-3 px-4 hover:no-underline rounded-t-lg data-[state=open]:rounded-b-none">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={group.value + "-checkbox"}
                        checked={allItemsInGroupSelected && selectedCountInGroup > 0}
                        onCheckedChange={() => handleSelectAllInGroup(group.value)}
                        className="flex-shrink-0"
                      />
                      <GroupIcon className={cn("h-5 w-5", {
                        "text-blue-400": selectedCountInGroup > 0 && !allItemsInGroupSelected,
                        "text-green-400": allItemsInGroupSelected && selectedCountInGroup > 0,
                        "text-muted-foreground": selectedCountInGroup === 0,
                      })} />
                      <Label htmlFor={group.value + "-checkbox"} className="cursor-pointer font-semibold text-lg">
                        {group.label}
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {selectedCountInGroup} de {group.totalItems} seleccionados
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t border-zinc-700 p-0 rounded-b-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                    {group.items.map((item) => (
                      <div
                        key={item.value}
                        className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
                        onClick={() => handleToggleTopic(item.value)}
                      >
                        <Checkbox
                          id={item.value}
                          checked={selectedTopics.includes(item.value)}
                          onCheckedChange={() => handleToggleTopic(item.value)}
                        />
                        <Label htmlFor={item.value} className="flex-1 cursor-pointer">
                          {item.label}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          ({item.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          );
        })}
      </Accordion>
    </div>
  );
};
