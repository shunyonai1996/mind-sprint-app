import React, { useState, useEffect } from "react"
import { useTimerContext } from "../contexts/TimerContext"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Play, Pause, SkipForward, Moon, Sun, X } from "lucide-react"
import moveNextSet from '/public/sound/move_next_set.mp3'

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer: AudioBuffer | null = null;

// 音声ファイルを事前にロード
async function loadSound() {
  try {
    const response = await fetch(moveNextSet);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error('音声ファイルのロードに失敗:', error);
  }
}

function playSound() {
  if (audioBuffer && audioContext) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
}

export default function Start() {
  const { minutes, seconds, isRunning, start, pause, restart, selectedPreset, addSession, theme, setTheme } =
    useTimerContext()
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [overTime, setOverTime] = useState(0)
  const [showSummaryPopup, setShowSummaryPopup] = useState(false)

  const totalSeconds = selectedPreset.seconds
  const remainingSeconds = minutes * 60 + seconds
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100

  // 0秒を下回った場合の経過時間を計算
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
    if (remainingSeconds == 0) {
      playSound()
    }
  }, [remainingSeconds])

  // selectedPresetが変更されたときにタイマーを更新するuseEffect
  useEffect(() => {
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time)
    pause()
  }, [selectedPreset])

  // 表示用の時間を計算
  const displayTime =
  remainingSeconds == 0 ? overTime : remainingSeconds;

  const timerColor = remainingSeconds == 0
    ? "#ff4136" // 経過時間表示中は赤色
    : theme === "dark"
    ? "#64b5f6" // ダークテーマ時
    : "#4a90e2"; // ライトテーマ時
  const backgroundColor = theme === "dark" ? "#1a1a1a" : "#f5f7fa"
  const textColor = theme === "dark" ? "#f5f5f5" : "#333333"

  function handleStart() {
    if (isRunning) {
      pause()
    } else {
      const time = new Date()
      time.setSeconds(time.getSeconds() + Math.max(0, remainingSeconds))
      restart(time)
    }
  }

  function handleNextSet() {
    console.log(totalSeconds)
    console.log(remainingSeconds)
    const completedTime = (totalSeconds - remainingSeconds) + (remainingSeconds == 0 ? overTime : 0);
    setCompletedSets((prev) => [...prev, completedTime])
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
    // 最後のセットの時間を計算して追加
    const completedTime = (totalSeconds - remainingSeconds) + (remainingSeconds == 0 ? overTime : 0);
    if (completedTime > 0) {  // 時間が0より大きい場合のみ追加
      setCompletedSets(prev => [...prev, completedTime])
    }
    setShowExitPopup(false)
    setShowSummaryPopup(true)
  }

  // コンポーネントのマウント時に音声をロード
  useEffect(() => {
    loadSound();
  }, []);

  useEffect(() => {
    // ユーザーの最初のインタラクション時にAudioContextを開始
    const handleUserInteraction = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  function handleSummaryClose() {
    setShowSummaryPopup(false)
    setCompletedSets([]) // 完了セットをクリア
    const time = new Date()
    time.setSeconds(time.getSeconds() + selectedPreset.seconds)
    restart(time) // タイマーを初期値に戻す
    pause() // タイマーを停止状態にする
  }

  return (
    <div className={`relative ${theme}`}>
      <div
        className={`card ${isRunning ? "" : "opacity-75"} ${remainingSeconds == 0 ? "bg-red-100 dark:bg-red-900" : ""}`}
      >
        <div className="w-72 h-72 mx-auto mt-0 mb-0">
          {/* 終了ボタン */}
          <button
            onClick={() => handleExit()}
            className="absolute top-1 left-1 px-4 py-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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

          {/* 時間制御 */}
          <div className="flex justify-between">
            <button
              onClick={handleStart}
              disabled={remainingSeconds === 0}
              className={`rounded-full w-32 h-32 flex items-center justify-center totalSeconds text-white ${
                remainingSeconds === 0 ? "bg-gray-400 cursor-not-allowed" : isRunning ? "bg-secondary" : "bg-primary"
              }`}
            >
              {isRunning ? <Pause size={48} /> : <Play size={48} />}
            </button>
            <button
              onClick={handleNextSet}
              disabled={totalSeconds === remainingSeconds && completedSets.length === 0}
              className={`rounded-full w-32 h-32 flex items-center justify-center text-white ${
                totalSeconds === remainingSeconds && completedSets.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-secondary"
              }`}
            >
              <SkipForward size={48} />
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

        {/* 終了POPUP */}
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

        {/* サマリーPOPUP */}
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
              <div className="flex justify-center">
                <button
                  onClick={handleSummaryClose}
                  className="btn btn-secondary"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}