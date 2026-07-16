import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import StatsCards from '../components/StatsCards'
import ParticleButton from '../components/ParticleButton'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../context/AuthContext'
import { sortTasks } from '../utils/taskUtils'

export default function Dashboard() {
  const { user } = useAuth()
  const { tasks, loading, stats, addTask, editTask, removeTask, toggleStatus } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)

  const recentTasks = useMemo(() => sortTasks(tasks, 'newest').slice(0, 6), [tasks])
  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0].split('@')[0]

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }
  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }
  const handleSubmit = async (data) => {
    if (editingTask) await editTask(editingTask.id, data)
    else await addTask(data)
  }
  const cycleStatus = (task) => {
    const order = ['Pending', 'In Progress', 'Completed']
    toggleStatus(task.id, order[(order.indexOf(task.status) + 1) % order.length])
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-semibold sm:text-3xl"
          >
            Welcome back, {firstName}
          </motion.h1>
          <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
            Here&apos;s where your work stands today.
          </p>
        </div>
        <ParticleButton onClick={openCreate}>Add Task</ParticleButton>
      </div>

      <div className="mt-6">
        <StatsCards stats={stats} />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold">Recent tasks</h2>
        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <EmptyState actionLabel="Add your first task" onAction={openCreate} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={setDeletingTask}
                  onStatusChange={cycleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialTask={editingTask} />
      <ConfirmDialog
        open={Boolean(deletingTask)}
        title="Delete this task?"
        description={`"${deletingTask?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete task"
        onConfirm={async () => {
          await removeTask(deletingTask.id)
          setDeletingTask(null)
        }}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  )
}
