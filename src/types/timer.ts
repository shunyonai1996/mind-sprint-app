export type TimerContextType = {
  minutes: number
  seconds: number
  isRunning: boolean
  start: () => void
  pause: () => void
  restart: (time: Date) => void
  sessionCount: number
  totalTime: number
  addSession: () => void
  summaries: Summary[]
  saveSummary: (summary: Omit<Summary, 'id' | 'date'>) => void
}

export type Summary = {
  setCount: number
  totalTime: number
  sets: {
    setNumber: number
    time: number
  }[]
}

export type PresetContextType = {
  selectedPreset: {
    seconds: number
  }
}

export type ThemeContextType = {
  theme: string
}