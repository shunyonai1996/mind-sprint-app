import React from 'react'

const SET_OPTIONS = [
    { value: 5, label: "5セット" },
    { value: 10, label: "10セット" },
    { value: 15, label: "15セット" }
] as const

type SetSelectorProps = {
    targetSets: number
    setTargetSets: (sets: number) => void
    isDisabled: boolean
}

export function SetSelector({ targetSets, setTargetSets, isDisabled }: SetSelectorProps) {
    return (
        <div className="mt-6 mb-4">
            <div className="flex gap-2 justify-center">
                {SET_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setTargetSets(option.value)}
                        disabled={isDisabled}
                        className={`
                            px-4 py-2 rounded-lg font-medium transition-all
                            ${targetSets === option.value
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}