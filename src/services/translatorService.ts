import { api } from "./api";
import type { AllowedLanguageCode } from "@/constants/identity";

export interface TranslateRequest {
  text: string;
  sourceLang: AllowedLanguageCode | "auto";
  targetLang: AllowedLanguageCode;
  mode?: "normal" | "sense";
}

export const translatorService = {
  async translateStream({ text, sourceLang, targetLang, mode = "normal" }: TranslateRequest, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_BACK_URL}/api/ai/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("user-storage")
          ? { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user-storage") || "{}").state?.token}` }
          : {}),
      },
      body: JSON.stringify({ text, sourceLang, targetLang, mode }),
    });

    if (!response.body) {
      throw new Error("No response body for translation stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value || new Uint8Array(), { stream: true });
      if (chunkValue) onChunk(chunkValue);
    }
  },
};


