import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { user, resetPassword } = useAuth()

  const handleResetPassword = async () => {
    try {
      await resetPassword(user.email)
      toast.success('Password reset email sent')
    } catch {
      toast.error('Could not send reset email')
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
        Tune Ledgr to how you like to work.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 max-w-xl space-y-4"
      >
        <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-ink-soft/70 p-6 shadow-card">
          <h2 className="font-display font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
            Switch between light and dark themes. Your preference is saved automatically.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
                theme === 'light' ? 'border-accent bg-accent/10 text-accent-dark' : 'border-black/10 dark:border-white/10'
              }`}
            >
              <Sun size={18} /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
                theme === 'dark' ? 'border-accent bg-accent/10 text-accent-light' : 'border-black/10 dark:border-white/10'
              }`}
            >
              <Moon size={18} /> Dark
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-ink-soft/70 p-6 shadow-card">
          <h2 className="font-display font-semibold">Account</h2>
          <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
            Signed in as <span className="font-medium text-ledger-text dark:text-ledger-textDark">{user?.email}</span>
          </p>
          <button onClick={handleResetPassword} className="btn-ghost mt-4">
            Send password reset email
          </button>
        </section>
      </motion.div>
    </div>
  )
}
