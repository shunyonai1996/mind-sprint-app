type ExitConfirmPopupProps = {
  confirmExit: () => void
  onClose: (value: boolean) => void
}

type SummaryPopupProps = {
  completedSets: number[]
  onClose: (save: boolean) => void
}

export function ExitConfirmPopup({ confirmExit, onClose }: ExitConfirmPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-10">
        <p className="text-black dark:text-white mb-4">終了しますか？</p>
        <div className="flex justify-center space-x-8">
          <button onClick={confirmExit} className="btn btn-primary">はい</button>
          <button onClick={() => onClose(false)} className="btn btn-secondary">いいえ</button>
        </div>
      </div>
    </div>
  )
}

export function SummaryPopup({ completedSets, onClose }: SummaryPopupProps) {
  return (
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
          onClick={() => onClose(false)}
          className="btn btn-secondary"
        >
          保存しない
        </button>
        <button
          onClick={() => onClose(true)}
          className="btn btn-primary"
        >
          保存する
        </button>
      </div>
    </div>
  </div>
  )
}