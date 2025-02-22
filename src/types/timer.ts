import { Summary } from './summary';
import { Preset } from './';

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

export type PresetContextType = {
  defaultPresets: Preset[]
  customPresets: Preset[]
  selectedPreset: Preset
  setSelectedPreset: (preset: Preset) => void
  setCustomPresets: (presets: Preset[]) => void
  saveCustomPresets: (customPresets: Preset[]) => void
  saveSelectedPreset: (preset: Preset) => void
}

export type ThemeContextType = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}