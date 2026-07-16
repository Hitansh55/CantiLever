import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-glass"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose/10 text-rose">
              <AlertTriangle size={18} />
            </div>
            <h3 id="confirm-title" className="mt-4 text-lg font-display font-semibold">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">{description}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-ghost" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="rounded-xl bg-rose px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose/90 active:scale-95"
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
