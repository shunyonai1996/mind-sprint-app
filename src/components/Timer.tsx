import { Preset } from '../types'

type TimerProps = {
  minutes: number
  seconds: number
  isRunning: boolean
  start: () => void
  pause: () => void
  restart: (time: Date) => void
  selectedPreset: Preset
}

export default function Timer({
  minutes,
  seconds,
  isRunning,
  start,
  pause,
  restart,
  selectedPreset,
}: TimerProps) {
  function handleStart() {
    if (isRunning) {
      pause()
    } else {
      const time = new Date()
      time.setSeconds(time.getSeconds() + selectedPreset.seconds)
      restart(time)
    }
  }

  return (
    <div className="text-center">
      <div className="timer-display mb-6">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <button
        onClick={handleStart}
        className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
      >
        {isRunning ? '一時停止' : 'スタート'}
      </button>
    </div>
  )
}

