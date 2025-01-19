type SessionInfoProps = {
  sessionCount: number
  totalTime: number
}

export default function SessionInfo({ sessionCount, totalTime }: SessionInfoProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-primary">セッション情報</h2>
      <p className="mb-2">セット数: <span className="font-semibold">{sessionCount}</span></p>
      <p>合計時間: <span className="font-semibold">{formatTime(totalTime)}</span></p>
    </div>
  )
}

