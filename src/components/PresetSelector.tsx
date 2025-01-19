import { useState } from 'react'
import localforage from 'localforage'
import { Preset } from '../types'

type PresetSelectorProps = {
  presets: Preset[]
  selectedPreset: Preset
  setSelectedPreset: (preset: Preset) => void
  setPresets: (presets: Preset[]) => void
}

export default function PresetSelector({
  presets,
  selectedPreset,
  setSelectedPreset,
  setPresets,
}: PresetSelectorProps) {
  const [newPresetName, setNewPresetName] = useState('')
  const [newPresetSeconds, setNewPresetSeconds] = useState('')

  async function handleAddPreset() {
    if (newPresetName && newPresetSeconds) {
      const newPreset = {
        name: newPresetName,
        seconds: parseInt(newPresetSeconds),
      }
      const updatedPresets = [...presets, newPreset]
      setPresets(updatedPresets as Preset[])
      await localforage.setItem('presets', updatedPresets)
      setNewPresetName('')
      setNewPresetSeconds('')
    }
  }

  return (
    <div>
      <select
        value={selectedPreset.name}
        onChange={(e) => setSelectedPreset(presets.find(p => p.name === e.target.value) || presets[0])}
        className="select mb-4"
      >
        {presets.map((preset) => (
          <option key={preset.name} value={preset.name}>
            {preset.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          placeholder="新しいプリセット名"
          className="input flex-1"
        />
        <input
          type="number"
          value={newPresetSeconds}
          onChange={(e) => setNewPresetSeconds(e.target.value)}
          placeholder="秒数"
          className="input w-20"
        />
        <button
          onClick={handleAddPreset}
          className="btn btn-secondary"
        >
          追加
        </button>
      </div>
    </div>
  )
}

