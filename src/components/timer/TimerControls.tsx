import { Play, Pause, SkipForward } from "lucide-react"

type TimerControlsProps = {
  isRunning: boolean
  remainingSeconds: number
  totalSeconds: number
  completedSets: number[]
  handleStart: () => void
  handleNextSet: () => void
  handleExit: () => void
  currentSetNumber: number
  targetSets: number
}

export function TimerControls({
  isRunning,
  remainingSeconds,
  totalSeconds,
  completedSets,
  handleStart,
  handleNextSet,
  handleExit,
  currentSetNumber,
  targetSets
}: TimerControlsProps) {
  return (
    <>
      <button
        onClick={handleExit}
        className="absolute top-2 right-2 px-3 py-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        終了
      </button>

      <div className="text-center my-2 text-lg font-bold text-gray-800 dark:text-gray-200">
        セット {currentSetNumber} / {targetSets}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleStart}
          disabled={remainingSeconds === 0}
          className={`rounded-full w-32 h-32 flex items-center justify-center text-white ${
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
    </>
  )
}