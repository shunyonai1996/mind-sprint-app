import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTimer } from "react-timer-hook"
import localforage from "localforage"
import { Preset } from "../types"

type Summary = {
  id: string
  date: Date
  setCount: number
  totalTime: number
  sets: {
    setNumber: number
    time: number
  }[]
}

type TimerContextType = {
  defaultPresets: Preset[]
  customPresets: Preset[]
  selectedPreset: Preset
  setSelectedPreset: (preset: Preset) => void
  setCustomPresets: (presets: Preset[]) => void
  minutes: number
  seconds: number
  isRunning: boolean
  start: () => void
  pause: () => void
  restart: (time: Date) => void
  sessionCount: number
  totalTime: number
  addSession: () => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  saveCustomPresets: (customPresets: Preset[]) => void
  summaries: Summary[]
  saveSummary: (summary: Omit<Summary, 'id' | 'date'>) => void
  saveSelectedPreset: (preset: Preset) => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

const defaultPresets: Preset[] = [
  { id: "1", name: "1分", seconds: 60 },
  { id: "2", name: "55秒", seconds: 55 },
  { id: "3", name: "1分5秒", seconds: 65 },
]

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [customPresets, setCustomPresets] = useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<Preset>(defaultPresets[0])
  const [sessionCount, setSessionCount] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [summaries, setSummaries] = useState<Summary[]>([])

  const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
    expiryTimestamp: new Date(Date.now() + selectedPreset.seconds * 1000),
    onExpire: handleTimerExpire,
    autoStart: false,
  })

  useEffect(() => {
    loadPresets()
    loadSessionInfo()
    loadSummaries()
    loadSelectedPreset()
  }, [])

  async function loadPresets() {
    const storedPresets = await localforage.getItem<Preset[]>("customPresets")
    if (storedPresets) {
      setCustomPresets(storedPresets)
    }
  }

  async function loadSessionInfo() {
    const storedSessionCount = await localforage.getItem<number>("sessionCount")
    const storedTotalTime = await localforage.getItem<number>("totalTime")
    if (storedSessionCount) setSessionCount(storedSessionCount)
    if (storedTotalTime) setTotalTime(storedTotalTime)
  }

  async function loadSummaries() {
    const storedSummaries = await localforage.getItem<Summary[]>("summaries")
    if (storedSummaries) {
      setSummaries(storedSummaries)
    }
  }

  async function loadSelectedPreset() {
    const storedSelectedPreset = await localforage.getItem<Preset>("selectedPreset")
    if (storedSelectedPreset) {
      setSelectedPreset(storedSelectedPreset)
    }
  }

  async function saveCustomPresets(customPresets: Preset[]) {
    await localforage.setItem("customPresets", customPresets)
  }

  async function saveSessionInfo() {
    await localforage.setItem("sessionCount", sessionCount)
    await localforage.setItem("totalTime", totalTime)
  }

  async function saveSelectedPreset(preset: Preset) {
    await localforage.setItem("selectedPreset", preset)
    setSelectedPreset(preset)
  }

  function handleTimerExpire() {
    addSession()
  }

  function addSession() {
    setSessionCount((prev) => prev + 1)
    setTotalTime((prev) => prev + selectedPreset.seconds)
    saveSessionInfo()
  }

  const saveSummary = async (newSummary: Omit<Summary, 'id' | 'date'>) => {
    const summary: Summary = {
      ...newSummary,
      id: crypto.randomUUID(),
      date: new Date()
    }
    setSummaries(prev => [...prev, summary])
    await localforage.setItem('summaries', [...summaries, summary])
  }

  const contextValue: TimerContextType = {
    defaultPresets,
    customPresets,
    selectedPreset,
    setSelectedPreset,
    setCustomPresets,
    minutes,
    seconds,
    isRunning,
    start,
    pause,
    restart,
    sessionCount,
    totalTime,
    addSession,
    theme,
    setTheme,
    saveCustomPresets,
    summaries,
    saveSummary,
    saveSelectedPreset
  }

  return <TimerContext.Provider value={contextValue}>{children}</TimerContext.Provider>
}

export function useTimerContext() {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error("useTimerContext must be used within a TimerProvider")
  }
  return context
}