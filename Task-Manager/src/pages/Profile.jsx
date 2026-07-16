import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { updateProfile } from 'firebase/auth'
import { Mail, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'

export default function Profile() {
  const { user } = useAuth()
  const { stats } = useTasks()
  const [name, setName] = useState(user?.displayName || '')
  const [saving, setSaving] = useState(false)

  const initials = (user?.displayName || user?.email || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(user, { displayName: name })
      toast.success('Profile updated')
    } catch {
      toast.error('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Profile</h1>
      <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
        Manage how your account appears in Ledgr.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]"
      >
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-ink-soft/70 p-6 text-center shadow-card">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="font-display font-semibold">{user?.displayName || 'Unnamed'}</p>
            <p className="text-xs text-ledger-mutedLight dark:text-ledger-mutedDark">{user?.email}</p>
          </div>
          <div className="mt-2 grid w-full grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-accent/10 py-2">
              <p className="font-display text-lg font-semibold text-accent-dark dark:text-accent-light">{stats.total}</p>
              <p className="text-[10px] uppercase tracking-wide text-ledger-mutedLight dark:text-ledger-mutedDark">Tasks</p>
            </div>
            <div className="rounded-xl bg-amber/15 py-2">
              <p className="font-display text-lg font-semibold text-amber">{stats.completed}</p>
              <p className="text-[10px] uppercase tracking-wide text-ledger-mutedLight dark:text-ledger-mutedDark">Done</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-ink-soft/70 p-6 shadow-card">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
              Display name
            </label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
              <input value={user?.email || ''} disabled className="input-field pl-10 opacity-70" />
            </div>
            <p className="mt-1 text-xs text-ledger-mutedLight dark:text-ledger-mutedDark">
              Email changes aren&apos;t supported yet.
            </p>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
