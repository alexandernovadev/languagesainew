import { api } from "./api";
import type {
  IExam,
  IExamAttempt,
  GeneratedExam,
  ValidationResult,
  GenerateExamParams,
} from "@/types/models";

export const examService = {
  async generate(params: GenerateExamParams) {
    const res = await api.post("/api/exams/generate", params);
    return res.data.data as GeneratedExam;
  },

  async validate(exam: object | string) {
    const body = typeof exam === "string" ? { exam } : exam;
    const res = await api.post("/api/exams/validate", body);
    return res.data.data as ValidationResult;
  },

  async correct(exam: object, validation: object) {
    const res = await api.post("/api/exams/correct", { exam, validation });
    return res.data.data as GeneratedExam;
  },

  async create(exam: Partial<IExam>) {
    const res = await api.post("/api/exams", exam);
    return res.data.data as IExam;
  },

  async list(page = 1, limit = 20) {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    const res = await api.get(`/api/exams?${params.toString()}`);
    return res.data.data as { data: IExam[]; total: number };
  },

  async getById(id: string) {
    const res = await api.get(`/api/exams/${id}`);
    return res.data.data as IExam;
  },

  async delete(id: string) {
    await api.delete(`/api/exams/${id}`);
  },

  async startAttempt(examId: string) {
    const res = await api.post(`/api/exams/${examId}/attempts`);
    return res.data.data as IExamAttempt;
  },

  async submitAttempt(examId: string, attemptId: string, answers: (number | string)[]) {
    const res = await api.post(`/api/exams/${examId}/attempts/${attemptId}/submit`, {
      answers,
    });
    return res.data.data as IExamAttempt;
  },

  async getAttempt(examId: string, attemptId: string) {
    const res = await api.get(`/api/exams/${examId}/attempts/${attemptId}`);
    return res.data.data as IExamAttempt;
  },

  async listAttemptsByExam(examId: string, limit = 20) {
    const params = new URLSearchParams();
    params.append("limit", String(limit));
    const res = await api.get(`/api/exams/${examId}/attempts?${params.toString()}`);
    return res.data.data as IExamAttempt[];
  },

  async listMyAttempts(limit = 20) {
    const params = new URLSearchParams();
    params.append("limit", String(limit));
    const res = await api.get(`/api/exams/attempts/my?${params.toString()}`);
    return res.data.data as IExamAttempt[];
  },

  async chatOnQuestion(
    examId: string,
    attemptId: string,
    questionIndex: number,
    message: string
  ) {
    const res = await api.post(
      `/api/exams/${examId}/attempts/${attemptId}/questions/${questionIndex}/chat`,
      { message }
    );
    return res.data.data as { response: string };
  },
};
