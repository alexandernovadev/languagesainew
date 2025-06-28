import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Search, 
  Check, 
  X, 
  BookOpen, 
  AlertCircle,
  Info
} from 'lucide-react';
import { GRAMMAR_TOPICS, getCategoryKeys, getCategoryInfo } from '../constants/grammarTopics';

interface GrammarTopicsSelectorProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  error?: string;
}

export function GrammarTopicsSelector({ 
  selectedTopics, 
  onTopicsChange, 
  error 
}: GrammarTopicsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const categoryKeys = getCategoryKeys();

  // Filter topics based on search term
  const filteredCategories = categoryKeys.filter(categoryKey => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return false;
    
    if (!searchTerm) return true;
    
    return category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.topics.some(topic => 
             topic.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });

  const handleTopicToggle = (topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];
    
    onTopicsChange(newTopics);
  };

  const handleSelectAll = () => {
    const allTopics = categoryKeys.flatMap(categoryKey => {
      const category = getCategoryInfo(categoryKey);
      return category?.topics || [];
    });
    onTopicsChange(allTopics);
  };

  const handleClearAll = () => {
    onTopicsChange([]);
  };

  const handleSelectCategory = (categoryKey: string) => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return;

    const categoryTopics = category.topics;
    const currentCategoryTopics = selectedTopics.filter(topic => 
      categoryTopics.includes(topic)
    );

    const newTopics = currentCategoryTopics.length === categoryTopics.length
      ? selectedTopics.filter(topic => !categoryTopics.includes(topic))
      : [...selectedTopics.filter(topic => !categoryTopics.includes(topic)), ...categoryTopics];

    onTopicsChange(newTopics);
  };

  const isCategorySelected = (categoryKey: string) => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return false;
    
    const categoryTopics = category.topics;
    const selectedCategoryTopics = selectedTopics.filter(topic => 
      categoryTopics.includes(topic)
    );
    
    return selectedCategoryTopics.length === categoryTopics.length;
  };

  const isCategoryPartiallySelected = (categoryKey: string) => {
    const category = getCategoryInfo(categoryKey);
    if (!category) return false;
    
    const categoryTopics = category.topics;
    const selectedCategoryTopics = selectedTopics.filter(topic => 
      categoryTopics.includes(topic)
    );
    
    return selectedCategoryTopics.length > 0 && selectedCategoryTopics.length < categoryTopics.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Temas de Gramática Obligatorios
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecciona los temas de gramática que deben incluirse obligatoriamente en el examen
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
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
            onClick={handleSelectAll}
            className="text-xs"
          >
            <Check className="h-3 w-3 mr-1" />
            Seleccionar Todo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar Todo
          </Button>
        </div>

        {/* Selected count */}
        {selectedTopics.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">
              {selectedTopics.length} tema{selectedTopics.length !== 1 ? 's' : ''} seleccionado{selectedTopics.length !== 1 ? 's' : ''}
            </Badge>
            {selectedTopics.length > 5 && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs">Muchos temas pueden afectar la distribución</span>
              </div>
            )}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Separator />

        {/* Categories */}
        <ScrollArea className="h-[400px]">
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
              const selectedCategoryTopics = selectedTopics.filter(topic => 
                categoryTopics.includes(topic)
              );

              const isSelected = isCategorySelected(categoryKey);
              const isPartiallySelected = isCategoryPartiallySelected(categoryKey);

              return (
                <AccordionItem 
                  key={categoryKey} 
                  value={categoryKey}
                  className="border rounded-lg"
                >
                  <div className="flex items-center px-4">
                    <Checkbox
                      checked={isSelected || isPartiallySelected}
                      onCheckedChange={() => handleSelectCategory(categoryKey)}
                      className="mr-3"
                      data-testid={`category-checkbox-${categoryKey}`}
                      aria-label={`Select all topics in ${category.title}`}
                    />
                    <AccordionTrigger className="flex-1 hover:no-underline py-4">
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{category.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedCategoryTopics.length} de {categoryTopics.length} seleccionados
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2 mt-2 ml-8">
                      {categoryTopics.map((topic) => (
                        <label
                          key={topic}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
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
        </ScrollArea>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 border border-border rounded-lg">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">¿Cómo funciona?</p>
            <p>
              Los temas seleccionados se incluirán obligatoriamente en el examen. 
              La IA distribuirá las preguntas para cubrir cada tema de gramática seleccionado.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 