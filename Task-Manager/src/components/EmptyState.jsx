import { motion } from 'framer-motion'
import { NotebookPen } from 'lucide-react'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Add your first task and it will show up in this list.',
  actionLabel,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed
        border-black/10 dark:border-white/10 bg-white/50 dark:bg-ink-soft/40 px-8 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <NotebookPen size={22} />
      </div>
      <h3 className="text-lg font-display font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">{description}</p>
      {actionLabel && (
        <button onClick={onAction} className="btn-primary mt-2">
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}
