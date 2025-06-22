import { useState } from "react"

interface GameStats {
  currentIndex: number
  totalItems: number
  completedItems: number[]
  progress: number
  correctAnswers: number
}

export function useGameStats(totalItems: number) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedItems, setCompletedItems] = useState<number[]>([])

  const progress = ((currentIndex + 1) / totalItems) * 100
  const correctAnswers = completedItems.length

  const next = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const markAsCompleted = (itemId: number) => {
    if (!completedItems.includes(itemId)) {
      setCompletedItems([...completedItems, itemId])
    }
  }

  const reset = () => {
    setCurrentIndex(0)
    setCompletedItems([])
  }

  return {
    currentIndex,
    totalItems,
    completedItems,
    progress,
    correctAnswers,
    next,
    previous,
    markAsCompleted,
    reset,
  }
} 