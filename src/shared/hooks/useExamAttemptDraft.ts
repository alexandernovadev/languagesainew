const STORAGE_KEY_PREFIX = "exam_attempt_";

export interface ExamAttemptDraft {
  startedAt: number;
  answers: (number | string | number[] | null)[];
  timeLimitMinutes?: number;
  shuffleQuestions?: boolean;
  shuffledOrder?: number[];
  currentQuestionIndex?: number;
}

function getStorageKey(examId: string, attemptId: string): string {
  return `${STORAGE_KEY_PREFIX}${examId}_${attemptId}`;
}

export function loadExamAttemptDraft(
  examId: string,
  attemptId: string,
  questionCount: number
): ExamAttemptDraft | null {
  try {
    const key = getStorageKey(examId, attemptId);
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamAttemptDraft;
    if (!parsed.startedAt || !Array.isArray(parsed.answers)) return null;
    const answers = parsed.answers.slice(0, questionCount);
    while (answers.length < questionCount) {
      answers.push(null);
    }
    return {
      startedAt: parsed.startedAt,
      answers,
      timeLimitMinutes: parsed.timeLimitMinutes ?? 0,
      shuffleQuestions: parsed.shuffleQuestions ?? false,
      shuffledOrder: Array.isArray(parsed.shuffledOrder) ? parsed.shuffledOrder : undefined,
      currentQuestionIndex: typeof parsed.currentQuestionIndex === "number" ? parsed.currentQuestionIndex : 0,
    };
  } catch {
    return null;
  }
}

export function saveExamAttemptDraft(
  examId: string,
  attemptId: string,
  draft: ExamAttemptDraft
): void {
  try {
    const key = getStorageKey(examId, attemptId);
    sessionStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function clearExamAttemptDraft(examId: string, attemptId: string): void {
  try {
    sessionStorage.removeItem(getStorageKey(examId, attemptId));
  } catch {
    // ignore
  }
}

export function clearAllDraftsForExam(examId: string): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(`${STORAGE_KEY_PREFIX}${examId}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}
