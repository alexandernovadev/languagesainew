import { api } from "./api";
import { Lecture } from "../models/Lecture";

export const lectureService = {
  async getLectures(page = 1, limit = 10, search = "", filters: Record<string, any> = {}) {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));

    if (search.trim()) params.append("search", search.trim());

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.append(key, String(value));
      }
    });

    const res = await api.get(`/api/lectures?${params.toString()}`);
    return res.data;
  },

  async getLectureById(id: string) {
    const res = await api.get(`/api/lectures/${id}`);
    return res.data.data;
  },

  async postLecture(lectureData: Lecture) {
    const res = await api.post(`/api/lectures`, lectureData);
    return res.data;
  },

  async updateLecture(id: string, lectureData: Partial<Lecture>) {
    const res = await api.put(`/api/lectures/${id}`, lectureData);
    return res.data;
  },

  async deleteLecture(id: string | number) {
    const res = await api.delete(`/api/lectures/${id}`);
    return res.data;
  },

  async updateLectureAudioUrl(id: string, urlAudio: string, voice = "nova") {
    const res = await api.put(`/api/lectures/${id}/audio`, { urlAudio, voice });
    return res.data;
  },

  async importLectures(
    file: File,
    duplicateStrategy: string,
    batchSize: number,
    validateOnly: boolean
  ) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("duplicateStrategy", duplicateStrategy);
    formData.append("batchSize", batchSize.toString());
    formData.append("validateOnly", validateOnly.toString());

    const res = await api.post(`/api/lectures/import-json`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  async exportLectures() {
    const res = await api.get(`/api/lectures/export-file`);
    return res.data;
  },

  async putLecture(id: string, lectureData: Lecture) {
    const res = await api.put(`/api/lectures/${id}`, lectureData);
    return res.data;
  },

  async putLectureImage(id: string, lectureString: string, imgOld: string) {
    const trimmedLectureString = lectureString.slice(0, 3500);
    const res = await api.post("/api/ai/generate-image-lecture", {
      lectureString: trimmedLectureString,
      imgOld,
    });
    return res.data;
  },
};
