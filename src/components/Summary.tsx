import React, { useState, useMemo } from 'react'
import { useSummaryContext } from '../contexts/SummaryContext'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Summary() {
  const { summaries } = useSummaryContext()
  const [activeTab, setActiveTab] = useState('today')

  const filteredSummaries = useMemo(() => {
    const now = new Date()
    return summaries.filter(summary => {
      const summaryDate = new Date(summary.date)
      switch (activeTab) {
        case 'today':
          return summaryDate.toDateString() === now.toDateString()
        case 'month':
          return summaryDate.getMonth() === now.getMonth() &&
                 summaryDate.getFullYear() === now.getFullYear()
        case 'year':
          return summaryDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }, [summaries, activeTab])

  const memoizedChartData = useMemo(() => ({
    labels: ['セット数', '実施時間 (分)'],
    datasets: [{
      label: '記録',
      data: [
        filteredSummaries.reduce((acc, curr) => acc + curr.setCount, 0),
        Math.floor(filteredSummaries.reduce((acc, curr) => acc + curr.totalTime, 0) / 60)
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  }), [filteredSummaries])

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-primary">サマリー</h2>
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
        <h3 className="text-lg font-bold mb-2">実施履歴</h3>
        <div className="space-y-4">
          {filteredSummaries.map(summary => (
            <div key={summary.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {new Date(summary.date).toLocaleDateString('ja-JP')}
              </p>
              <p>
                セット数: <span className="font-bold">{summary.setCount}</span>
              </p>
              <p>
                合計時間: <span className="font-bold">{formatTime(summary.totalTime)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Bar data={memoizedChartData} options={options} />
      </div>
    </div>
  )
}

