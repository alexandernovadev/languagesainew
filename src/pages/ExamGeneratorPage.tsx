import { PageHeader } from "@/shared/components/ui/page-header";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useExamGenerator } from "@/shared/hooks/useExamGenerator";
import { ExamParamsTab } from "@/shared/components/exam/ExamParamsTab";
import { ExamLoadingTab } from "@/shared/components/exam/ExamLoadingTab";
import { ExamResultTab } from "@/shared/components/exam/ExamResultTab";
import { FileQuestion, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/common/classnames";

export default function ExamGeneratorPage() {
  const {
    step,
    params,
    updateParam,
    generatedExam,
    validationResult,
    isGenerating,
    isValidating,
    isSaving,
    generate,
    validate,
    correct,
    save,
    resetToParams,
    isCorrecting,
  } = useExamGenerator();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Generador de Exámenes"
        description="Genera exámenes de gramática con IA"
      />

      {/* Stepper visual - no navegable */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 sm:gap-2 rounded-xl border bg-muted/40 p-1.5 sm:p-2 w-full sm:w-auto max-w-md sm:max-w-none">
          {/* Paso 1 */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-initial justify-center",
              step === 1 && "bg-white dark:bg-background border-2 border-border",
              step > 1 && "bg-muted text-foreground",
              step < 1 && "text-muted-foreground opacity-60"
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/20 text-xs font-bold shrink-0">
              {step > 1 ? "✓" : "1"}
            </span>
            <FileQuestion className="h-4 w-4 shrink-0" />
            <span>Parámetros</span>
          </div>
          <div className={cn("h-px w-4 sm:w-6 flex-shrink-0", step >= 2 ? "bg-muted-foreground/50" : "bg-border")} />
          {/* Paso 2 */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-initial justify-center",
              step === 2 && "bg-muted border-2 border-border",
              step > 2 && "bg-muted text-foreground",
              step < 2 && "text-muted-foreground opacity-60"
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/20 text-xs font-bold shrink-0">
              {step > 2 ? "✓" : "2"}
            </span>
            {step === 2 ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <Loader2 className="h-4 w-4 shrink-0" />
            )}
            <span>Generando</span>
          </div>
          <div className={cn("h-px w-4 sm:w-6 flex-shrink-0", step >= 3 ? "bg-muted-foreground/50" : "bg-border")} />
          {/* Paso 3 */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-initial justify-center",
              step === 3 && "bg-muted border-2 border-border",
              step < 3 && "text-muted-foreground opacity-60"
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/20 text-xs font-bold shrink-0">
              3
            </span>
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Resultado</span>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <ExamParamsTab
              params={params}
              onParamChange={updateParam}
              onGenerate={generate}
              isGenerating={isGenerating}
            />
          )}
          {step === 2 && <ExamLoadingTab params={params} />}
          {step === 3 && generatedExam && (
            <ExamResultTab
              exam={generatedExam}
              params={params}
              validation={validationResult}
              onValidate={validate}
              onCorrect={correct}
              onSave={save}
              onRegenerate={resetToParams}
              isValidating={isValidating}
              isCorrecting={isCorrecting}
              isSaving={isSaving}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
