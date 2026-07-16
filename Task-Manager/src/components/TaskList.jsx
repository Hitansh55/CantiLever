import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import ConfirmDialog from './ConfirmDialog'
import EmptyState from './EmptyState'
import ParticleButton from './ParticleButton'
import { useTasks } from '../hooks/useTasks'
import { useTaskSearch } from '../context/TaskSearchContext'
import { CATEGORIES, PRIORITIES, STATUSES, filterTasks, sortTasks } from '../utils/taskUtils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'alphabetical', label: 'Alphabetically' },
]

export default function TaskList({ fixedStatus, title, description }) {
  const { tasks, loading, addTask, editTask, removeTask, toggleStatus } = useTasks()
  const { search } = useTaskSearch()

  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState(fixedStatus || '')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, {
      search,
      status: fixedStatus || status,
      priority,
      category,
      dueDate,
    })
    return sortTasks(filtered, sortBy)
  }, [tasks, search, status, fixedStatus, priority, category, dueDate, sortBy])

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSubmit = async (data) => {
    if (editingTask) {
      await editTask(editingTask.id, data)
    } else {
      await addTask(data)
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!deletingTask) return
    await removeTask(deletingTask.id)
    setDeletingTask(null)
  }

  const cycleStatus = (task) => {
    const order = ['Pending', 'In Progress', 'Completed']
    const next = order[(order.indexOf(task.status) + 1) % order.length]
    toggleStatus(task.id, next)
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">{description}</p>
          )}
        </div>
        <ParticleButton onClick={openCreate}>Add Task</ParticleButton>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`btn-ghost text-xs ${showFilters ? 'border-accent text-accent' : ''}`}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        <div className="relative ml-auto">
          <ArrowDownUp size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tasks"
            className="input-field w-auto appearance-none py-2 pl-8 pr-8 text-xs"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-ink-soft/50 p-4 sm:grid-cols-4">
              {!fixedStatus && (
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field text-xs" aria-label="Filter by status">
                  <option value="">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field text-xs" aria-label="Filter by priority">
                <option value="">All priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field text-xs" aria-label="Filter by category">
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field text-xs"
                aria-label="Filter by due date"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
            ))}
          </div>
        ) : visibleTasks.length === 0 ? (
          <EmptyState
            title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            description={
              tasks.length === 0
                ? 'Create your first task to start filling your ledger.'
                : 'Try adjusting search, filters, or sort order.'
            }
            actionLabel={tasks.length === 0 ? 'Add your first task' : undefined}
            onAction={openCreate}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={setDeletingTask}
                  onStatusChange={cycleStatus}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialTask={editingTask} />

      <ConfirmDialog
        open={Boolean(deletingTask)}
        title="Delete this task?"
        description={`"${deletingTask?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete task"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  )
}
