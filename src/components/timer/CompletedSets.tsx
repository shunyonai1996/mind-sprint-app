type CompletedSetsProps = {
  completedSets: number[]
}

export function CompletedSets({ completedSets }: CompletedSetsProps) {
  if (completedSets.length === 0) return null

  return (
    <div className="mt-4 text-center">
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">完了</h3>
      <ul className="space-y-2">
        {completedSets.map((time, index) => (
          <li
            key={index}
            className="text-base text-gray-600 dark:text-gray-300"
          >
            {`セット${index + 1}：${Math.floor(time / 60)}分${(time % 60).toString().padStart(2, "0")}秒`}
          </li>
        ))}
      </ul>
    </div>
  )
}