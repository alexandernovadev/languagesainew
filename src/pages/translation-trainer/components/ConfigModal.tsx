import { useState, useEffect, useCallback } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import { Settings, BookOpen, Brain, Zap } from "lucide-react";



// Types
import type { PreloadedConfigs, TranslationConfig } from "@/services/translationService";

interface ConfigModalProps {
  configs: PreloadedConfigs;
  onConfigChange?: (config: TranslationConfig) => void;
}

export function ConfigModal({ configs, onConfigChange }: ConfigModalProps) {

  // State
  const [config, setConfig] = useState<TranslationConfig>({
    minWords: configs.defaultConfigs.minWords,
    maxWords: configs.defaultConfigs.maxWords,
    difficulty: 'intermediate',
    sourceLanguage: 'spanish',
    targetLanguage: 'english',
    mustUseWords: [],
    grammarTopics: [],
    topic: 'general'
  });

  const [selectedWords, setSelectedWords] = useState<{ [key: string]: string[] }>({
    nouns: [],
    verbs: [],
    adjectives: [],
    adverbs: [],
    others: [],
    recent: []
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Event handlers
  const handleTranslationModeChange = (modeId: string) => {
    const mode = configs.defaultConfigs.translationModes.find(m => m.id === modeId);
    if (mode) {
      setConfig(prev => ({
        ...prev,
        sourceLanguage: mode.sourceLanguage as any,
        targetLanguage: mode.targetLanguage as any
      }));
    }
  };

  const handleWordToggle = (wordType: string, wordId: string, checked: boolean) => {
    setSelectedWords(prev => ({
      ...prev,
      [wordType]: checked 
        ? [...prev[wordType], wordId]
        : prev[wordType].filter(id => id !== wordId)
    }));
  };

  const handleGrammarTopicToggle = (topicId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      grammarTopics: checked
        ? [...(prev.grammarTopics || []), topicId]
        : (prev.grammarTopics || []).filter(id => id !== topicId)
    }));
  };

  // Initialize flag after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Notify parent when config changes (only after initialization)
  useEffect(() => {
    if (onConfigChange && isInitialized) {
      // Get word texts from selected IDs
      const wordTexts: string[] = [];
      Object.entries(selectedWords).forEach(([type, wordIds]) => {
        if (type === 'recent' && configs.recentWords) {
          wordIds.forEach(id => {
            const word = configs.recentWords.find(w => w.id === id);
            if (word?.word) wordTexts.push(word.word);
          });
        } else if (configs.userWords[type as keyof typeof configs.userWords]) {
          const words = configs.userWords[type as keyof typeof configs.userWords] as any[];
          wordIds.forEach(id => {
            const word = words.find(w => w.id === id);
            if (word?.word) wordTexts.push(word.word);
          });
        }
      });
      const finalConfig = {
        ...config,
        mustUseWords: wordTexts
      };
      onConfigChange(finalConfig);
    }
  }, [config, selectedWords, isInitialized, configs]);

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'spanish': return '🇪🇸';
      case 'english': return '🇺🇸';
      case 'portuguese': return '🇵🇹';
      default: return '🌐';
    }
  };

  const getCurrentModeId = () => {
    const mode = configs.defaultConfigs.translationModes.find(m => 
      m.sourceLanguage === config.sourceLanguage && m.targetLanguage === config.targetLanguage
    );
    return mode?.id || 'es-en'; // Default fallback
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="words" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            By Type
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="grammar" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Grammar
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minWords">Min Words</Label>
              <Input
                id="minWords"
                type="number"
                value={config.minWords}
                onChange={(e) => setConfig(prev => ({ ...prev, minWords: Number(e.target.value) }))}
                min="50"
                max="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxWords">Max Words</Label>
              <Input
                id="maxWords"
                type="number"
                value={config.maxWords}
                onChange={(e) => setConfig(prev => ({ ...prev, maxWords: Number(e.target.value) }))}
                min="100"
                max="1000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Translation Mode</Label>
            <Select
              value={getCurrentModeId()}
              onValueChange={handleTranslationModeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select translation mode" />
              </SelectTrigger>
              <SelectContent>
                {configs.defaultConfigs.translationModes.map((mode) => (
                  <SelectItem key={mode.id} value={mode.id}>
                    <div className="flex items-center gap-2">
                      <span>{getLanguageFlag(mode.sourceLanguage)}</span>
                      <span>→</span>
                      <span>{getLanguageFlag(mode.targetLanguage)}</span>
                      <span className="ml-2">{mode.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={config.difficulty}
              onValueChange={(value) => setConfig(prev => ({ ...prev, difficulty: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Beginner</Badge>
                    <span className="text-sm text-muted-foreground">Simple sentences</span>
                  </div>
                </SelectItem>
                <SelectItem value="intermediate">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Intermediate</Badge>
                    <span className="text-sm text-muted-foreground">Complex structures</span>
                  </div>
                </SelectItem>
                <SelectItem value="advanced">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Advanced</Badge>
                    <span className="text-sm text-muted-foreground">Literary style</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Topic</Label>
            <Select
              value={config.topic}
              onValueChange={(value) => setConfig(prev => ({ ...prev, topic: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {configs.defaultConfigs.topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* Words Tab */}
        <TabsContent value="words" className="space-y-4 mt-6">
          <div className="text-sm text-muted-foreground mb-4">
            Select words that must be included in the generated text (5 max per type)
          </div>
          
          <div className="space-y-4">
              {Object.entries(configs.userWords).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No words available</p>
                  <p className="text-xs text-muted-foreground mt-1">Add some words to your vocabulary first</p>
                </div>
              ) : (
                Object.entries(configs.userWords).map(([type, words]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="capitalize font-medium">{type}</Label>
                      <Badge variant="outline" className="text-xs">
                        {selectedWords[type]?.length || 0}/5
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {Array.isArray(words) ? words.length : 0} available
                      </Badge>
                    </div>
                    {Array.isArray(words) && words.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {words.map((word: any) => (
                      <div key={word.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${type}-${word.id}`}
                          checked={selectedWords[type]?.includes(word.id) || false}
                          onCheckedChange={(checked) => 
                            handleWordToggle(type, word.id, checked as boolean)
                          }
                          disabled={!selectedWords[type]?.includes(word.id) && selectedWords[type]?.length >= 5}
                        />
                        <label
                          htmlFor={`${type}-${word.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {word.word}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({word.translation})
                          </span>
                        </label>
                      </div>
                    ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No {type} available</p>
                    )}
                  </div>
                ))
              )}
            </div>
        </TabsContent>

        {/* Recent Words Tab */}
        <TabsContent value="recent" className="space-y-4 mt-6">
          <div className="text-sm text-muted-foreground mb-4">
            Select from the last 20 words added to the vocabulary
          </div>
          
          <div className="space-y-3">
            {configs.recentWords && configs.recentWords.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {configs.recentWords.map((word: any) => (
                  <div key={`recent-${word.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`recent-${word.id}`}
                        checked={selectedWords.recent?.includes(word.id) || false}
                        onCheckedChange={(checked) => 
                          handleWordToggle('recent', word.id, checked as boolean)
                        }
                        disabled={!selectedWords.recent?.includes(word.id) && (selectedWords.recent?.length || 0) >= 10}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`recent-${word.id}`}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {word.word}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {word.translation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {word.type && word.type.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {word.type[0]}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {word.level || 'medium'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent words available</p>
                <p className="text-xs text-muted-foreground mt-1">Add some words to your vocabulary first</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Grammar Tab */}
        <TabsContent value="grammar" className="space-y-4 mt-6">
          <div className="text-sm text-muted-foreground mb-4">
            Select grammar topics to focus on in the generated text
          </div>
          
          <div className="grid grid-cols-1 gap-3">
              {configs.grammarTopics.map((topic) => (
                <div key={topic.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                  <Checkbox
                    id={topic.id}
                    checked={config.grammarTopics?.includes(topic.id) || false}
                    onCheckedChange={(checked) => 
                      handleGrammarTopicToggle(topic.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={topic.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {topic.difficulty}
                      </Badge>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {topic.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </TabsContent>
      </Tabs>


    </div>
  );
}
