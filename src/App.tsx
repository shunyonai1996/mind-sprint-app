import React, { useState, useEffect } from 'react'
import { TimerProvider } from './contexts/TimerContext'
import Start from './components/Start'
import MyTimer from './components/MyTimer'
import Records from './components/Records'
import Navigation from './components/Navigation'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState('start')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <TimerProvider>
      <div className="min-h-screen bg-background text-text p-4 transition-colors duration-300">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">0秒思考特化タイマー『MindSprint』</h1>
          {activeSection === 'start' && <Start />}
          {activeSection === 'myTimer' && <MyTimer />}
          {activeSection === 'records' && <Records />}
          <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
      </div>
    </TimerProvider>
  )
}

