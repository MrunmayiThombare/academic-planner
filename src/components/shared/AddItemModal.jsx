import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ListTodo } from 'lucide-react'
import Modal from './Modal'
import { useExamStore } from '../../store/examStore'
import { useTaskStore } from '../../store/taskStore'

const SUBJECT_COLORS = ['#FF6F91', '#B892FF', '#68D391', '#FFC876', '#63B3ED']

export default function AddItemModal({ isOpen, onClose, defaultType = 'exam' }) {
  const [type, setType] = useState(defaultType)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const addExam = useExamStore((s) => s.addExam)
  const addTask = useTaskStore((s) => s.addTask)

  const [examForm, setExamForm] = useState({
    subject: '',
    exam_date: '',
    syllabus_coverage: 0,
    color: SUBJECT_COLORS[0],
    notes: '',
  })

  const [taskForm, setTaskForm] = useState({
    title: '',
    task_date: new Date().toISOString().slice(0, 10),
    start_time: '',
    end_time: '',
    priority: 'medium',
  })

  const resetAndClose = () => {
    setExamForm({ subject: '', exam_date: '', syllabus_coverage: 0, color: SUBJECT_COLORS[0], notes: '' })
    setTaskForm({ title: '', task_date: new Date().toISOString().slice(0, 10), start_time: '', end_time: '', priority: 'medium' })
    setFormError('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (type === 'exam') {
        if (!examForm.subject || !examForm.exam_date) {
          throw new Error('Please add a subject and exam date.')
        }
        await addExam(examForm)
      } else {
        if (!taskForm.title) {
          throw new Error('Please give your task a title.')
        }
        await addTask(taskForm)
      }
      resetAndClose()
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={type === 'exam' ? 'Add an exam' : 'Add a study task'}>
      {/* Type toggle */}
      <div className="flex gap-2 p-1 mb-6 bg-blush-100 rounded-full">
        {[
          { key: 'exam', label: 'Exam', icon: BookOpen },
          { key: 'task', label: 'Task', icon: ListTodo },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setType(key)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-colors ${
              type === key ? 'text-white' : 'text-plum-muted hover:text-plum'
            }`}
          >
            {type === key && (
              <motion.span
                layoutId="type-pill"
                className="absolute inset-0 bg-bloom-gradient rounded-full"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon size={16} /> {label}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'exam' ? (
          <>
            <Field label="Subject">
              <input
                type="text"
                value={examForm.subject}
                onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                placeholder="e.g. Organic Chemistry"
                className="input-field"
              />
            </Field>
            <Field label="Exam date">
              <input
                type="date"
                value={examForm.exam_date}
                onChange={(e) => setExamForm({ ...examForm, exam_date: e.target.value })}
                className="input-field"
              />
            </Field>
            <Field label={`Syllabus covered — ${examForm.syllabus_coverage}%`}>
              <input
                type="range"
                min="0"
                max="100"
                value={examForm.syllabus_coverage}
                onChange={(e) => setExamForm({ ...examForm, syllabus_coverage: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </Field>
            <Field label="Color tag">
              <div className="flex gap-2">
                {SUBJECT_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setExamForm({ ...examForm, color: c })}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      examForm.color === c ? 'scale-110 ring-2 ring-offset-2 ring-plum-muted' : ''
                    }`}
                    aria-label={`Choose color ${c}`}
                  />
                ))}
              </div>
            </Field>
          </>
        ) : (
          <>
            <Field label="Task title">
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Revise thermodynamics ch. 4"
                className="input-field"
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={taskForm.task_date}
                onChange={(e) => setTaskForm({ ...taskForm, task_date: e.target.value })}
                className="input-field"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start time">
                <input
                  type="time"
                  value={taskForm.start_time}
                  onChange={(e) => setTaskForm({ ...taskForm, start_time: e.target.value })}
                  className="input-field"
                />
              </Field>
              <Field label="End time">
                <input
                  type="time"
                  value={taskForm.end_time}
                  onChange={(e) => setTaskForm({ ...taskForm, end_time: e.target.value })}
                  className="input-field"
                />
              </Field>
            </div>
            <Field label="Priority">
              <div className="flex gap-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setTaskForm({ ...taskForm, priority: p })}
                    className={`flex-1 py-2 rounded-xl text-sm capitalize font-medium border transition-colors ${
                      taskForm.priority === p
                        ? 'bg-lilac text-white border-lilac'
                        : 'bg-white text-plum-muted border-blush-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {formError && <p className="text-sm text-primary-dark">{formError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 mt-2 rounded-2xl bg-bloom-gradient text-white font-display font-medium shadow-soft hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
        >
          {saving ? 'Saving…' : type === 'exam' ? 'Add exam' : 'Add task'}
        </button>
      </form>
    </Modal>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-sm font-medium text-plum-muted">{label}</span>
      {children}
    </label>
  )
}
