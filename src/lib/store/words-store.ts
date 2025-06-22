import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Word {
  id: string
  word: string
  ipa: string
  meaning: string
  seen: Date
  timesHeard: number
  createdAt: Date
}

interface WordsState {
  words: Word[]
  addWord: (word: Omit<Word, "id" | "createdAt" | "timesHeard">) => void
  updateWord: (id: string, word: Partial<Word>) => void
  deleteWord: (id: string) => void
  incrementHeard: (id: string) => void
  getWord: (id: string) => Word | undefined
}

// Datos de ejemplo (máximo 20 palabras)
const defaultWords: Word[] = [
  {
    id: "1",
    word: "beautiful",
    ipa: "/ˈbjuːtɪfəl/",
    meaning: "hermoso, bello",
    seen: new Date("2024-01-15"),
    timesHeard: 3,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    word: "knowledge",
    ipa: "/ˈnɒlɪdʒ/",
    meaning: "conocimiento",
    seen: new Date("2024-01-14"),
    timesHeard: 5,
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    word: "wonderful",
    ipa: "/ˈwʌndəfəl/",
    meaning: "maravilloso",
    seen: new Date("2024-01-13"),
    timesHeard: 2,
    createdAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    word: "important",
    ipa: "/ɪmˈpɔːtənt/",
    meaning: "importante",
    seen: new Date("2024-01-12"),
    timesHeard: 7,
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    word: "different",
    ipa: "/ˈdɪfərənt/",
    meaning: "diferente",
    seen: new Date("2024-01-11"),
    timesHeard: 4,
    createdAt: new Date("2024-01-11"),
  },
  {
    id: "6",
    word: "necessary",
    ipa: "/ˈnesəsəri/",
    meaning: "necesario",
    seen: new Date("2024-01-10"),
    timesHeard: 1,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "7",
    word: "available",
    ipa: "/əˈveɪləbəl/",
    meaning: "disponible",
    seen: new Date("2024-01-09"),
    timesHeard: 6,
    createdAt: new Date("2024-01-09"),
  },
  {
    id: "8",
    word: "possible",
    ipa: "/ˈpɒsəbəl/",
    meaning: "posible",
    seen: new Date("2024-01-08"),
    timesHeard: 3,
    createdAt: new Date("2024-01-08"),
  },
  {
    id: "9",
    word: "comfortable",
    ipa: "/ˈkʌmftəbəl/",
    meaning: "cómodo",
    seen: new Date("2024-01-07"),
    timesHeard: 2,
    createdAt: new Date("2024-01-07"),
  },
  {
    id: "10",
    word: "interesting",
    ipa: "/ˈɪntrəstɪŋ/",
    meaning: "interesante",
    seen: new Date("2024-01-06"),
    timesHeard: 8,
    createdAt: new Date("2024-01-06"),
  },
  {
    id: "11",
    word: "successful",
    ipa: "/səkˈsesfəl/",
    meaning: "exitoso",
    seen: new Date("2024-01-05"),
    timesHeard: 1,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "12",
    word: "responsible",
    ipa: "/rɪˈspɒnsəbəl/",
    meaning: "responsable",
    seen: new Date("2024-01-04"),
    timesHeard: 4,
    createdAt: new Date("2024-01-04"),
  },
  {
    id: "13",
    word: "incredible",
    ipa: "/ɪnˈkredəbəl/",
    meaning: "increíble",
    seen: new Date("2024-01-03"),
    timesHeard: 5,
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "14",
    word: "understand",
    ipa: "/ˌʌndəˈstænd/",
    meaning: "entender",
    seen: new Date("2024-01-02"),
    timesHeard: 9,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "15",
    word: "remember",
    ipa: "/rɪˈmembə/",
    meaning: "recordar",
    seen: new Date("2024-01-01"),
    timesHeard: 3,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "16",
    word: "development",
    ipa: "/dɪˈveləpmənt/",
    meaning: "desarrollo",
    seen: new Date("2023-12-31"),
    timesHeard: 2,
    createdAt: new Date("2023-12-31"),
  },
  {
    id: "17",
    word: "environment",
    ipa: "/ɪnˈvaɪrənmənt/",
    meaning: "ambiente, medio ambiente",
    seen: new Date("2023-12-30"),
    timesHeard: 6,
    createdAt: new Date("2023-12-30"),
  },
  {
    id: "18",
    word: "experience",
    ipa: "/ɪkˈspɪəriəns/",
    meaning: "experiencia",
    seen: new Date("2023-12-29"),
    timesHeard: 7,
    createdAt: new Date("2023-12-29"),
  },
  {
    id: "19",
    word: "opportunity",
    ipa: "/ˌɒpəˈtjuːnəti/",
    meaning: "oportunidad",
    seen: new Date("2023-12-28"),
    timesHeard: 1,
    createdAt: new Date("2023-12-28"),
  },
  {
    id: "20",
    word: "relationship",
    ipa: "/rɪˈleɪʃənʃɪp/",
    meaning: "relación",
    seen: new Date("2023-12-27"),
    timesHeard: 4,
    createdAt: new Date("2023-12-27"),
  },
]

export const useWordsStore = create<WordsState>()(
  persist(
    (set, get) => ({
      words: defaultWords,

      addWord: (wordData) => {
        const currentWords = get().words
        if (currentWords.length >= 20) {
          return // No agregar más de 20 palabras
        }

        const newWord: Word = {
          ...wordData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          timesHeard: 0,
        }
        set((state) => ({
          words: [newWord, ...state.words],
        }))
      },

      updateWord: (id, updates) => {
        set((state) => ({
          words: state.words.map((word) => (word.id === id ? { ...word, ...updates } : word)),
        }))
      },

      deleteWord: (id) => {
        set((state) => ({
          words: state.words.filter((word) => word.id !== id),
        }))
      },

      incrementHeard: (id) => {
        set((state) => ({
          words: state.words.map((word) => (word.id === id ? { ...word, timesHeard: word.timesHeard + 1 } : word)),
        }))
      },

      getWord: (id) => {
        return get().words.find((word) => word.id === id)
      },
    }),
    {
      name: "words-storage",
    },
  ),
)
