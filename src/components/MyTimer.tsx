import React, { useState } from 'react'
import { useTimerContext } from '../contexts/TimerContext'

export default function MyTimer() {
  const { presets, selectedPreset, setSelectedPreset, setPresets } = useTimerContext()
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')

  function handleAddPreset() {
    if (minutes || seconds) {
      const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds)
      const newPreset = {
        name: `${minutes}分${seconds}秒`,
        seconds: totalSeconds,
      }
      const updatedPresets = [...presets, newPreset]
      setPresets(updatedPresets)
      setSelectedPreset(newPreset)
      setMinutes('')
      setSeconds('')
    }
  }

  function handleResetToDefault() {
    setSelectedPreset(presets[0])
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-primary">マイタイマー</h2>
      <div className="mb-4">
        <p>現在のプリセット: {selectedPreset.name}</p>
        <button onClick={handleResetToDefault} className="btn btn-secondary mt-2">
          デフォルトに戻す
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="分"
          className="input flex-1"
        />
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          placeholder="秒"
          className="input flex-1"
        />
        <button onClick={handleAddPreset} className="btn btn-primary">
          追加
        </button>
      </div>
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="300"
          value={selectedPreset.seconds}
          onChange={(e) => {
            const seconds = parseInt(e.target.value)
            setSelectedPreset({ name: `${Math.floor(seconds / 60)}分${seconds % 60}秒`, seconds })
          }}
          className="w-full"
        />
      </div>
      <select
        value={selectedPreset.name}
        onChange={(e) => setSelectedPreset(presets.find(p => p.name === e.target.value) || presets[0])}
        className="select w-full"
      >
        {presets.map((preset) => (
          <option key={preset.name} value={preset.name}>
            {preset.name}
          </option>
        ))}
      </select>
    </div>
  )
}

