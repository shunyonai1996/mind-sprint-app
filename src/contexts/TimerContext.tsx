import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTimer } from "react-timer-hook"
import localforage from "localforage"
import { Preset } from "../types"
import { Summary } from "../types/summary"
import { TimerContextType } from "../types/timer"

const TimerContext = createContext<TimerContextType | null>(null)

const defaultPresets: Preset[] = [
  { id: "1", name: "1分", seconds: 60 },
  { id: "2", name: "55秒", seconds: 55 },
  { id: "3", name: "1分5秒", seconds: 65 },
]

export function TimerProvider({ children }: { children: React.ReactNode }): JSX.Element {
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

  async function loadSessionInfo(): Promise<void> {
    const storedSessionCount = await localforage.getItem<number>("sessionCount")
    const storedTotalTime = await localforage.getItem<number>("totalTime")
    if (storedSessionCount) setSessionCount(storedSessionCount)
    if (storedTotalTime) setTotalTime(storedTotalTime)
  }

  async function saveSessionInfo(): Promise<void> {
    await localforage.setItem("sessionCount", sessionCount)
    await localforage.setItem("totalTime", totalTime)
  }

  function handleTimerExpire(): void {
    addSession()
  }

  function addSession(): void {
    setSessionCount((prev) => prev + 1)
    setTotalTime((prev) => prev + selectedPreset.seconds)
    saveSessionInfo()
  }

  async function saveSummary(newSummary: Omit<Summary, 'id' | 'date'>): Promise<void> {
    const summary: Summary = {
      ...newSummary,
      id: crypto.randomUUID(),
      date: new Date()
    }
    const storedSummaries = await localforage.getItem<Summary[]>("summaries")
    setSummaries(storedSummaries || [])
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

export const useTimerContext = (): TimerContextType => {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider')
  }
  return context
}