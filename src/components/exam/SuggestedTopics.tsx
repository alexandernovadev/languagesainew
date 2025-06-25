import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp } from 'lucide-react';
import { commonTopics } from '@/data/questionTypes';

interface SuggestedTopicsProps {
  onTopicSelect: (topic: string) => void;
  selectedTopic: string;
}

const topicCategories = {
  grammar: {
    title: 'Gramática',
    icon: '📚',
    topics: ['Present Simple', 'Past Perfect', 'Conditionals', 'Passive Voice', 'Modal Verbs', 'Phrasal Verbs']
  },
  vocabulary: {
    title: 'Vocabulario',
    icon: '📖',
    topics: ['Business English', 'Travel Vocabulary', 'Food & Cooking', 'Technology Terms', 'Health & Medicine', 'Academic Words']
  },
  skills: {
    title: 'Habilidades',
    icon: '🎯',
    topics: ['Reading Comprehension', 'Listening Skills', 'Writing Essays', 'Speaking Practice', 'Pronunciation', 'Conversation']
  },
  themes: {
    title: 'Temas',
    icon: '🌍',
    topics: ['Daily Life', 'Work & Career', 'Education', 'Environment', 'Culture', 'Entertainment']
  }
};

export function SuggestedTopics({ onTopicSelect, selectedTopic }: SuggestedTopicsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Temas Sugeridos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {Object.entries(topicCategories).map(([key, category]) => (
          <div key={key} className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.title}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onTopicSelect(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Otros Temas Populares
          </h4>
          <div className="flex flex-wrap gap-2">
            {commonTopics.slice(0, 10).map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onTopicSelect(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 