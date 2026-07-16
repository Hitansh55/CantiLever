import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { CATEGORIES, PRIORITIES, STATUSES } from '../utils/taskUtils'

export default function TaskModal({ open, onClose, onSubmit, initialTask }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      category: CATEGORIES[0],
      priority: 'Medium',
      status: 'Pending',
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        initialTask
          ? {
              title: initialTask.title || '',
              description: initialTask.description || '',
              dueDate: initialTask.dueDate || '',
              category: initialTask.category || CATEGORIES[0],
              priority: initialTask.priority || 'Medium',
              status: initialTask.status || 'Pending',
            }
          : {
              title: '',
              description: '',
              dueDate: '',
              category: CATEGORIES[0],
              priority: 'Medium',
              status: 'Pending',
            }
      )
    }
  }, [open, initialTask, reset])

  const submit = async (data) => {
    try {
      await onSubmit(data)
      toast.success(initialTask ? 'Task updated' : 'Task created')
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong saving your task.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="glass-panel max-h-full w-full max-w-lg overflow-y-auto rounded-3xl p-6 shadow-glass sm:p-8"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 id="task-modal-title" className="font-display text-xl font-semibold">
                {initialTask ? 'Edit task' : 'New task'}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-ledger-mutedLight hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
              <div>
                <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                  Title
                </label>
                <input
                  id="title"
                  className="input-field"
                  placeholder="Ship the quarterly report"
                  {...register('title', { required: 'Title is required', maxLength: { value: 80, message: 'Keep it under 80 characters' } })}
                />
                {errors.title && <p className="mt-1 text-xs text-rose">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Add any details worth remembering..."
                  {...register('description', { maxLength: { value: 500, message: 'Keep it under 500 characters' } })}
                />
                {errors.description && <p className="mt-1 text-xs text-rose">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                    Due date
                  </label>
                  <input id="dueDate" type="date" className="input-field" {...register('dueDate')} />
                </div>
                <div>
                  <label htmlFor="category" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                    Category
                  </label>
                  <select id="category" className="input-field" {...register('category')}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                    Priority
                  </label>
                  <select id="priority" className="input-field" {...register('priority')}>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                    Status
                  </label>
                  <select id="status" className="input-field" {...register('status')}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : 'Save task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
