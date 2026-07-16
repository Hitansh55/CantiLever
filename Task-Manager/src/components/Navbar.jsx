import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ onMenuClick, search, onSearchChange }) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)

  const initials = (user?.displayName || user?.email || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-black/5 dark:border-white/10
      bg-paper/80 dark:bg-ink/80 backdrop-blur-xl px-4 py-3 sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-ledger-mutedLight hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="input-field pl-10"
          aria-label="Search tasks"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative sm:hidden">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="input-field w-32 pl-9 text-xs"
            aria-label="Search tasks"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotif((s) => !s)}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-ledger-mutedLight hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber" />
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="glass-panel absolute right-0 mt-2 w-64 rounded-xl p-4 text-sm shadow-glass"
              >
                <p className="font-medium">You&apos;re all caught up</p>
                <p className="mt-1 text-xs text-ledger-mutedLight dark:text-ledger-mutedDark">
                  No new notifications right now.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg
            text-ledger-mutedLight hover:bg-black/5 dark:hover:bg-white/10"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.span
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  )
}
