import { useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import AuthScreen from './components/auth/AuthScreen'
import AppShell from './components/layout/AppShell'
import DashboardOverview from './components/dashboard/DashboardOverview'
import ExamTracker from './components/exams/ExamTracker'
import DailyScheduler from './components/scheduler/DailyScheduler'

export default function App() {
  const { user, loading, init } = useAuthStore()
  const [activeView, setActiveView] = useState('dashboard')

  useEffect(() => {
    init()
  }, [init])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-plum-muted font-display">Loading Study Bloom…</p>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <AppShell activeView={activeView} onNavigate={setActiveView}>
      {activeView === 'dashboard' && <DashboardOverview />}
      {activeView === 'exams' && <ExamTracker />}
      {activeView === 'scheduler' && <DailyScheduler />}
    </AppShell>
  )
}
