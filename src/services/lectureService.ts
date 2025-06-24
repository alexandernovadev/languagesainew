import { api } from "./api";
import { Lecture } from "../models/Lecture";
import { getAuthHeaders } from "@/utils/services";

export const lectureService = {
  async getLectures(page = 1, limit = 10) {
    try {
      const res = await api.get(`/api/lectures?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getLectureById(id: string) {
    try {
      const res = await api.get(`/api/lectures/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async postLecture(lectureData: Lecture) {
    try {
      const res = await api.post("/api/lectures", lectureData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateLectureAudioUrl(id: string, audioUrl: string, voice = "nova") {
    try {
      const res = await api.post(
        "/api/lectures/generateAudio",
        { oldUrl: audioUrl, voice },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async putLecture(id: string, lectureData: Lecture) {
    try {
      const res = await api.put(`/api/lectures/${id}`, lectureData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async putLectureImage(id: string, lectureString: string, imgOld: string) {
    try {
      const trimmedLectureString = lectureString.slice(0, 3500);
      const res = await api.post(
        "/api/ai/generate-image-lecture",
        { lectureString: trimmedLectureString, imgOld },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async deleteLecture(id: string | number) {
    try {
      const res = await api.delete(`/api/lectures/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async exportLectures() {
    try {
      const res = await api.get(`/api/lectures/export-json`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },
};
