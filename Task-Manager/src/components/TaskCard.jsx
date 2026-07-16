import { motion } from 'framer-motion'
import { Calendar, Pencil, Tag, Trash2 } from 'lucide-react'
import { PRIORITY_STYLES, STATUS_BAR_COLOR, STATUS_STYLES, formatDate } from '../utils/taskUtils'

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
      className="group relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10
        bg-white/80 dark:bg-ink-soft/70 p-5 shadow-card transition-shadow hover:shadow-cardHover"
    >
      <span
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: STATUS_BAR_COLOR[task.priority] || '#1E7F72' }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold leading-snug">{task.title}</h3>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            className="rounded-lg p-1.5 text-ledger-mutedLight hover:bg-accent/10 hover:text-accent"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
            className="rounded-lg p-1.5 text-ledger-mutedLight hover:bg-rose/10 hover:text-rose"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`chip ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
        <button
          onClick={() => onStatusChange(task)}
          className={`chip ${STATUS_STYLES[task.status]} cursor-pointer transition hover:brightness-95`}
          title="Click to cycle status"
        >
          {task.status}
        </button>
        {task.category && (
          <span className="chip border border-black/10 dark:border-white/10 text-ledger-mutedLight dark:text-ledger-mutedDark">
            <Tag size={11} /> {task.category}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-ledger-mutedLight dark:text-ledger-mutedDark">
        <Calendar size={13} />
        {formatDate(task.dueDate)}
      </div>
    </motion.div>
  )
}
