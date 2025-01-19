import React, { useState } from 'react'
import { useTimerContext } from '../contexts/TimerContext'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Records() {
  const { sessionCount, totalTime } = useTimerContext()
  const [activeTab, setActiveTab] = useState('today')

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }

  const data = {
    labels: ['セット数', '実施時間 (分)', '実施回数'],
    datasets: [
      {
        label: '記録',
        data: [sessionCount, Math.floor(totalTime / 60), sessionCount],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-primary">実施記録</h2>
      <div className="flex mb-4">
        {['today', 'month', 'year'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {tab === 'today' ? '今日' : tab === 'month' ? '今月' : '今年'}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <p>セット数: {sessionCount}</p>
        <p>実施時間: {formatTime(totalTime)}</p>
        <p>実施回数: {sessionCount}</p>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

