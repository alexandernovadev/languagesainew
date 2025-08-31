import { Clock, Wrench, RefreshCw, BookOpen } from "lucide-react";

export interface GrammarTopic {
  value: string;
  label: string;
  count: number;
}

export interface GrammarTopicGroup {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  totalItems: number;
  items: GrammarTopic[];
}

export const grammarTopicGroups: GrammarTopicGroup[] = [
  {
    value: "tiempos-verbales",
    label: "Tiempos Verbales",
    icon: Clock,
    totalItems: 13,
    items: [
      { value: "present-simple", label: "Presente Simple", count: 5 },
      { value: "present-continuous", label: "Presente Continuo", count: 3 },
      { value: "past-simple", label: "Pasado Simple", count: 4 },
      { value: "past-continuous", label: "Pasado Continuo", count: 1 },
      { value: "present-perfect", label: "Presente Perfecto", count: 7 },
      { value: "past-perfect", label: "Pasado Perfecto", count: 2 },
      { value: "future-will", label: "Futuro con Will", count: 6 },
      { value: "future-going-to", label: "Futuro con Going To", count: 3 },
      { value: "future-perfect", label: "Futuro Perfecto", count: 1 },
      { value: "conditional-0", label: "Condicional Cero", count: 2 },
      { value: "conditional-1", label: "Condicional Tipo 1", count: 4 },
      { value: "conditional-2", label: "Condicional Tipo 2", count: 3 },
      { value: "conditional-3", label: "Condicional Tipo 3", count: 1 },
    ],
  },
  {
    value: "verbos-modales",
    label: "Verbos Modales",
    icon: Wrench,
    totalItems: 5,
    items: [
      { value: "can-could", label: "Can / Could", count: 5 },
      { value: "may-might", label: "May / Might", count: 3 },
      { value: "must-have-to", label: "Must / Have to", count: 4 },
      { value: "should-ought-to", label: "Should / Ought to", count: 2 },
      { value: "will-would", label: "Will / Would", count: 6 },
    ],
  },
  {
    value: "voz-pasiva",
    label: "Voz Pasiva",
    icon: RefreshCw,
    totalItems: 5,
    items: [
      { value: "passive-simple", label: "Voz Pasiva (simple)", count: 5 },
      { value: "passive-continuous", label: "Voz Pasiva (continuo)", count: 3 },
      { value: "passive-perfect", label: "Voz Pasiva (perfecto)", count: 4 },
      { value: "passive-modals", label: "Voz Pasiva (modales)", count: 2 },
      { value: "passive-causative", label: "Voz Pasiva (causativa)", count: 1 },
    ],
  },
  {
    value: "estilo-indirecto",
    label: "Estilo Indirecto",
    icon: BookOpen,
    totalItems: 4,
    items: [
      { value: "reported-statements", label: "Reported Statements", count: 5 },
      { value: "reported-questions", label: "Reported Questions", count: 3 },
      { value: "reported-commands", label: "Reported Commands", count: 4 },
      { value: "reported-modals", label: "Reported Modals", count: 2 },
    ],
  },
  {
    value: "gramatica-basica",
    label: "Gramática Básica",
    icon: BookOpen,
    totalItems: 8,
    items: [
      { value: "nouns", label: "Sustantivos", count: 5 },
      { value: "pronouns", label: "Pronombres", count: 3 },
      { value: "adjectives", label: "Adjetivos", count: 4 },
      { value: "adverbs", label: "Adverbios", count: 2 },
      { value: "articles", label: "Artículos", count: 6 },
      { value: "conjunctions", label: "Conjunciones", count: 3 },
      { value: "determiners", label: "Determinantes", count: 1 },
      { value: "quantifiers", label: "Cuantificadores", count: 2 },
    ],
  },
];
