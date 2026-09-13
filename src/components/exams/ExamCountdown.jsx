import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useCountdown } from '../../hooks/useCountdown'

export default function ExamCountdown({ exam }) {
  const { days, hours, isPast } = useCountdown(exam.exam_date)
  const urgency = getUrgency(days, isPast)

  return (
    <motion.div
      layout
      className="relative overflow-hidden bg-white rounded-3xl shadow-softer p-5 border border-blush-100"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* subject color accent bar */}
      <span
        className="absolute top-0 left-0 h-1.5 w-full"
        style={{ backgroundColor: exam.color || '#FF6F91' }}
      />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-plum leading-tight">
            {exam.subject}
          </h3>
          <p className="text-xs text-plum-muted mt-0.5">
            {format(new Date(exam.exam_date), 'EEEE, MMM d')}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${urgency.badgeClass}`}
        >
          {isPast ? 'Done' : urgency.label}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          {isPast ? (
            <p className="text-sm text-plum-muted">Exam has passed</p>
          ) : (
            <p className="font-display text-3xl font-semibold text-plum">
              {days}
              <span className="text-base font-body font-normal text-plum-muted"> d </span>
              {hours}
              <span className="text-base font-body font-normal text-plum-muted"> h left</span>
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-plum-muted mb-1">Syllabus</p>
          <p className="font-display font-semibold text-plum">{exam.syllabus_coverage}%</p>
        </div>
      </div>

      {/* progress bar */}
      <div className="mt-3 h-2 w-full bg-blush-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${exam.syllabus_coverage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: exam.color || '#FF6F91' }}
        />
      </div>
    </motion.div>
  )
}

function getUrgency(days, isPast) {
  if (isPast) return { label: 'Done', badgeClass: 'bg-mint/30 text-plum' }
  if (days <= 2) return { label: 'Urgent', badgeClass: 'bg-primary/15 text-primary-dark' }
  if (days <= 7) return { label: 'Soon', badgeClass: 'bg-lilac/15 text-lilac-dark' }
  return { label: 'Upcoming', badgeClass: 'bg-blush-100 text-plum-muted' }
}
