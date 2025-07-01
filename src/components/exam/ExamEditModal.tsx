import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Users,
  Bot,
  PenTool,
  Calendar,
  Hash,
  FileText,
  Settings,
  Brain,
  Save,
  Loader2,
  X,
  Plus,
  Trash2,
  CheckCircle,
  Tag,
  Radio,
  Check,
  CircleDot,
  CheckSquare,
  Type,
  Languages,
  HelpCircle,
  Edit3,
  ListOrdered,
} from "lucide-react";
import { toast } from "sonner";
import { examService, Exam } from "@/services/examService";
import { ExamHeader } from "./ExamHeader";
import { questionTypes } from "@/data/questionTypes";
import { getAllLanguages } from "@/utils/common/language";
import { getAllExamLevels, getExamTypeIcon, getExamTypeLabel } from "@/utils/common/examTypes";
import {
  getLevelLabel,
  getLanguageLabel,
  getLevelColor,
  getSourceVariant,
  formatDate,
  getQuestionText,
  getQuestionType,

  getQuestionOptions,
  getQuestionCorrectAnswers,
  getQuestionTags,
  getQuestionExplanation,
} from "./helpers/examUtils";

interface ExamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onExamUpdated: () => void;
}

interface QuestionItemProps {
  question: any;
  index: number;
  loading: boolean;
  questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onQuestionChange: (index: number, field: string, value: any) => void;
  onQuestionTextChange: (index: number, value: string) => void;
  onOptionChange: (
    questionIndex: number,
    optionIndex: number,
    field: string,
    value: any
  ) => void;
  onCorrectAnswerChange: (
    questionIndex: number,
    optionValue: string,
    isChecked: boolean
  ) => void;
  onQuestionTypeChange: (questionIndex: number, type: any) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onAddTag: (questionIndex: number, tag: string) => void;
  onRemoveTag: (questionIndex: number, tagIndex: number) => void;
  onRemoveQuestion: (index: number) => void;
  getQuestionTypeIcon: (type: string) => React.ReactNode;
  needsOptions: (type: string) => boolean;
  needsTextInput: (type: string) => boolean;
}

const QuestionItem = React.memo(function QuestionItem({
  question,
  index,
  loading,
  questionRefs,
  onQuestionChange,
  onQuestionTextChange,
  onOptionChange,
  onCorrectAnswerChange,
  onQuestionTypeChange,
  onAddOption,
  onRemoveOption,
  onAddTag,
  onRemoveTag,
  onRemoveQuestion,
  getQuestionTypeIcon,
  needsOptions,
  needsTextInput,
}: QuestionItemProps) {
  const [newTag, setNewTag] = useState("");
  const questionText = getQuestionText(question);
  const questionType = getQuestionType(question);
  const questionOptions = getQuestionOptions(question);
  const correctAnswers = getQuestionCorrectAnswers(question);
  const questionTags = getQuestionTags(question);
  const explanation = getQuestionExplanation(question);

  const isSingleChoice = ["single_choice", "true_false", "fill_blank"].includes(
    questionType
  );

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(index, newTag.trim());
      setNewTag("");
    }
  };

  return (
    <div
      ref={(el) => {
        if (questionRefs.current) {
          questionRefs.current[index] = el;
        }
      }}
      className="border rounded-lg p-6 bg-muted/20"
    >
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            #{index + 1}
          </Badge>
          <Select
            value={questionType}
            onValueChange={(value) => onQuestionTypeChange(index, value as any)}
            disabled={loading}
          >
            <SelectTrigger className="h-8 px-2 text-xs border-dashed flex flex-row items-center gap-2 min-w-[120px]">
              {getQuestionTypeIcon(questionType)}
              <span className="text-xs">
                {questionTypes.find((t) => t.value === questionType)?.label}
              </span>
              <span className="ml-auto">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className={`rounded-md hover:bg-muted/40 transition-all cursor-pointer`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span>{getQuestionTypeIcon(type.value)}</span>
                    <span className="text-xs ">{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs text-muted-foreground">Peso:</span>
            <Input
              type="number"
              min="1"
              max="10"
              value={question.weight || 1}
              onChange={(e) =>
                onQuestionChange(index, "weight", parseInt(e.target.value) || 1)
              }
              disabled={loading}
              className="w-12 h-7 text-xs px-1 py-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveQuestion(index)}
            disabled={loading}
            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
          Texto de la Pregunta *
        </Label>
        <Textarea
          value={questionText}
          onChange={(e) => onQuestionTextChange(index, e.target.value)}
          placeholder="Ingresa el texto de la pregunta"
          disabled={loading}
          className="text-sm"
          rows={3}
        />
      </div>

      {/* Dynamic Content Based on Question Type */}
      {needsOptions(questionType) ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Opciones:
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddOption(index)}
              disabled={loading}
              className="flex items-center gap-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              Agregar
            </Button>
          </div>
          <RadioGroup
            value={correctAnswers[0]}
            onValueChange={(value) => onCorrectAnswerChange(index, value, true)}
            disabled={loading}
          >
            <div className="space-y-2">
              {questionOptions.map((option, optionIndex) => {
                const isCorrect = correctAnswers.includes(option.value);

                return (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                      isCorrect
                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 shadow-sm"
                        : "bg-muted/30 border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSingleChoice ? (
                        <RadioGroupItem
                          value={option.value}
                          id={`${index}-${optionIndex}`}
                        />
                      ) : (
                        <Checkbox
                          checked={isCorrect}
                          onCheckedChange={(checked) =>
                            onCorrectAnswerChange(
                              index,
                              option.value,
                              checked as boolean
                            )
                          }
                          disabled={loading}
                        />
                      )}
                      <label
                        htmlFor={`${index}-${optionIndex}`}
                        className="text-sm font-medium text-muted-foreground min-w-[20px] cursor-pointer"
                      >
                        {String.fromCharCode(65 + optionIndex)}.
                      </label>
                    </div>
                    <Input
                      value={option.label || option.value}
                      onChange={(e) =>
                        onOptionChange(
                          index,
                          optionIndex,
                          "label",
                          e.target.value
                        )
                      }
                      placeholder={`Opción ${optionIndex + 1}`}
                      disabled={loading}
                      className={`text-sm flex-1`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveOption(index, optionIndex)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>
      ) : needsTextInput(questionType) ? (
        <div className="mb-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Respuesta Correcta:
            </Label>
            <Textarea
              value={correctAnswers[0] || ""}
              onChange={(e) =>
                onCorrectAnswerChange(index, e.target.value, true)
              }
              placeholder={
                questionType === "fill_blank"
                  ? "Escribe la palabra o frase..."
                  : questionType === "translate"
                  ? "Escribe la traducción correcta"
                  : "Escribe la respuesta esperada"
              }
              disabled={loading}
              className="text-sm"
              rows={3}
            />
          </div>
        </div>
      ) : null}

      {/* Explanation */}
      {explanation && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded dark:bg-blue-950/20 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
            Explicación:
          </h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {explanation}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          <Tag className="w-4 h-4" />
          Etiquetas:
        </h4>
        <div className="flex flex-wrap gap-1 mb-2">
          {questionTags.map((tag, tagIndex) => (
            <Badge
              key={tagIndex}
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveTag(index, tagIndex)}
                disabled={loading}
                className="h-3 w-3 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Nueva etiqueta"
            disabled={loading}
            className="text-sm flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            disabled={loading || !newTag.trim()}
            className="text-xs"
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
});

interface QuestionOrderItemProps {
  question: any;
  index: number;
  loading: boolean;
  questionCount: number;
  onMoveQuestion: (index: number, direction: "up" | "down") => void;
}

const QuestionOrderItem = React.memo(function QuestionOrderItem({
  question,
  index,
  loading,
  questionCount,
  onMoveQuestion,
}: QuestionOrderItemProps) {
  const questionText = getQuestionText(question);
  const questionType = getQuestionType(question);

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors cursor-move">
      {/* Drag Handle */}
      <div className="flex flex-col items-center justify-center w-6 h-6 text-muted-foreground">
        <div className="w-3 h-3 flex flex-col gap-0.5">
          <div className="w-full h-0.5 bg-current rounded"></div>
          <div className="w-full h-0.5 bg-current rounded"></div>
          <div className="w-full h-0.5 bg-current rounded"></div>
        </div>
      </div>

      {/* Question Number */}
      <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
        {index + 1}
      </div>

      {/* Question Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
            {getExamTypeLabel(questionType)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Peso: {question.weight || 1}
          </span>
        </div>
        <p className="text-sm font-medium line-clamp-1">
          {questionText || "Pregunta sin texto"}
        </p>
      </div>

      {/* Move Buttons */}
      <div className="flex flex-col gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onMoveQuestion(index, "up")}
          disabled={index === 0 || loading}
          className="h-5 w-5 p-0"
        >
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
            <path
              d="M18 15l-6-6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onMoveQuestion(index, "down")}
          disabled={index === questionCount - 1 || loading}
          className="h-5 w-5 p-0"
        >
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
});

export function ExamEditModal({
  isOpen,
  onClose,
  exam,
  onExamUpdated,
}: ExamEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "" as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "",
    language: "",
    topic: "",
    source: "" as "manual" | "ai" | "",
    adaptive: false,
    timeLimit: undefined as number | undefined,
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [newTag, setNewTag] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (exam) {
      console.log("Exam data received:", {
        title: exam.title,
        language: exam.language,
        level: exam.level,
        source: exam.source
      });
      setFormData({
        title: exam.title || "",
        description: exam.description || "",
        level: exam.level || "",
        language: exam.language || "",
        topic: exam.topic || "",
        source: exam.source || "",
        adaptive: exam.adaptive || false,
        timeLimit: exam.timeLimit,
      });

      const sortedQuestions = (exam.questions || []).sort((a, b) => {
        const orderA = typeof a === "object" && a !== null ? a.order || 0 : 0;
        const orderB = typeof b === "object" && b !== null ? b.order || 0 : 0;
        return orderA - orderB;
      });

      setQuestions(sortedQuestions);
    }
  }, [exam]);

  const needsOptions = (type: string) => {
    return [
      "single_choice",
      "multiple_choice",
      "true_false",
      "fill_blank",
    ].includes(type);
  };

  const needsTextInput = (type: string) => {
    return ["translate", "writing"].includes(type);
  };

  // Memoized Handlers for Performance
  const handleInputChange = useCallback(
    (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleQuestionChange = useCallback(
    (index: number, field: string, value: any) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
      );
    },
    []
  );

  const handleQuestionTextChange = useCallback(
    (index: number, value: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== index) return q;

          if (typeof q === "string") {
            return {
              question: value,
              type: "single_choice",
              options: [],
              correctAnswers: [],
              tags: [],
            };
          }

          if (typeof q === "object" && q !== null) {
            const newQ = { ...q };

            if (
              typeof newQ.question === "object" &&
              newQ.question !== null &&
              "text" in newQ.question
            ) {
              newQ.question = { ...newQ.question, text: value };
            } else if (
              "question" in newQ ||
              typeof newQ.question !== "undefined"
            ) {
              newQ.question = value;
            } else if ("text" in newQ) {
              newQ.text = value;
            } else if ("content" in newQ) {
              newQ.content = value;
            } else if ("title" in newQ) {
              newQ.title = value;
            } else {
              newQ.question = value;
            }
            return newQ;
          }

          return q;
        })
      );
    },
    []
  );

  const updateQuestionOptions = (
    question: any,
    updater: (options: any[]) => any[]
  ) => {
    const newQ = { ...question };

    if (
      typeof newQ.question === "object" &&
      newQ.question !== null &&
      Array.isArray(newQ.question.options)
    ) {
      const newOptions = updater(newQ.question.options);
      newQ.question = { ...newQ.question, options: newOptions };
    } else {
      const originalOptions = Array.isArray(newQ.options) ? newQ.options : [];
      const newOptions = updater(originalOptions);
      newQ.options = newOptions;
    }

    return newQ;
  };

  const updateQuestionTags = (
    question: any,
    updater: (tags: string[]) => string[]
  ) => {
    const newQ = { ...question };

    if (
      typeof newQ.question === "object" &&
      newQ.question !== null &&
      Array.isArray(newQ.question.tags)
    ) {
      const newTags = updater(newQ.question.tags);
      newQ.question = { ...newQ.question, tags: newTags };
    } else {
      const originalTags = Array.isArray(newQ.tags) ? newQ.tags : [];
      const newTags = updater(originalTags);
      newQ.tags = newTags;
    }

    return newQ;
  };

  const handleOptionChange = useCallback(
    (questionIndex: number, optionIndex: number, field: string, value: any) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== questionIndex) return q;
          return updateQuestionOptions(q, (options) => {
            const newOptions = [...options];
            newOptions[optionIndex] = {
              ...newOptions[optionIndex],
              [field]: value,
            };
            return newOptions;
          });
        })
      );
    },
    []
  );

  const addOption = useCallback((questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;
        return updateQuestionOptions(q, (options) => {
          const newOption = {
            value: `option_${options.length + 1}`,
            label: "",
            isCorrect: false,
          };
          return [...options, newOption];
        });
      })
    );
  }, []);

  const removeOption = useCallback(
    (questionIndex: number, optionIndex: number) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== questionIndex) return q;
          return updateQuestionOptions(q, (options) => {
            const newOptions = [...options];
            newOptions.splice(optionIndex, 1);
            return newOptions;
          });
        })
      );
    },
    []
  );

  const handleQuestionTypeChange = useCallback(
    (questionIndex: number, newType: any) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== questionIndex) return q;

          const oldType = q.type;
          let correctAnswers = q.correctAnswers || [];
          let options = q.options || [];

          const isNewTypeIncompatible = needsTextInput(newType);
          const isNewTypeTrueFalse = newType === "true_false";
          const wasOldTypeTrueFalse = oldType === "true_false";

          if (
            isNewTypeIncompatible ||
            isNewTypeTrueFalse ||
            wasOldTypeTrueFalse
          ) {
            correctAnswers = [];
          }

          if (isNewTypeTrueFalse) {
            options = [
              { value: "true", label: "Verdadero", isCorrect: false },
              { value: "false", label: "Falso", isCorrect: false },
            ];
          } else if (isNewTypeIncompatible || wasOldTypeTrueFalse) {
            options = [];
          }

          return {
            ...q,
            type: newType,
            correctAnswers,
            options,
          };
        })
      );
    },
    [needsTextInput]
  );

  const handleCorrectAnswerChange = useCallback(
    (questionIndex: number, optionValue: string, isChecked: boolean) => {
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i !== questionIndex) return q;
          let newCorrectAnswers = [...(q.correctAnswers || [])];
          if (
            q.type === "single_choice" ||
            q.type === "true_false" ||
            q.type === "fill_blank"
          ) {
            newCorrectAnswers = isChecked ? [optionValue] : [];
          } else {
            if (isChecked) {
              if (!newCorrectAnswers.includes(optionValue)) {
                newCorrectAnswers.push(optionValue);
              }
            } else {
              newCorrectAnswers = newCorrectAnswers.filter(
                (answer) => answer !== optionValue
              );
            }
          }
          return { ...q, correctAnswers: newCorrectAnswers };
        })
      );
    },
    []
  );

  const addTag = useCallback((questionIndex: number, tag: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;
        return updateQuestionTags(q, (tags) => {
          if (!tags.includes(tag)) {
            return [...tags, tag];
          }
          return tags;
        });
      })
    );
  }, []);

  const removeTag = useCallback((questionIndex: number, tagIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;
        return updateQuestionTags(q, (tags) => {
          const newTags = [...tags];
          newTags.splice(tagIndex, 1);
          return newTags;
        });
      })
    );
  }, []);

  const addQuestion = useCallback(() => {
    const newQuestion = {
      question: "",
      weight: 1,
      order: questions.length + 1,
      type: "single_choice",
      options: [],
      correctAnswers: [],
      tags: [],
    };
    setQuestions((prev) => [...prev, newQuestion]);

    setTimeout(() => {
      const newQuestionIndex = questions.length;
      const questionElement = questionRefs.current[newQuestionIndex];
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [questions.length]);

  const removeQuestion = useCallback((index: number) => {
    setQuestions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((q, idx) => ({ ...q, order: idx + 1 }));
    });
  }, []);

  const moveQuestion = useCallback(
    (index: number, direction: "up" | "down") => {
      setQuestions((prev) => {
        const updated = [...prev];
        const [movedItem] = updated.splice(index, 1);
        const newIndex = direction === "up" ? index - 1 : index + 1;
        updated.splice(newIndex, 0, movedItem);
        return updated.map((q, idx) => ({ ...q, order: idx + 1 }));
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!exam) return;

    // Validation
    if (!formData.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!formData.level) {
      toast.error("El nivel es obligatorio");
      return;
    }

    if (!formData.language) {
      toast.error("El idioma es obligatorio");
      return;
    }

    if (questions.length === 0) {
      toast.error("El examen debe tener al menos una pregunta");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const questionText = getQuestionText(questions[i]);
      if (!questionText.trim()) {
        toast.error(`La pregunta ${i + 1} no puede estar vacía`);
        return;
      }
    }

    try {
      // 1. Actualizar metadatos y relación de preguntas del examen
      const questionsForExam = questions.map((q, idx) => ({
        question: typeof q.question === 'string' ? q.question : q.question?._id,
        weight: q.weight || 1,
        order: q.order ?? idx,
      }));
      // Solo incluir campos que no estén vacíos
      const updateData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        adaptive: formData.adaptive,
        version: exam.version || 1, // Mantener la versión actual
        questions: questionsForExam,
      };

      // Solo agregar campos si tienen valor
      if (formData.level) {
        updateData.level = formData.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
      }
      if (formData.language) {
        updateData.language = formData.language;
      }
      if (formData.topic) {
        updateData.topic = formData.topic;
      }
      if (formData.source) {
        updateData.source = formData.source;
      }
      if (formData.timeLimit !== undefined) {
        updateData.timeLimit = formData.timeLimit;
      }
      
      console.log("Sending update data:", updateData);

      const response = await examService.updateExam(exam._id, updateData);

      if (!response || !response.success) {
        throw new Error(response?.message || "Error al actualizar el examen");
      }

      // 2. Actualizar preguntas modificadas (PUT /questions/:id)
      try {
        const originalQuestions = exam.questions || [];
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          const originalQuestion = originalQuestions[i];
          const questionId = typeof originalQuestion.question === 'string'
            ? originalQuestion.question
            : (originalQuestion.question as any)?._id;
          if (questionId && typeof questionId === 'string') {
            const questionText = getQuestionText(question);
            const questionType = getQuestionType(question);
            const options = getQuestionOptions(question);
            const correctAnswers = getQuestionCorrectAnswers(question);
            const tags = getQuestionTags(question);
            const explanation = getQuestionExplanation(question);
            const questionUpdateData = {
              text: questionText,
              type: questionType,
              options: options,
              correctAnswers: correctAnswers,
              tags: tags,
              explanation: explanation,
              level: formData.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
              topic: formData.topic,
            };
            await examService.updateQuestion(questionId, questionUpdateData);
          }
        }
        toast.success("Examen y preguntas actualizados exitosamente", {
          description: `"${formData.title}" ha sido actualizado completamente`,
        });
      } catch (questionError: any) {
        console.error("Error updating questions:", questionError);
        toast.warning("Examen actualizado parcialmente", {
          description: "La información básica se guardó, pero hubo errores al actualizar las preguntas.",
        });
      }
      onExamUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error updating exam:", error);
      toast.error("Error al actualizar examen", {
        description: error.message || "No se pudo actualizar el examen",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    const icon = getExamTypeIcon(type);
    return <span className="text-lg">{icon}</span>;
  };

  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Editar Examen
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Preguntas
            </TabsTrigger>
            <TabsTrigger value="order" className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4" />
              Orden
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex-1 flex flex-col">
            <ScrollArea className="h-[80vh] pr-4 pb-32">
              <div className="space-y-6">
                {/* Compact Dates Section */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Creado: {formatDate(exam.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Actualizado: {formatDate(exam.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ID: {exam._id.slice(-8)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Edit Form */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      Información General del Examen
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Título */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Título del Examen *
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          placeholder="Ingresa el título del examen"
                          disabled={loading}
                          className="text-sm"
                        />
                      </div>

                      {/* Descripción */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Descripción
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          placeholder="Ingresa una descripción del examen"
                          rows={3}
                          disabled={loading}
                          className="text-sm"
                        />
                      </div>

                      {/* Nivel y Idioma */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="level"
                            className="text-sm font-medium text-muted-foreground"
                          >
                            Nivel *
                          </Label>
                          <Select
                            value={formData.level}
                            onValueChange={(value) =>
                              handleInputChange("level", value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Selecciona el nivel" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAllExamLevels().map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="language"
                            className="text-sm font-medium text-muted-foreground"
                          >
                            Idioma *
                          </Label>
                          <Select
                            value={formData.language}
                            onValueChange={(value) =>
                              handleInputChange("language", value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Selecciona el idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAllLanguages().map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Tema y Fuente */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="topic"
                            className="text-sm font-medium text-muted-foreground"
                          >
                            Tema
                          </Label>
                          <Input
                            id="topic"
                            value={formData.topic}
                            onChange={(e) =>
                              handleInputChange("topic", e.target.value)
                            }
                            placeholder="Ej: Gramática, Vocabulario, etc."
                            disabled={loading}
                            className="text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="source"
                            className="text-sm font-medium text-muted-foreground"
                          >
                            Fuente
                          </Label>
                          <Select
                            value={formData.source}
                            onValueChange={(value) =>
                              handleInputChange("source", value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Selecciona la fuente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="ai">IA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Adaptativo */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={formData.adaptive}
                            onChange={(e) =>
                              handleInputChange("adaptive", e.target.checked)
                            }
                            disabled={loading}
                            className="rounded border-gray-300"
                          />
                          Examen Adaptativo
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Los exámenes adaptativos ajustan la dificultad según
                          el rendimiento del estudiante.
                        </p>
                      </div>

                      <Separator />

                      {/* Información del examen (read-only) */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Información del Examen
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Preguntas
                            </p>
                            <p className="text-sm font-medium">
                              {questions.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Versión
                            </p>
                            <p className="text-sm font-medium">
                              {exam.version || 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="questions" className="flex-1 flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="h-[80vh] pr-4 pb-32">
              <div className="space-y-6">
                {/* Questions Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Preguntas del Examen ({questions.length})
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {questions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No hay preguntas en este examen</p>
                          <p className="text-sm">
                            Haz clic en "Agregar Pregunta" para comenzar
                          </p>
                        </div>
                      ) : (
                        questions.map((question, index) => {
                          return (
                            <QuestionItem
                              key={question._id || index} // Use a stable key
                              question={question}
                              index={index}
                              loading={loading}
                              questionRefs={questionRefs}
                              onQuestionChange={handleQuestionChange}
                              onQuestionTextChange={handleQuestionTextChange}
                              onOptionChange={handleOptionChange}
                              onCorrectAnswerChange={handleCorrectAnswerChange}
                              onQuestionTypeChange={handleQuestionTypeChange}
                              onAddOption={addOption}
                              onRemoveOption={removeOption}
                              onAddTag={addTag}
                              onRemoveTag={removeTag}
                              onRemoveQuestion={removeQuestion}
                              getQuestionTypeIcon={getQuestionTypeIcon}
                              needsOptions={needsOptions}
                              needsTextInput={needsTextInput}
                            />
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="order" className="flex-1 flex flex-col">
            <ScrollArea className="h-[80vh] pr-4 pb-32">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ListOrdered className="w-5 h-5" />
                      Ordenar Preguntas ({questions.length})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Arrastra y suelta las preguntas para cambiar su orden
                    </p>
                  </CardHeader>
                  <CardContent>
                    {questions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ListOrdered className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay preguntas para ordenar</p>
                        <p className="text-sm">
                          Ve a la pestaña "Preguntas" para agregar preguntas
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {questions.map((question, index) => (
                          <QuestionOrderItem
                            key={question._id || index}
                            question={question}
                            index={index}
                            loading={loading}
                            questionCount={questions.length}
                            onMoveQuestion={moveQuestion}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-[-24px] z-10 bg-background py-4 border-t flex justify-between items-center gap-2">
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Pregunta
            </Button>
          </div>

          <div className="flex gap-2 justify-center items-center">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
