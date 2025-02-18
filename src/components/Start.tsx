import React, { useState, useEffect } from "react"
import { useTimerContext } from "../contexts/TimerContext"
import { usePresetContext } from "../contexts/PresetContext"
import { useThemeContext } from "../contexts/ThemeContext"
import AssociateLinks from "./AssociateLinks"
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useAudio } from '../hooks/useAudio'


export default function Start() {
  const { minutes, seconds, isRunning, pause, restart, addSession, saveSummary } = useTimerContext()
  const { selectedPreset } = usePresetContext()
  const { theme } = useThemeContext()
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [overTime, setOverTime] = useState(0)
  const [showSummaryPopup, setShowSummaryPopup] = useState(false)
  const { playSound } = useAudio()
  const [hasPlayedSound, setHasPlayedSound] = useState(false)
  const [showSoundAlert, setShowSoundAlert] = useState(false)

  const totalSeconds = selectedPreset.seconds
  const remainingSeconds = minutes * 60 + seconds
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100

  useEffect(() => {
    if (remainingSeconds == 0) {
      const interval = setInterval(() => {
        setOverTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setOverTime(0);
    }
  }, [remainingSeconds]);


  useEffect(() => {
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time)
    pause()
  }, [selectedPreset])

  useEffect(() => {
    if (remainingSeconds === 0 && !hasPlayedSound) {
      playSound()
      setHasPlayedSound(true)
    } else if (remainingSeconds > 0) {
      setHasPlayedSound(false)
    }
  }, [remainingSeconds, playSound, hasPlayedSound])

  const displayTime =
  remainingSeconds == 0 ? overTime : remainingSeconds;

  const timerColor = remainingSeconds == 0
    ? "#ff4136"
    : theme === "dark"
    ? "#64b5f6"
    : "#4a90e2";
  const backgroundColor = theme === "dark" ? "#1a1a1a" : "#f5f7fa"

  function handleStart() {
    if (isRunning) {
      pause()
    } else {
      const time = new Date()
      time.setSeconds(time.getSeconds() + Math.max(0, remainingSeconds))
      restart(time)
    }
    console.log(window.innerWidth)
    if (!isRunning && window.innerWidth <= 480) {
      setShowSoundAlert(true)
      setTimeout(() => setShowSoundAlert(false), 3000)
    }
  }

  function handleNextSet() {
    const completedTime = (totalSeconds - remainingSeconds) + (remainingSeconds == 0 ? overTime : 0);
    setCompletedSets(prev => [...prev, completedTime])
    setOverTime(0);
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
    const completedTime = (totalSeconds - remainingSeconds) + (remainingSeconds == 0 ? overTime : 0);
    if (completedTime > 0) {
      setCompletedSets(prev => [...prev, completedTime])
    }
    setShowExitPopup(false)
    setShowSummaryPopup(true)
  }

  function handleSummaryClose(save: boolean) {
    if (save) {
      const summary = {
        setCount: completedSets.length,
        totalTime: completedSets.reduce((acc, curr) => acc + curr, 0),
        sets: completedSets.map((time, index) => ({
          setNumber: index + 1,
          time
        }))
      }
      saveSummary(summary)
    }
    setShowSummaryPopup(false)
    setCompletedSets([])
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time)
    pause()
  }

  return (
    <div className={`relative ${theme}`}>
      {showSoundAlert && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-fade-in-down">
          <Volume2 size={18} />
          <span className="text-sm">マナーモード時は通知音が鳴りません</span>
        </div>
      )}
      <div
        className={`card ${isRunning ? "" : "opacity-75"} ${remainingSeconds == 0 ? "bg-red-100 dark:bg-red-900" : ""}`}
      >
        <div className="w-72 h-72 mx-auto mt-0 mb-0">
          <button
            onClick={() => handleExit()}
            className="absolute top-2 right-2 px-4 py-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            終了
          </button>

          {/* タイマー */}
          <CircularProgressbar
            value={progress}
            text={
              remainingSeconds == 0
                ? `-${Math.abs(Math.floor(displayTime / 60)).toString().padStart(2, "0")}:${Math.abs(displayTime % 60).toString().padStart(2, "0")}`
                : `${Math.floor(displayTime / 60).toString().padStart(2, "0")}:${(displayTime % 60).toString().padStart(2, "0")}`
            }
            styles={buildStyles({
              textSize: "16px",
              pathTransitionDuration: 0.3,
              pathColor: timerColor,
              textColor: timerColor,
              trailColor: theme === "dark" ? "#1a1a1a" : "#d6d6d6",
              backgroundColor: backgroundColor,
            })}
          />
        </div>

          <div className="flex justify-between">
            <button
              onClick={handleStart}
              disabled={remainingSeconds === 0}
              className={`rounded-full w-32 h-32 flex items-center justify-center totalSeconds text-white ${
                remainingSeconds === 0 ? "bg-gray-400 cursor-not-allowed" : isRunning ? "bg-secondary" : "bg-primary"
              }`}
            >
              {isRunning ? (
                <div className="flex flex-col items-center gap-1">
                  <Pause size={24} />
                  <p>ストップ</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Play size={24} />
                  <p>スタート</p>
                </div>
              )}
            </button>
            <button
              onClick={handleNextSet}
              disabled={totalSeconds === remainingSeconds && completedSets.length === 0}
              className={`rounded-full w-32 h-32 flex items-center justify-center text-white ${
                totalSeconds === remainingSeconds && completedSets.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-secondary"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <SkipForward size={24} />
                <p>次のセット</p>
              </div>
            </button>
          </div>
          {completedSets.length > 0 && (
            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">完了</h3>
              <ul className="space-y-2">
            {completedSets.map((time, index) => (
              <li
                key={index}
                className="text-base text-gray-600 dark:text-gray-300"
              >{`セット${index + 1}：${Math.floor(time / 60)}分${(time % 60).toString().padStart(2, "0")}秒`}</li>
            ))}
          </ul>
        </div>
        )}

        {showExitPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-10">
              <p className="text-black dark:text-white mb-4">終了しますか？</p>
              <div className="flex justify-center space-x-8">
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

        {showSummaryPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-96 max-w-[90%]">
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
                Summary
              </h2>
              <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
                メモの枚数：{completedSets.length}枚
              </h3>
              <div className="space-y-2 mb-6">
                {completedSets.map((time, index) => (
                  <p key={index} className="text-lg text-gray-600 dark:text-gray-300 text-center">
                    セット{index + 1}：{Math.floor(time / 60)}分{(time % 60).toString().padStart(2, "0")}秒
                  </p>
                ))}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleSummaryClose(false)}
                  className="btn btn-secondary"
                >
                  保存しない
                </button>
                <button
                  onClick={() => handleSummaryClose(true)}
                  className="btn btn-primary"
                >
                  保存する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="hidden sm:flex mt-2 mb-4 flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <VolumeX size={14} />
        <span>マナーモード時、通知音無効</span>
      </div>
      <AssociateLinks></AssociateLinks>
    </div>
  )
}