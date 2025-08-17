import { create } from "zustand";
import { lectureService } from "../../services/lectureService";
import { Lecture } from "@/models/Lecture";

interface LectureStore {
  lectures: Lecture[];
  activeLecture: Lecture | null;
  loading: boolean;
  actionLoading: { [key: string]: boolean };
  totalPages: number;
  currentPage: number;
  currentFilters: any;

  setFilters: (filters: any) => void;
  getLectures: (page?: number, limit?: number, search?: string, filters?: any) => Promise<void>;
  getLectureById: (id: string) => Promise<void>;
  postLecture: (lectureData: Lecture) => Promise<Lecture>;
  putLecture: (id: string, lectureData: Lecture) => Promise<Lecture>;
  putLectureImage: (
    id: string,
    lectureString: string,
    imgOld: string
  ) => Promise<void>;
  deleteLecture: (id: string | number) => Promise<void>;
  updateUrlAudio: (id: string, urlAudio: string) => Promise<void>;
  loadMoreLectures: (page: number, limit?: number, search?: string, filters?: any) => Promise<void>;
}

export const useLectureStore = create<LectureStore>((set, get) => ({
  lectures: [],
  activeLecture: null,
  loading: false,
  actionLoading: {},
  totalPages: 1,
  currentPage: 1,
  currentFilters: {},

  setFilters: (filters: any) => {
    set({ currentFilters: filters });
  },

  getLectures: async (page = 1, limit = 10, search = "", filters = get().currentFilters) => {
    set({
      loading: true,
      currentPage: page,
    });
    try {
      const { data } = await lectureService.getLectures(page, limit, search, filters);

      set({
        lectures: data.data,
        totalPages: data.pages,
        loading: false,
      });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  loadMoreLectures: async (page: number, limit = 10, search = "", filters = get().currentFilters) => {
    set({
      loading: true,
    });
    try {
      const { data } = await lectureService.getLectures(page, limit, search, filters);

      set((state) => {
        const existingIds = new Set(
          state.lectures.map((lecture) => lecture._id)
        );
        const newLectures = data.data.filter(
          (lecture: Lecture) => !existingIds.has(lecture._id)
        );

        return {
          lectures: [...state.lectures, ...newLectures],
          totalPages: data.pages,
          loading: false,
        };
      });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  getLectureById: async (id: string) => {
    set({ loading: true });
    try {
      const data = await lectureService.getLectureById(id);
      
      set((state) => {
        // Check if the lecture is already in the lectures array
        const existingLecture = state.lectures.find(lecture => lecture._id === id);
        
        if (!existingLecture) {
          // Add the lecture to the lectures array if it's not already there
          return {
            lectures: [...state.lectures, data],
            activeLecture: data,
            loading: false,
          };
        } else {
          // Just update the activeLecture
          return {
            activeLecture: data,
            loading: false,
          };
        }
      });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  postLecture: async (lectureData: Lecture) => {
    set({
      actionLoading: { ...get().actionLoading, post: true },
    });
    try {
      const { data } = await lectureService.postLecture(lectureData);

      set((state) => ({
        lectures: [...state.lectures, data],
        actionLoading: { ...state.actionLoading, post: false },
      }));
      
      return data;
    } catch (error: any) {
      set({
        actionLoading: { ...get().actionLoading, post: false },
      });
      throw error;
    }
  },

  updateUrlAudio: async (id: string, urlAudio: string, voice = "nova") => {
    set({
      actionLoading: { ...get().actionLoading, updateAudio: true },
    });
    try {
      const data = await lectureService.updateLectureAudioUrl(
        id,
        urlAudio,
        voice
      );
      set((state) => ({
        lectures: state.lectures.map((lecture) =>
          lecture._id === id ? { ...lecture, urlAudio: data.urlAudio } : lecture
        ),
        activeLecture:
          state.activeLecture?._id === id
            ? { ...state.activeLecture, urlAudio: data.urlAudio }
            : state.activeLecture,
        actionLoading: { ...state.actionLoading, updateAudio: false },
      }));
    } catch (error: any) {
      set({
        actionLoading: { ...get().actionLoading, updateAudio: false },
      });
      throw error;
    }
  },

  putLecture: async (id: string, lectureData: Lecture) => {
    set({
      actionLoading: { ...get().actionLoading, put: true },
    });
    try {
      const data = await lectureService.putLecture(id, lectureData);
      
      // Actualizar el estado inmediatamente
      set((state) => ({
        lectures: state.lectures.map((lecture) =>
          lecture._id === id ? data : lecture
        ),
        activeLecture: data,
        actionLoading: { ...state.actionLoading, put: false },
      }));
      
      return data;
    } catch (error: any) {
      set({
        actionLoading: { ...get().actionLoading, put: false },
      });
      throw error;
    }
  },

  putLectureImage: async (
    id: string,
    lectureString: string,
    imgOld: string
  ) => {
    set({
      actionLoading: { ...get().actionLoading, putImage: true },
    });
    try {
      const data = await lectureService.putLectureImage(
        id,
        lectureString,
        imgOld
      );
      set((state) => ({
        lectures: state.lectures.map((lecture) =>
          lecture._id === id
            ? { ...lecture, img: data.img, updatedAt: data.updatedAt }
            : lecture
        ),
        activeLecture:
          state.activeLecture?._id === id
            ? {
                ...state.activeLecture,
                img: data.img,
                updatedAt: data.updatedAt,
              }
            : state.activeLecture,
        actionLoading: { ...state.actionLoading, putImage: false },
      }));
    } catch (error: any) {
      set({
        actionLoading: { ...get().actionLoading, putImage: false },
      });
      throw error;
    }
  },

  deleteLecture: async (id: string | number) => {
    set({
      actionLoading: { ...get().actionLoading, delete: true },
    });
    try {
      await lectureService.deleteLecture(id);
      set((state) => ({
        lectures: state.lectures.filter((lecture) => lecture._id !== id),
        activeLecture:
          state.activeLecture?._id === id ? null : state.activeLecture,
        actionLoading: { ...state.actionLoading, delete: false },
      }));
    } catch (error: any) {
      set({
        actionLoading: { ...get().actionLoading, delete: false },
      });
      throw error;
    }
  },
}));
