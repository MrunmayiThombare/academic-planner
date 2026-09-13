import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { useExamStore } from '../../store/examStore'
import { useTaskStore } from '../../store/taskStore'
import ExamCountdown from '../exams/ExamCountdown'
import ProgressRing from './ProgressRing'
import AddItemModal from '../shared/AddItemModal'

export default function DashboardOverview() {
  const { exams, fetchExams } = useExamStore()
  const { tasks, fetchTasks, updateTaskStatus } = useTaskStore()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchExams()
    fetchTasks()
  }, [fetchExams, fetchTasks])

  const today = new Date().toISOString().slice(0, 10)
  const todaysTasks = useMemo(
    () => tasks.filter((t) => t.task_date === today),
    [tasks, today]
  )

  const upcomingExams = useMemo(
    () => exams.filter((e) => new Date(e.exam_date) >= new Date(today)).slice(0, 3),
    [exams, today]
  )

  const overallProgress = useMemo(() => {
    if (exams.length === 0) return 0
    const total = exams.reduce((sum, e) => sum + e.syllabus_coverage, 0)
    return total / exams.length
  }, [exams])

  const completedToday = todaysTasks.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold text-plum flex items-center gap-2">
            Hi there <Sparkles size={22} className="text-lilac" />
          </h1>
          <p className="text-plum-muted mt-1">{format(new Date(), 'EEEE, MMMM d')} — here's your day.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-bloom-gradient text-white font-medium shadow-soft hover:opacity-90 active:scale-95 transition"
        >
          + Quick add
        </button>
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl shadow-softer p-6 flex items-center gap-5 col-span-1">
          <ProgressRing percent={overallProgress} size={92} strokeWidth={9} />
          <div>
            <p className="text-sm text-plum-muted">Overall syllabus</p>
            <p className="font-display text-lg font-semibold text-plum">coverage</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-softer p-6 col-span-1">
          <p className="text-sm text-plum-muted mb-1">Today's tasks</p>
          <p className="font-display text-3xl font-semibold text-plum">
            {completedToday}
            <span className="text-lg text-plum-muted font-body"> / {todaysTasks.length} done</span>
          </p>
          <div className="mt-3 h-2 bg-blush-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-mint-dark rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: todaysTasks.length ? `${(completedToday / todaysTasks.length) * 100}%` : '0%',
              }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-softer p-6 col-span-1">
          <p className="text-sm text-plum-muted mb-1">Exams tracked</p>
          <p className="font-display text-3xl font-semibold text-plum">{exams.length}</p>
          <p className="text-xs text-plum-muted mt-3">
            {upcomingExams[0]
              ? `Next: ${upcomingExams[0].subject} on ${format(new Date(upcomingExams[0].exam_date), 'MMM d')}`
              : 'No upcoming exams yet'}
          </p>
        </div>
      </div>

      {/* Upcoming exams */}
      <section>
        <h2 className="text-xl font-display font-semibold text-plum mb-3">Upcoming exams</h2>
        {upcomingExams.length === 0 ? (
          <p className="text-sm text-plum-muted bg-white/60 rounded-2xl p-5 border border-dashed border-blush-200">
            No exams coming up — add one to see your countdown here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingExams.map((exam) => (
              <ExamCountdown key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </section>

      {/* Today's tasks */}
      <section>
        <h2 className="text-xl font-display font-semibold text-plum mb-3">Today's study tasks</h2>
        {todaysTasks.length === 0 ? (
          <p className="text-sm text-plum-muted bg-white/60 rounded-2xl p-5 border border-dashed border-blush-200">
            Nothing scheduled for today — add a task to plan your session.
          </p>
        ) : (
          <div className="bg-white rounded-3xl shadow-softer divide-y divide-blush-100">
            {todaysTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-blush-100/50 transition-colors first:rounded-t-3xl last:rounded-b-3xl"
              >
                {task.status === 'done' ? (
                  <CheckCircle2 size={20} className="text-mint-dark shrink-0" />
                ) : (
                  <Circle size={20} className="text-plum-muted/50 shrink-0" />
                )}
                <span
                  className={`flex-1 text-sm ${
                    task.status === 'done' ? 'line-through text-plum-muted' : 'text-plum'
                  }`}
                >
                  {task.title}
                </span>
                {task.start_time && (
                  <span className="text-xs text-plum-muted">{task.start_time.slice(0, 5)}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      <AddItemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultType="task" />
    </div>
  )
}
