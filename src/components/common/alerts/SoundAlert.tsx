import {Volume2, VolumeX } from "lucide-react"

type SoundAlertProps = {
  showSoundAlert: boolean;
}

export function SoundAlert({ showSoundAlert }: SoundAlertProps) {
  return (
    <>
      {showSoundAlert && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-fade-in-down">
          <Volume2 size={18} />
          <span className="text-sm">マナーモード時は通知音が鳴りません</span>
        </div>
      )}

      <div className="flex sm:hidden mt-2 mb-4 flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <VolumeX size={14} />
        <span>マナーモード時、通知音無効</span>
      </div>
    </>
  );
}