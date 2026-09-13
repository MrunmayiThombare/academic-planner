import { motion } from 'framer-motion'
import { LayoutGrid, BookOpen, CalendarClock, LogOut, Flower2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'exams', label: 'Exams', icon: BookOpen },
  { key: 'scheduler', label: 'Scheduler', icon: CalendarClock },
]

export default function Sidebar({ activeView, onNavigate }) {
  const signOut = useAuthStore((s) => s.signOut)

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-white/70 border-r border-blush-100 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-2xl bg-bloom-gradient flex items-center justify-center">
          <Flower2 size={18} className="text-white" />
        </div>
        <span className="font-display font-semibold text-lg text-plum">Study Bloom</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = activeView === key
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="relative w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-bloom-gradient-soft rounded-2xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className={`relative flex items-center gap-3 ${active ? 'text-primary-dark' : 'text-plum-muted'}`}>
                <Icon size={18} />
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      <button
        onClick={signOut}
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-plum-muted hover:bg-blush-100 transition-colors"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </aside>
  )
}
