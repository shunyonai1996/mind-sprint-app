import React, { useState, useEffect } from "react"
import { useTimerContext } from "../contexts/TimerContext"
import { usePresetContext } from "../contexts/PresetContext"
import { useThemeContext } from "../contexts/ThemeContext"
import { TimerControls } from "./timer/TimerControls"
import { TimerDisplay } from "./timer/TimerDisplay"
import { ExitConfirmPopup, SummaryPopup } from "./popup/TimerPopups"
import AssociateLinks from "./AssociateLinks"
import "react-circular-progressbar/dist/styles.css"
import { useAudio } from "../hooks/useAudio"
import { SoundAlert } from "./alerts/SoundAlert"


export default function Start() {
  const { minutes, seconds, isRunning, pause, restart, addSession, saveSummary } = useTimerContext()
  const { selectedPreset } = usePresetContext()
  const { theme } = useThemeContext()
  const [showExitPopup, setShowExitPopup] = useState<boolean>(false)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [overTime, setOverTime] = useState<number>(0)
  const [showSummaryPopup, setShowSummaryPopup] = useState<boolean>(false)
  const { playSound } = useAudio()
  const [hasPlayedSound, setHasPlayedSound] = useState<boolean>(false)
  const [showSoundAlert, setShowSoundAlert] = useState<boolean>(false)

  const totalSeconds:number = selectedPreset.seconds
  const remainingSeconds:number = minutes * 60 + seconds
  const progress:number = ((totalSeconds - remainingSeconds) / totalSeconds) * 100

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

  const displayTime:number =
  remainingSeconds == 0 ? overTime : remainingSeconds;

  const timerColor:string =
  remainingSeconds == 0 ? "#ff4136" : theme === "dark" ? "#64b5f6" : "#4a90e2";

  const backgroundColor:string =
  theme === "dark" ? "#1a1a1a" : "#f5f7fa";

  function handleStart(): void {
    if (isRunning) {
      pause()
    } else {
      const time = new Date()
      time.setSeconds(time.getSeconds() + Math.max(0, remainingSeconds))
      restart(time)
    }
    if (!isRunning && window.innerWidth <= 480) {
      setShowSoundAlert(true)
      setTimeout(() => setShowSoundAlert(false), 3000)
    }
  }

  function handleNextSet(): void {
    const completedTime = (totalSeconds - remainingSeconds) + (remainingSeconds == 0 ? overTime : 0);
    setCompletedSets(prev => [...prev, completedTime])
    setOverTime(0);
    addSession()
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time)
  }

  function handleExit(): void {
    setShowExitPopup(true)
  }

  function confirmExit(): void {
    pause()
    const completedTime = (totalSeconds - remainingSeconds) + (remainingSeconds == 0 ? overTime : 0);
    if (completedTime > 0) {
      setCompletedSets(prev => [...prev, completedTime])
    }
    setShowExitPopup(false)
    setShowSummaryPopup(true)
  }

  function handleSummaryClose(save: boolean): void {
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
      <div
        className={`card ${isRunning ? "" : "opacity-75"} ${remainingSeconds == 0 ? "bg-red-100 dark:bg-red-900" : ""}`}
      >
        <TimerDisplay
          progress={progress}
          displayTime={displayTime}
          remainingSeconds={remainingSeconds}
          timerColor={timerColor}
          backgroundColor={backgroundColor}
          theme={theme}
        />

        <TimerControls
          isRunning={isRunning}
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          completedSets={completedSets}
          handleStart={handleStart}
          handleNextSet={handleNextSet}
          handleExit={handleExit}
        />

        {showExitPopup && (
          <ExitConfirmPopup
            confirmExit={confirmExit}
            onClose={setShowExitPopup}
          />
        )}

        {showSummaryPopup && (
          <SummaryPopup
            completedSets={completedSets}
            onClose={handleSummaryClose}
          />
        )}
      </div>

      <SoundAlert
        showSoundAlert={showSoundAlert}
      />

      <AssociateLinks />
    </div>
  )
}