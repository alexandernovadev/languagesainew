import { api } from "./api";
import { Lecture } from "../models/Lecture";
import { getAuthHeaders } from "./utils/headers";

export const lectureService = {
  async getLectures(page = 1, limit = 10) {
    const res = await api.get(`/api/lectures?page=${page}&limit=${limit}`, { headers: getAuthHeaders() });
    return res.data;
  },

  async getLectureById(id: string) {
    const res = await api.get(`/api/lectures/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  async postLecture(lectureData: Lecture) {
    const res = await api.post("/api/lectures", {
      headers: getAuthHeaders(),
      body: JSON.stringify(lectureData),
    });
    return res.data;
  },

  async updateLectureAudioUrl(id: string, audioUrl: string, voice = "nova") {
    const res = await api.post("/api/lectures/generateAudio", {
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldUrl: audioUrl, voice }),
    });
    return res.data;
  },

  async putLecture(id: string, lectureData: Lecture) {
    const res = await api.put(`/api/lectures/${id}`, {
      headers: getAuthHeaders(),
      body: JSON.stringify(lectureData),
    });
    return res.data;
  },

  async putLectureImage(id: string, lectureString: string, imgOld: string) {
    const trimmedLectureString = lectureString.slice(0, 3500);
    const res = await api.post("/api/ai/generate-image-lecture", {
      headers: getAuthHeaders(),
      body: JSON.stringify({ lectureString: trimmedLectureString, imgOld }),
    });
    return res.data;
  },

  async deleteLecture(id: string | number) {
    const res = await api.delete(`/api/lectures/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },
};
