import { api } from "./api";
import { Lecture } from "../models/Lecture";

export const lectureService = {
  async getLectures(page = 1, limit = 10) {
    const res = await api.get(`/api/lectures?page=${page}&limit=${limit}`);
    return res.data;
  },

  async getLectureById(id: string) {
    const res = await api.get(`/api/lectures/${id}`);
    return res.data;
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
    const res = await api.put(
      `/api/lectures/${id}/audio`,
      { urlAudio, voice }
    );
    return res.data;
  },

  async importLectures(file: File, duplicateStrategy: string, batchSize: number, validateOnly: boolean) {
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
    const res = await api.get(`/api/lectures/export-json`);
    return res.data;
  },

  async putLecture(id: string, lectureData: Lecture) {
    const res = await api.put(`/api/lectures/${id}`, lectureData);
    return res.data;
  },

  async putLectureImage(id: string, lectureString: string, imgOld: string) {
    const trimmedLectureString = lectureString.slice(0, 3500);
    const res = await api.post(
      "/api/ai/generate-image-lecture",
      { lectureString: trimmedLectureString, imgOld }
    );
    return res.data;
  },
};
