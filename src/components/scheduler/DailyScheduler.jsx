import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Clock } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import AddItemModal from '../shared/AddItemModal'

const COLUMNS = [
  { key: 'todo', label: 'To Do', dot: 'bg-primary' },
  { key: 'in_progress', label: 'In Progress', dot: 'bg-lilac' },
  { key: 'done', label: 'Done', dot: 'bg-mint-dark' },
]

const PRIORITY_STYLES = {
  low: 'bg-blush-100 text-plum-muted',
  medium: 'bg-lilac/15 text-lilac-dark',
  high: 'bg-primary/15 text-primary-dark',
}

export default function DailyScheduler() {
  const { tasks, fetchTasks, updateTaskStatus, deleteTask } = useTaskStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [dragTaskId, setDragTaskId] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDrop = (status) => {
    if (dragTaskId) {
      updateTaskStatus(dragTaskId, status)
      setDragTaskId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-display font-semibold text-plum">Daily scheduler</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-bloom-gradient text-white text-sm font-medium shadow-softer hover:opacity-90 active:scale-95 transition"
        >
          <Plus size={16} /> Add task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key)
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.key)}
              className="bg-white/70 rounded-3xl p-4 min-h-[320px] border border-blush-100"
            >
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="font-display font-medium text-plum">{col.label}</h3>
                <span className="text-xs text-plum-muted ml-auto">{colTasks.length}</span>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {colTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      draggable
                      onDragStart={() => setDragTaskId(task.id)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white rounded-2xl shadow-softer p-3.5 cursor-grab active:cursor-grabbing border border-blush-100"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-plum font-medium leading-snug">{task.title}</p>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 size={14} className="text-plum-muted hover:text-primary-dark" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        {task.start_time && (
                          <span className="flex items-center gap-1 text-[11px] text-plum-muted">
                            <Clock size={11} /> {task.start_time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colTasks.length === 0 && (
                  <p className="text-xs text-plum-muted text-center py-6">Drag tasks here</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AddItemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultType="task" />
    </div>
  )
}
