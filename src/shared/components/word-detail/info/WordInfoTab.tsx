import { IWord } from "@/types/models/Word";
import { WordImageSection } from "./WordImageSection";
import { WordHeaderSection } from "./WordHeaderSection";
import { WordDefinitionSection } from "./WordDefinitionSection";
import { WordExamplesSection } from "./WordExamplesSection";
import { WordSynonymsSection } from "./WordSynonymsSection";
import { WordTypesSection } from "./WordTypesSection";
import { WordCodeSwitchingSection } from "./WordCodeSwitchingSection";

interface WordInfoTabProps {
  word: IWord;
  loadingImage: boolean;
  loadingSynonyms: boolean;
  loadingExamples: boolean;
  loadingTypes: boolean;
  loadingCodeSwitching: boolean;
  loadingAll?: boolean;
  onRefreshImage: () => void;
  onRefreshSynonyms: () => void;
  onRefreshExamples: () => void;
  onRefreshTypes: () => void;
  onRefreshCodeSwitching: () => void;
  onRefreshAll?: () => void;
  onUpdateDifficulty?: (difficulty: string) => void;
}

export function WordInfoTab({
  word,
  loadingImage,
  loadingSynonyms,
  loadingExamples,
  loadingTypes,
  loadingCodeSwitching,
  loadingAll,
  onRefreshImage,
  onRefreshSynonyms,
  onRefreshExamples,
  onRefreshTypes,
  onRefreshCodeSwitching,
  onRefreshAll,
  onUpdateDifficulty,
}: WordInfoTabProps) {
  return (
    <div className="px-6 py-4 h-full space-y-3">
      <WordImageSection
        word={word}
        onRefresh={onRefreshImage}
        loading={loadingImage}
      />
      
      <WordHeaderSection 
        word={word}
        onRefreshAll={onRefreshAll}
        loadingAll={loadingAll}
        onUpdateDifficulty={onUpdateDifficulty}
      />
      
      <WordDefinitionSection word={word} />
      
      <WordExamplesSection
        word={word}
        onRefresh={onRefreshExamples}
        loading={loadingExamples}
      />
      
      <WordSynonymsSection
        word={word}
        onRefresh={onRefreshSynonyms}
        loading={loadingSynonyms}
      />
      
      <WordTypesSection
        word={word}
        onRefresh={onRefreshTypes}
        loading={loadingTypes}
      />
      
      <WordCodeSwitchingSection
        word={word}
        onRefresh={onRefreshCodeSwitching}
        loading={loadingCodeSwitching}
      />
    </div>
  );
}
