import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTimer } from "react-timer-hook"
import localforage from "localforage"
import { Preset } from "../types"
type TimerContextType = {
  presets: Preset[]
  selectedPreset: Preset
  setSelectedPreset: (preset: Preset) => void
  setPresets: (presets: Preset[]) => void
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
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

const defaultPresets: Preset[] = [
  { id: "1", name: "1分", seconds: 60 },
  { id: "2", name: "55秒", seconds: 55 },
  { id: "3", name: "1分5秒", seconds: 65 },
]

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [presets, setPresets] = useState<Preset[]>(defaultPresets)
  const [selectedPreset, setSelectedPreset] = useState<Preset>(presets[0])
  const [sessionCount, setSessionCount] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
    expiryTimestamp: new Date(Date.now() + selectedPreset.seconds * 1000),
    onExpire: handleTimerExpire,
    autoStart: false,
  })

  useEffect(() => {
    loadPresetsFromStorage()
    loadSessionInfoFromStorage()
  }, [])

  async function loadPresetsFromStorage() {
    const storedPresets = await localforage.getItem<Preset[]>("presets")
    if (storedPresets) {
      setPresets([...defaultPresets, ...storedPresets])
    }
  }

  async function loadSessionInfoFromStorage() {
    const storedSessionCount = await localforage.getItem<number>("sessionCount")
    const storedTotalTime = await localforage.getItem<number>("totalTime")
    if (storedSessionCount) setSessionCount(storedSessionCount)
    if (storedTotalTime) setTotalTime(storedTotalTime)
  }

  async function saveSessionInfo() {
    await localforage.setItem("sessionCount", sessionCount)
    await localforage.setItem("totalTime", totalTime)
  }

  function handleTimerExpire() {
    addSession()
  }

  function addSession() {
    setSessionCount((prev) => prev + 1)
    setTotalTime((prev) => prev + selectedPreset.seconds)
    saveSessionInfo()
  }

  const contextValue: TimerContextType = {
    presets,
    selectedPreset,
    setSelectedPreset,
    setPresets,
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

