import { useEffect, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExamStore } from '../../store/examStore'
import ExamCountdown from './ExamCountdown'
import AddItemModal from '../shared/AddItemModal'

export default function ExamTracker() {
  const { exams, fetchExams, deleteExam, updateExam, loading } = useExamStore()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-display font-semibold text-plum">Your exams</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-bloom-gradient text-white text-sm font-medium shadow-softer hover:opacity-90 active:scale-95 transition"
        >
          <Plus size={16} /> Add exam
        </button>
      </div>

      {loading && exams.length === 0 && (
        <p className="text-plum-muted text-sm">Loading your exams…</p>
      )}

      {!loading && exams.length === 0 && (
        <EmptyState onAdd={() => setModalOpen(true)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {exams.map((exam) => (
            <motion.div
              key={exam.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative group"
            >
              <ExamCountdown exam={exam} />

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => deleteExam(exam.id)}
                  aria-label={`Delete ${exam.subject}`}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-primary/10 shadow-softer"
                >
                  <Trash2 size={14} className="text-primary-dark" />
                </button>
              </div>

              {/* Quick syllabus update slider */}
              <div className="mt-2 px-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={exam.syllabus_coverage}
                  onChange={(e) => updateExam(exam.id, { syllabus_coverage: Number(e.target.value) })}
                  className="w-full h-1 accent-primary"
                  aria-label={`Update syllabus coverage for ${exam.subject}`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AddItemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultType="exam" />
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-14 px-6 bg-white/60 rounded-3xl border border-dashed border-blush-200 mb-4">
      <p className="font-display text-lg text-plum mb-1">No exams yet</p>
      <p className="text-sm text-plum-muted mb-4">Add your first exam to start tracking your countdown.</p>
      <button
        onClick={onAdd}
        className="px-5 py-2 rounded-full bg-bloom-gradient text-white text-sm font-medium shadow-softer"
      >
        Add your first exam
      </button>
    </div>
  )
}
