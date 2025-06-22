import { api } from "./api";
import { Lecture } from "../models/Lecture";
import { getAuthHeaders } from "./utils/headers";

export const lectureService = {
  async getLectures(page = 1, limit = 10) {
    const res = await api.get("/lectures", { headers: getAuthHeaders() });
    return res.data;
  },

  async getLectureById(id: string) {
    const res = await api.get(`/lectures/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  async postLecture(lectureData: Lecture) {
    const res = await api.post("/lectures", {
      headers: getAuthHeaders(),
      body: JSON.stringify(lectureData),
    });
    return res.data;
  },

  async updateLectureAudioUrl(id: string, audioUrl: string, voice = "nova") {
    const res = await api.post("/lectures/generateAudio", {
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldUrl: audioUrl, voice }),
    });
    return res.data;
  },

  async putLecture(id: string, lectureData: Lecture) {
    const res = await api.put(`/lectures/${id}`, {
      headers: getAuthHeaders(),
      body: JSON.stringify(lectureData),
    });
    return res.data;
  },

  async putLectureImage(id: string, lectureString: string, imgOld: string) {
    const trimmedLectureString = lectureString.slice(0, 3500);
    const res = await api.post("/ai/generate-image-lecture", {
      headers: getAuthHeaders(),
      body: JSON.stringify({ lectureString: trimmedLectureString, imgOld }),
    });
    return res.data;
  },

  async deleteLecture(id: string | number) {
    const res = await api.delete(`/lectures/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },
};
