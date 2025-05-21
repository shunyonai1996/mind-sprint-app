import React, { useState } from 'react'
import { TimerProvider, useTimerContext } from './contexts/TimerContext'
import { PresetProvider, usePresetContext } from './contexts/PresetContext'
import { SummaryProvider, useSummaryContext } from './contexts/SummaryContext'
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext'
import Timer from './components/timer/Timer'
import MyTimer from './components/preset/Preset'
import Summary from './components/summary/Summary'
import Navigation from './components/common/layout/Navigation'
import { Moon, Sun } from 'lucide-react'

function AppContent() {
  const { theme, setTheme } = useThemeContext()
  const [activeSection, setActiveSection] = useState<'start' | 'myTimer' | 'summary'>('start')

  return (
    <div className={`min-h-screen bg-background text-text p-4 pb-20 transition-colors duration-300 ${theme}`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <img src="/icon.png" alt="MindSprint" className="h-[2em] w-auto" />
            MindSprint
          </h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-3 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
        {activeSection === 'start' && <TimerProvider><PresetProvider><Timer /></PresetProvider></TimerProvider>}
        {activeSection === 'myTimer' && <PresetProvider><MyTimer /></PresetProvider>}
        {activeSection === 'summary' && <SummaryProvider><Summary /></SummaryProvider>}
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

