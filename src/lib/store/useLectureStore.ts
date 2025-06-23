import { create } from "zustand";
import { lectureService } from "../../services/lectureService";
import { Lecture } from "@/models/Lecture";

interface LectureStore {
  lectures: Lecture[];
  activeLecture: Lecture | null;
  loading: boolean;
  actionLoading: { [key: string]: boolean };
  errors: { [key: string]: string | null };
  totalPages: number;
  currentPage: number;

  getLectures: (page?: number, limit?: number) => Promise<void>;
  getLectureById: (id: string) => Promise<void>;
  postLecture: (lectureData: Lecture) => Promise<void>;
  putLecture: (id: string, lectureData: Lecture) => Promise<void>;
  putLectureImage: (
    id: string,
    lectureString: string,
    imgOld: string
  ) => Promise<void>;
  deleteLecture: (id: string | number) => Promise<void>;
  clearErrors: () => void;
  updateUrlAudio: (id: string, urlAudio: string) => Promise<void>;
  loadMoreLectures: (page: number, limit?: number) => Promise<void>;
}

export const useLectureStore = create<LectureStore>((set, get) => ({
  lectures: [],
  activeLecture: null,
  loading: false,
  actionLoading: {},
  errors: {},
  totalPages: 1,
  currentPage: 1,

  getLectures: async (page = 1, limit = 10) => {
    set({
      loading: true,
      errors: { ...get().errors, get: null },
      currentPage: page,
    });
    try {
      const { data } = await lectureService.getLectures(page, limit);

      set({
        lectures: data.data,
        totalPages: data.pages,
        loading: false,
      });
    } catch (error: any) {
      set({ errors: { ...get().errors, get: error.message }, loading: false });
    }
  },

  loadMoreLectures: async (page: number, limit = 10) => {
    set({
      loading: true,
      errors: { ...get().errors, get: null },
    });
    try {
      const { data } = await lectureService.getLectures(page, limit);

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
      set({ errors: { ...get().errors, get: error.message }, loading: false });
    }
  },

  getLectureById: async (id: string) => {
    set({ loading: true, errors: { ...get().errors, getById: null } });
    try {
      const data = await lectureService.getLectureById(id);
      set({ activeLecture: data, loading: false });
    } catch (error: any) {
      set({
        errors: { ...get().errors, getById: error.message },
        loading: false,
      });
    }
  },

  postLecture: async (lectureData: Lecture) => {
    set({
      actionLoading: { ...get().actionLoading, post: true },
      errors: { ...get().errors, post: null },
    });
    try {
      const { data } = await lectureService.postLecture(lectureData);

      set((state) => ({
        lectures: [...state.lectures, data],
        actionLoading: { ...state.actionLoading, post: false },
      }));
    } catch (error: any) {
      set({
        errors: { ...get().errors, post: error.message },
        actionLoading: { ...get().actionLoading, post: false },
      });
    }
  },

  updateUrlAudio: async (id: string, urlAudio: string, voice = "nova") => {
    set({
      actionLoading: { ...get().actionLoading, updateAudio: true },
      errors: { ...get().errors, updateAudio: null },
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
        errors: { ...get().errors, updateAudio: error.message },
        actionLoading: { ...get().actionLoading, updateAudio: false },
      });
    }
  },

  putLecture: async (id: string, lectureData: Lecture) => {
    set({
      actionLoading: { ...get().actionLoading, put: true },
      errors: { ...get().errors, put: null },
    });
    try {
      const data = await lectureService.putLecture(id, lectureData);
      set((state) => ({
        lectures: state.lectures.map((lecture) =>
          lecture._id === id ? data : lecture
        ),
        activeLecture: data,
        actionLoading: { ...state.actionLoading, put: false },
      }));
    } catch (error: any) {
      set({
        errors: { ...get().errors, put: error.message },
        actionLoading: { ...get().actionLoading, put: false },
      });
    }
  },

  putLectureImage: async (
    id: string,
    lectureString: string,
    imgOld: string
  ) => {
    set({
      actionLoading: { ...get().actionLoading, putImage: true },
      errors: { ...get().errors, putImage: null },
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
        errors: { ...get().errors, putImage: error.message },
        actionLoading: { ...get().actionLoading, putImage: false },
      });
    }
  },

  deleteLecture: async (id: string | number) => {
    set({
      actionLoading: { ...get().actionLoading, delete: true },
      errors: { ...get().errors, delete: null },
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
        errors: { ...get().errors, delete: error.message },
        actionLoading: { ...get().actionLoading, delete: false },
      });
    }
  },

  clearErrors: () => set({ errors: {} }),
}));
