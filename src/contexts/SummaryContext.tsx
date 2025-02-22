import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import localforage from "localforage"
import { Summary } from "../types/summary"

type SummaryContextType = {
  summaries: Summary[]
  setSummaries: (summaries: Summary[]) => void
  loadSummaries: () => Promise<void>
}

const SummaryContext = createContext<SummaryContextType | undefined>(undefined)

export function SummaryProvider({ children }: { children: React.ReactNode }) {
  const [summaries, setSummaries] = useState<Summary[]>([])

  useEffect(() => {
    loadSummaries()
  }, [])

  async function loadSummaries() {
    const storedSummaries = await localforage.getItem<Summary[]>("summaries")
    if (storedSummaries) {
      setSummaries(storedSummaries)
    }
  }

  const summaryValue: SummaryContextType = {
    summaries,
    setSummaries,
    loadSummaries,
  }

  return <SummaryContext.Provider value={summaryValue}>{children}</SummaryContext.Provider>
}

export function useSummaryContext() {
  const context = useContext(SummaryContext)
  if (context === undefined) {
    throw new Error("useSummaryContext must be used within a SummaryProvider")
  }
  return context
}