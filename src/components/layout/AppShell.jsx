import { LayoutGrid, BookOpen, CalendarClock } from 'lucide-react'
import Sidebar from './Sidebar'

const MOBILE_NAV = [
  { key: 'dashboard', label: 'Home', icon: LayoutGrid },
  { key: 'exams', label: 'Exams', icon: BookOpen },
  { key: 'scheduler', label: 'Plan', icon: CalendarClock },
]

export default function AppShell({ activeView, onNavigate, children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={activeView} onNavigate={onNavigate} />

      <main className="flex-1 px-4 sm:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-blush-100 flex justify-around py-2 z-40">
        {MOBILE_NAV.map(({ key, label, icon: Icon }) => {
          const active = activeView === key
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-xs font-medium ${
                active ? 'text-primary-dark' : 'text-plum-muted'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
