type ExitConfirmPopupProps = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

type SummaryPopupProps = {
  isOpen: boolean
  completedSets: number[]
  onClose: (save: boolean) => void
}

export function ExitConfirmPopup({ isOpen, onConfirm, onCancel }: ExitConfirmPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-10">
        <p className="text-black dark:text-white mb-4">終了しますか？</p>
        <div className="flex justify-center space-x-8">
          <button onClick={onConfirm} className="btn btn-primary">はい</button>
          <button onClick={onCancel} className="btn btn-secondary">いいえ</button>
        </div>
      </div>
    </div>
  )
}

export function SummaryPopup({ isOpen, completedSets, onClose }: SummaryPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-96 max-w-[90%]">
        {/* ... existing summary popup content ... */}
      </div>
    </div>
  )
}