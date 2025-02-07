import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTimer } from "react-timer-hook"
import localforage from "localforage"
import { Preset } from "../types"
import { Summary } from "../types"

type TimerContextType = {
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

const TimerContext = createContext<TimerContextType | undefined>(undefined)

const defaultPresets: Preset[] = [
  { id: "1", name: "1分", seconds: 60 },
  { id: "2", name: "55秒", seconds: 55 },
  { id: "3", name: "1分5秒", seconds: 65 },
]

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [selectedPreset] = useState<Preset>(defaultPresets[0])
  const [sessionCount, setSessionCount] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [summaries, setSummaries] = useState<Summary[]>([])

  const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
    expiryTimestamp: new Date(Date.now() + selectedPreset.seconds * 1000),
    onExpire: handleTimerExpire,
    autoStart: false,
  })

  useEffect(() => {
    loadSessionInfo()
  }, [])

  async function loadSessionInfo() {
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
    minutes,
    seconds,
    isRunning,
    start,
    pause,
    restart,
    sessionCount,
    totalTime,
    addSession,
    summaries,
    saveSummary,
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