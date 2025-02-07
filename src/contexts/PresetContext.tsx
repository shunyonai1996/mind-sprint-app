import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import localforage from "localforage"
import { Preset } from "../types"

type PresetContextType = {
  defaultPresets: Preset[]
  customPresets: Preset[]
  selectedPreset: Preset
  setSelectedPreset: (preset: Preset) => void
  setCustomPresets: (presets: Preset[]) => void
  saveCustomPresets: (customPresets: Preset[]) => void
  saveSelectedPreset: (preset: Preset) => void
}

const PresetContext = createContext<PresetContextType | undefined>(undefined)

const defaultPresets: Preset[] = [
  { id: "1", name: "1分", seconds: 60 },
  { id: "2", name: "55秒", seconds: 55 },
  { id: "3", name: "1分5秒", seconds: 65 },
]

export function PresetProvider({ children }: { children: React.ReactNode }){
  const [customPresets, setCustomPresets] = useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<Preset>(defaultPresets[0])

  useEffect(() => {
    loadPresets()
    loadSelectedPreset()
  }, [])

  async function loadPresets() {
    const storedPresets = await localforage.getItem<Preset[]>("customPresets")
    if (storedPresets) {
      setCustomPresets(storedPresets)
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

  async function saveSelectedPreset(preset: Preset) {
    await localforage.setItem("selectedPreset", preset)
    setSelectedPreset(preset)
  }

  const presetValue: PresetContextType = {
    defaultPresets,
    customPresets,
    selectedPreset,
    setSelectedPreset,
    setCustomPresets,
    saveCustomPresets,
    saveSelectedPreset,
  }

  return <PresetContext.Provider value={presetValue}>{children}</PresetContext.Provider>
}

export function usePresetContext() {
  const context = useContext(PresetContext)
  if (context === undefined) {
    throw new Error("usePresetContext must be used within a PresetProvider")
  }
  return context
}