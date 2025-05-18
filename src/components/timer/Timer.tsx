import React, { useState, useEffect } from "react"
import { useTimerContext } from "../../contexts/TimerContext"
import { usePresetContext } from "../../contexts/PresetContext"
import { useThemeContext } from "../../contexts/ThemeContext"
import { TimerControls } from "./TimerControls"
import { TimerDisplay } from "./TimerDisplay"
import { ExitConfirmPopup, SummaryPopup } from "./popup/TimerPopups"
import AssociateLinks from "../associate/AssociateLinks"
import { useCountDownSound, useStartSound, useFinishSound } from "../../hooks/useAudio"
import { SoundAlert } from "../common/alerts/SoundAlert"
import { SetSelector } from "./SetSelector"
import "react-circular-progressbar/dist/styles.css"

export default function Start() {
  const { minutes, seconds, isRunning, pause, restart, addSession, saveSummary } = useTimerContext()
  const { selectedPreset } = usePresetContext()
  const { theme } = useThemeContext()
  const [showExitPopup, setShowExitPopup] = useState<boolean>(false)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [showSummaryPopup, setShowSummaryPopup] = useState<boolean>(false)
  const { playSound: playCountDown } = useCountDownSound()
  const { playSound: playFinish } = useFinishSound()
  const { playSound: playStart } = useStartSound()
  const [hasPlayedSound, setHasPlayedSound] = useState<boolean>(false)
  const [showSoundAlert, setShowSoundAlert] = useState<boolean>(false)
  const [currentSetNumber, setCurrentSetNumber] = useState<number>(1)
  const [targetSets, setTargetSets] = useState<number>(10)

  const totalSeconds:number = selectedPreset.seconds
  const remainingSeconds:number = minutes * 60 + seconds
  const progress:number = ((totalSeconds - remainingSeconds) / totalSeconds) * 100

  useEffect(() => {
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time)
    pause()
    setCurrentSetNumber(1)
  }, [selectedPreset])

  useEffect(() => {
    if (remainingSeconds <= 3 && remainingSeconds > 0 && isRunning) {
        playCountDown()
    } else if (remainingSeconds == 0 && !isRunning) {
        playFinish()
    }
  }, [remainingSeconds, isRunning])

  useEffect(() => {
    if (remainingSeconds === 0 && !hasPlayedSound) {
      setHasPlayedSound(true)
      const timeout = setTimeout(() => {
        handleNextSet()
      }, 1000)
      return () => clearTimeout(timeout)
    } else if (remainingSeconds > 0) {
      setHasPlayedSound(false)
    }
  }, [remainingSeconds])

  const displayTime:number = remainingSeconds

  const timerColor:string = remainingSeconds <= 3 ? "#ff4136" : theme === "dark" ? "#64b5f6" : "#4a90e2";

  const backgroundColor:string = theme === "dark" ? "#1a1a1a" : "#f5f7fa";

  function handleStart(): void {
    if (isRunning) {
      pause()
    } else {
      playStart()
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
    const completedTime = totalSeconds - remainingSeconds
    setCompletedSets(prev => [...prev, completedTime])

    const nextSetNumber = currentSetNumber + 1
    setCurrentSetNumber(nextSetNumber)

    if (nextSetNumber > targetSets) {
      confirmExit()
      return
    }

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
    const completedTime = totalSeconds - remainingSeconds
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
    setCurrentSetNumber(1)
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time)
    pause()
  }

  return (
    <div className={`relative ${theme}`}>
      <div
        className={`card ${isRunning ? "" : "opacity-75"} ${remainingSeconds <= 3 ? "bg-red-100 dark:bg-red-900" : ""}`}
      >
        <SetSelector
          targetSets={targetSets}
          setTargetSets={setTargetSets}
          isDisabled={isRunning || currentSetNumber > 1}
        />

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
          currentSetNumber={currentSetNumber}
          targetSets={targetSets}
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