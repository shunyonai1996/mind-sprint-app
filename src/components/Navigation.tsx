import React from 'react'

type NavigationProps = {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
      <ul className="flex justify-around">
        {['start', 'myTimer', 'summary'].map((section) => (
          <li key={section}>
            <button
              onClick={() => setActiveSection(section)}
              className={`p-4 ${activeSection === section ? 'text-primary' : 'text-gray-500'}`}
            >
              {section === 'start' ? 'スタート' : section === 'myTimer' ? 'マイタイマー' :  'サマリー'}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

