// Grammar topic types for language learning

export interface GrammarTopic {
  value: string;
  label: string;
}

export interface GrammarTopicOption extends GrammarTopic {
  children: GrammarTopic[];
}
