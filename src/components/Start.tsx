import React, { useState } from 'react'
import { useTimerContext } from '../contexts/TimerContext'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function Start() {
  const { minutes, seconds, isRunning, start, pause, restart, selectedPreset, addSession } = useTimerContext()
  const [showExitPopup, setShowExitPopup] = useState(false)

  const totalSeconds = selectedPreset.seconds
  const remainingSeconds = minutes * 60 + seconds
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100

  function handleStart() {
    if (isRunning) {
      pause()
    } else {
      const time = new Date()
      time.setSeconds(time.getSeconds() + selectedPreset.seconds)
      restart(time)
    }
  }

  function handleNextSet() {
    addSession()
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time)
  }

  function handleExit() {
    setShowExitPopup(true)
  }

  function confirmExit() {
    pause()
    setShowExitPopup(false)
    // Add any additional logic for exiting the timer
  }

  return (
    <div className="relative">
      <div className={`card ${isRunning ? '' : 'opacity-75'} ${remainingSeconds < 0 ? 'bg-red-100 dark:bg-red-900' : ''}`}>
        <div className="w-64 h-64 mx-auto mb-6">
          <CircularProgressbar
            value={progress}
            text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            styles={buildStyles({
              textSize: '16px',
              pathTransitionDuration: 0.5,
              pathColor: `rgba(74, 144, 226, ${progress / 100})`,
              textColor: '#4a90e2',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button onClick={handleStart} className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}>
            {isRunning ? '一時停止' : 'スタート'}
          </button>
          <button onClick={handleNextSet} className="btn btn-secondary">
            次のセット
          </button>
          <button onClick={handleExit} className="btn btn-danger">
            ×
          </button>
        </div>
      </div>
      {showExitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <p className="mb-4">終了しますか？</p>
            <div className="flex justify-center space-x-4">
              <button onClick={confirmExit} className="btn btn-primary">
                はい
              </button>
              <button onClick={() => setShowExitPopup(false)} className="btn btn-secondary">
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

