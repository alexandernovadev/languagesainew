import { useState } from "react"

interface GeneratorFilters {
  topic: string
  level: string
  difficulty: string
  [key: string]: string
}

export function useGenerator(type: 'exam' | 'lecture') {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<GeneratorFilters>({
    topic: "",
    level: "",
    difficulty: "",
    ...(type === 'exam' ? { instructions: "" } : { objectives: "" })
  })

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsFilterOpen(false)
  }

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      topic: "",
      level: "",
      difficulty: "",
      ...(type === 'exam' ? { instructions: "" } : { objectives: "" })
    })
  }

  return {
    isFilterOpen,
    setIsFilterOpen,
    filters,
    updateFilter,
    handleFilterSubmit,
    resetFilters,
  }
} 