import { ExamGenerationResponse } from "@/services/examService";
import { ExamGeneratorFilters } from "@/hooks/useExamGenerator";

// Props interfaces for exam components
export interface ExamConfigFormProps {
  filters: ExamGeneratorFilters;
  updateFilter: (key: keyof ExamGeneratorFilters, value: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

export interface ExamQuestionDisplayProps {
  question: any; // ExamQuestion from examService
  questionNumber: number;
}

export interface ExamOptionCardProps {
  value: string;
  label: string;
  isCorrect: boolean;
  hoverClass: string;
  circleColor: string;
  badgeText?: string;
}

export interface ExamSummaryProps {
  exam: ExamGenerationResponse;
  filters: ExamGeneratorFilters;
  onRegenerate: () => void;
  onDownload: () => void;
  onView: () => void;
}

export interface ExamStatsProps {
  exam: ExamGenerationResponse;
}

export interface ExamGenerationProgressProps {
  isGenerating: boolean;
}

export interface SuggestedTopicsProps {
  onTopicSelect: (topic: string) => void;
  selectedTopic: string;
}

export interface QuestionTypeStatsProps {
  questions: any[];
  showChart?: boolean;
  showPercentages?: boolean;
}

// Form field types
export interface BaseFieldProps {
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
}

export interface TextFieldProps extends BaseFieldProps {
  type: "text" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export interface NumberFieldProps extends BaseFieldProps {
  type: "number";
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string }>;
  placeholder?: string;
}

export interface SliderFieldProps extends BaseFieldProps {
  type: "slider";
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  getLabel?: (value: number) => string;
  showLabels?: boolean;
}

export interface CheckboxGroupFieldProps extends BaseFieldProps {
  type: "checkbox-group";
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ value: string; label: string; description?: string }>;
}

export type ExamFormFieldProps =
  | TextFieldProps
  | NumberFieldProps
  | SelectFieldProps
  | SliderFieldProps
  | CheckboxGroupFieldProps;

// Utility types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface QuestionTypeStats {
  [key: string]: number;
}

export interface TagStats {
  [key: string]: number;
}
