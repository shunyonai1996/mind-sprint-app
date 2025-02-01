import React, { useState } from 'react'
import { useTimerContext } from '../contexts/TimerContext'
import TimePickerWheel from './TimePickerWheel'
import { Trash2 } from 'lucide-react'
import { Preset } from '../types'

export default function MyTimer() {
  const { presets, selectedPreset, setSelectedPreset, setPresets } = useTimerContext()

  type Minutes = string
  type Seconds = string

  const [minutes, setMinutes] = useState<Minutes>('00')
  const [seconds, setSeconds] = useState<Seconds>('00')

  const minuteValues: Minutes[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
  const secondValues: Seconds[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  function handleAddPreset() {
    const minutesNum = parseInt(minutes, 10)
    const secondsNum = parseInt(seconds, 10)
    const totalSeconds = (minutesNum * 60) + secondsNum

    if (totalSeconds > 0) {
      const newPreset = {
        id: crypto.randomUUID(),
        name: `${minutesNum}分${secondsNum}秒`,
        seconds: totalSeconds,
      }
      const updatedPresets = [...presets, newPreset]
      setPresets(updatedPresets)
      setSelectedPreset(newPreset)
      setMinutes('')
      setSeconds('')
    } else {
      alert('1秒以上の時間を指定して下さい')
    }
  }

  function handleResetToDefault() {
    setSelectedPreset(presets[0])
  }

  function handleDeletePreset(preset: Preset) {
    const updatedPresets = presets.filter(p => p.name !== preset.name)
    setPresets(updatedPresets)

    if (selectedPreset.name === preset.name) {
      setSelectedPreset(updatedPresets[0])
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-primary">マイタイマー</h2>
      <div className="flex flex-col">
        <div className="flex justify-center gap-8 mb-4">
          <TimePickerWheel
            values={minuteValues}
            value={minutes}
            onChange={setMinutes}
            label="分"
          />
          <TimePickerWheel
            values={secondValues}
            value={seconds}
            onChange={setSeconds}
            label="秒"
          />
        </div>
        <div className="flex justify-center mb-8">
          <button onClick={handleAddPreset} className="btn btn-primary w-32">
            追加
          </button>
        </div>
      </div>
      <div className="flex flex-col mb-8">
        <h3 className="text-2xl font-bold mb-4 text-primary">カスタム一覧</h3>
        {presets.map((preset, index) => (
          <div key={preset.name} className="flex justify-between gap-2 ">
            <div onClick={() => setSelectedPreset(preset)} className="flex justify-center gap-2 items-center p-2 rounded-md">
              <span className="text-lg font-bold text-text">{index + 1}. </span>
              <span className="text-xl font-bold text-text">{preset.name}</span>
            </div>
            <div className="flex justify-center gap-2 items-center p-1 rounded-md">
              <button
                onClick={() => setSelectedPreset(preset)}
                className={`btn ${
                  selectedPreset.name === preset.name
                  ? 'btn-primary'
                  : 'btn-secondary'
                }`}
              >
                {selectedPreset.name === preset.name ? '設定中' : '選択'}
              </button>
              <button
                onClick={() => handleDeletePreset(preset)}
                className="btn btn-danger"
                aria-label="削除"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          ))}
        {/* </select> */}
      </div>
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={handleResetToDefault} className="btn btn-secondary">
          デフォルトに戻す
        </button>
      </div>
    </div>
  )
}

