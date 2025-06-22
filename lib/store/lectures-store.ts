import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Lecture {
  id: string
  title: string
  content: string
  image: string
  createdAt: Date
  updatedAt: Date
  description?: string
}

interface LecturesState {
  lectures: Lecture[]
  selectedWords: string[]
  addLecture: (lecture: Omit<Lecture, "id" | "createdAt" | "updatedAt">) => void
  updateLecture: (id: string, lecture: Partial<Lecture>) => void
  deleteLecture: (id: string) => void
  getLecture: (id: string) => Lecture | undefined
  addSelectedWord: (word: string) => void
  removeSelectedWord: (word: string) => void
  clearSelectedWords: () => void
}

// Datos de ejemplo
const defaultLectures: Lecture[] = [
  {
    id: "1",
    title: "Introduction to English Grammar",
    content: `English grammar is the foundation of effective communication. Understanding the basic rules helps us construct meaningful sentences. 
    
    A sentence typically contains a subject and a predicate. The subject tells us who or what the sentence is about, while the predicate tells us what the subject does or is.
    
    For example, in the sentence "The cat sleeps," "the cat" is the subject and "sleeps" is the predicate. This simple structure forms the basis of all English sentences.
    
    Nouns are words that name people, places, things, or ideas. Common nouns like "book," "city," and "happiness" are not capitalized unless they begin a sentence. Proper nouns like "London," "Shakespeare," and "Monday" are always capitalized.
    
    Verbs express actions or states of being. Action verbs like "run," "write," and "think" show what someone or something does. Linking verbs like "is," "seem," and "become" connect the subject to additional information.`,
    image: "/placeholder.svg?height=200&width=300",
    description: "Learn the fundamentals of English grammar structure",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Advanced Vocabulary Building",
    content: `Building a robust vocabulary is essential for mastering any language. Advanced vocabulary allows for more precise expression and better comprehension of complex texts.
    
    Etymology, the study of word origins, can significantly enhance vocabulary acquisition. Many English words derive from Latin, Greek, French, and Germanic roots. Understanding these patterns helps predict meanings of unfamiliar words.
    
    Context clues are invaluable when encountering new vocabulary. Writers often provide definitions, examples, or synonyms within the surrounding text. Learning to identify these clues improves reading comprehension dramatically.
    
    Synonyms and antonyms expand expressive range. Instead of repeatedly using "good," consider alternatives like "excellent," "outstanding," "remarkable," or "exceptional." Each carries subtle differences in meaning and tone.
    
    Regular reading of diverse materials exposes learners to vocabulary in natural contexts. Academic journals, literature, newspapers, and magazines each offer unique lexical challenges and opportunities for growth.`,
    image: "/placeholder.svg?height=200&width=300",
    description: "Expand your vocabulary with advanced techniques",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "3",
    title: "Pronunciation and Phonetics",
    content: `Pronunciation is crucial for effective oral communication. English phonetics involves understanding how sounds are produced and how they combine to form words.
    
    The International Phonetic Alphabet (IPA) provides a standardized system for representing speech sounds. Each symbol corresponds to a specific sound, regardless of spelling variations.
    
    Stress patterns significantly affect meaning and comprehension. Word stress determines which syllable receives emphasis, while sentence stress highlights important information. Misplaced stress can lead to misunderstandings.
    
    Intonation patterns convey emotional and grammatical information. Rising intonation often indicates questions or uncertainty, while falling intonation suggests statements or completion.
    
    Connected speech phenomena like linking, reduction, and assimilation occur naturally in fluent speech. Understanding these patterns improves both listening comprehension and speaking fluency.`,
    image: "/placeholder.svg?height=200&width=300",
    description: "Master English pronunciation and phonetic patterns",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
]

export const useLecturesStore = create<LecturesState>()(
  persist(
    (set, get) => ({
      lectures: defaultLectures,
      selectedWords: [],

      addLecture: (lectureData) => {
        const newLecture: Lecture = {
          ...lectureData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          lectures: [newLecture, ...state.lectures],
        }))
      },

      updateLecture: (id, updates) => {
        set((state) => ({
          lectures: state.lectures.map((lecture) =>
            lecture.id === id ? { ...lecture, ...updates, updatedAt: new Date() } : lecture,
          ),
        }))
      },

      deleteLecture: (id) => {
        set((state) => ({
          lectures: state.lectures.filter((lecture) => lecture.id !== id),
        }))
      },

      getLecture: (id) => {
        return get().lectures.find((lecture) => lecture.id === id)
      },

      addSelectedWord: (word) => {
        set((state) => ({
          selectedWords: state.selectedWords.includes(word) ? state.selectedWords : [...state.selectedWords, word],
        }))
      },

      removeSelectedWord: (word) => {
        set((state) => ({
          selectedWords: state.selectedWords.filter((w) => w !== word),
        }))
      },

      clearSelectedWords: () => {
        set({ selectedWords: [] })
      },
    }),
    {
      name: "lectures-storage",
    },
  ),
)
