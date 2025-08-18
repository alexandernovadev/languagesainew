import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import type { AllowedLanguageCode } from "@/constants/identity";
import { translatorService } from "@/services/translatorService";
import { useResultHandler } from "@/hooks/useResultHandler";
import { ArrowLeftRight, Loader2, Plus } from "lucide-react";
import { ModalNova } from "@/components/ui/modal-nova";
import { ExpressionForm } from "@/components/forms/ExpressionForm";
import { WordForm } from "@/components/forms/WordForm";
import type { Expression } from "@/models/Expression";

export default function TranslatorPage() {
  const [sourceLang, setSourceLang] = useState<AllowedLanguageCode | "auto">("es");
  const [targetLang, setTargetLang] = useState<AllowedLanguageCode>("en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleApiResult } = useResultHandler();
  const [openExpr, setOpenExpr] = useState(false);
  const [openWord, setOpenWord] = useState(false);

  const handleSwap = () => {
    if (sourceLang === "auto") return;
    const newSource = targetLang;
    const newTarget = sourceLang;
    setSourceLang(newTarget);
    setTargetLang(newSource);
    setInputText(outputText);
    setOutputText("");
  };

  const handleTranslate = async () => {
    try {
      if (!inputText.trim()) return;
      if (sourceLang !== "auto" && sourceLang === targetLang) return;
      setLoading(true);
      setOutputText("");
      await translatorService.translateStream(
        { text: inputText, sourceLang, targetLang },
        (chunk) => setOutputText((prev) => prev + chunk)
      );
    } catch (error) {
      handleApiResult(error, "Translate Text");
    } finally {
      setLoading(false);
    }
  };

  const isWordLike = inputText.trim().split(/\s+/).length <= 2;
  const displayOutput = outputText ? outputText.charAt(0).toUpperCase() + outputText.slice(1) : "";

  return (
    <PageLayout>
      <PageHeader title="Traductor" description="Traduce texto entre los idiomas soportados" />
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 md:gap-3">
            <div className="space-y-1 min-w-0">
              <Label className="sr-only md:not-sr-only">From</Label>
              <LanguageSelect
                value={sourceLang}
                onChange={(v) => setSourceLang(v)}
                includeAuto
                autoLabel="Detect Automatically"
                triggerClassName="h-9 text-sm"
              />
            </div>
            <div className="flex justify-center px-1">
              <Button
                type="button"
                onClick={handleSwap}
                variant="outline"
                size="icon"
                aria-label="Swap languages"
                disabled={sourceLang === "auto"}
                className="h-9 w-9 md:h-10 md:w-10"
              >
                <ArrowLeftRight className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            <div className="space-y-1 min-w-0">
              <Label className="sr-only md:not-sr-only">To</Label>
              <LanguageSelect value={targetLang} onChange={(v) => setTargetLang(v as AllowedLanguageCode)} triggerClassName="h-9 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Textarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows={8} placeholder="Type or paste text..." />
            </div>
            <div className="space-y-2">
              <Textarea value={displayOutput} readOnly rows={8} placeholder="Translation will appear here..." />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button onClick={handleTranslate} disabled={loading || !inputText.trim() || (sourceLang !== "auto" && sourceLang === targetLang)}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Translating...</> : "Translate"}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" disabled={!outputText} onClick={() => setOpenExpr(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Expression
              </Button>
              <Button variant="outline" disabled={!outputText} onClick={() => setOpenWord(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Word
              </Button>
            </div>
          </div>
          <Separator />
          <ModalNova open={openExpr} onOpenChange={setOpenExpr} title="Add Expression">
            <ExpressionForm
              initialData={{
                expression: isWordLike ? "" : outputText,
                definition: "",
                language: targetLang,
              } as Partial<Expression>}
              onSubmit={async () => setOpenExpr(false)}
            />
          </ModalNova>
          <ModalNova open={openWord} onOpenChange={setOpenWord} title="Add Word">
            <WordForm
              initialData={{
                word: isWordLike ? outputText : "",
                language: targetLang,
              } as any}
              onSubmit={async () => setOpenWord(false)}
              onCancel={() => setOpenWord(false)}
            />
          </ModalNova>
        </CardContent>
      </Card>
    </PageLayout>
  );
}


