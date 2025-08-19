import React, { useRef, useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import type { AllowedLanguageCode } from "@/constants/identity";
import { translatorService } from "@/services/translatorService";
import { useResultHandler } from "@/hooks/useResultHandler";
import { ArrowLeftRight, Loader2 } from "lucide-react";

import { capitalize } from "@/utils/common/string/capitalize";

export default function TranslatorPage() {
  const [sourceLang, setSourceLang] = useState<AllowedLanguageCode | "auto">("es");
  const [targetLang, setTargetLang] = useState<AllowedLanguageCode>("en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleApiResult } = useResultHandler();
  const outputRef = useRef<HTMLDivElement | null>(null);

  

  const handleSwap = () => {
    if (sourceLang === "auto") return;
    const prevInput = inputText;
    const prevOutput = outputText;
    const newSource = targetLang;
    const newTarget = sourceLang;
    setSourceLang(newSource);
    setTargetLang(newTarget as AllowedLanguageCode);
    setInputText(prevOutput);
    setOutputText(prevInput);
  };

  const handleTranslate = async (mode: "normal" | "sense" = "normal") => {
    try {
      if (!inputText.trim()) return;
      if (sourceLang !== "auto" && sourceLang === targetLang) return;
      setLoading(true);
      setOutputText("");
      await translatorService.translateStream(
        { text: inputText, sourceLang, targetLang, mode },
        (chunk) => setOutputText((prev) => prev + chunk)
      );
    } catch (error) {
      handleApiResult(error, "Translate Text");
    } finally {
      setLoading(false);
    }
  };

  
  const displayOutput = outputText ? capitalize(outputText) : "";

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
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                placeholder="Type or paste text..."
                className="resize-none h-[300px]"
              />
            </div>
            <div className="space-y-2">
              <div
                ref={outputRef}
                aria-label="Translation output"
                className="h-[300px] overflow-auto rounded-md border bg-background p-2 whitespace-pre-wrap break-words"
              >
                {displayOutput}
              </div>
            </div>
          </div>



          <div className="flex justify-start items-center">
            <div className="flex items-center gap-2">
              <Button onClick={() => handleTranslate("normal")} disabled={loading || !inputText.trim() || (sourceLang !== "auto" && sourceLang === targetLang)}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Traduciendo...</> : "Traducir"}
              </Button>
              <Button variant="secondary" onClick={() => handleTranslate("sense")} disabled={loading || !inputText.trim() || (sourceLang !== "auto" && sourceLang === targetLang)}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Traduciendo...</> : "Traducir con sentido"}
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </PageLayout>
  );
}


