import { motion } from 'framer-motion'
import { CheckCircle2, CircleDot, ListTodo, Timer } from 'lucide-react'

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total tasks', value: stats.total, icon: ListTodo, tint: 'text-accent bg-accent/10' },
    { label: 'Pending', value: stats.pending, icon: CircleDot, tint: 'text-ledger-mutedLight bg-ledger-mutedLight/10' },
    { label: 'In progress', value: stats.inProgress, icon: Timer, tint: 'text-amber bg-amber/15' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, tint: 'text-accent bg-accent/10' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.35 }}
          className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-ink-soft/70 p-5 shadow-card"
        >
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${c.tint}`}>
            <c.icon size={17} />
          </div>
          <p className="mt-3 font-display text-2xl font-semibold">{c.value}</p>
          <p className="text-xs text-ledger-mutedLight dark:text-ledger-mutedDark">{c.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
