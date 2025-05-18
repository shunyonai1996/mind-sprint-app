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
        <div className="mt-16 mb-4 mx-4">
            <select
                value={targetSets}
                onChange={(e) => setTargetSets(Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                disabled={isDisabled}
            >
                {SET_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
        </div>
    )
}