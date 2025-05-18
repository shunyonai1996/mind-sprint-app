import { CircularProgressbar, buildStyles } from "react-circular-progressbar"

type TimerDisplayProps = {
  progress: number
  displayTime: number
  remainingSeconds: number
  timerColor: string
  backgroundColor: string
  theme: string
}

export const TimerDisplay = ({
  progress,
  displayTime,
  remainingSeconds,
  timerColor,
  backgroundColor,
  theme
}: TimerDisplayProps) => {
  return (
    <div className="w-72 h-72 mx-auto mt-0 mb-0">
      <CircularProgressbar
        value={progress}
        text={`${Math.floor(displayTime / 60).toString().padStart(2, "0")}:${(displayTime % 60).toString().padStart(2, "0")}`}
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
  )
}