import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  LayoutDashboard,
  ListChecks,
  LogOut,
  NotebookPen,
  Settings as SettingsIcon,
  User,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'My Tasks', icon: ListChecks },
  { to: '/completed', label: 'Completed', icon: CheckCircle2 },
  { to: '/pending', label: 'Pending', icon: Circle },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

function SidebarContent({ onNavigate }) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out — see you soon.')
    } catch {
      toast.error('Could not log out. Try again.')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-card">
          <NotebookPen size={18} />
        </div>
        <span className="font-display text-lg font-semibold">Ledgr</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent-dark dark:text-accent-light'
                  : 'text-ledger-mutedLight dark:text-ledger-mutedDark hover:bg-black/[0.04] dark:hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent"
                  />
                )}
                <item.icon size={17} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose
            transition-colors hover:bg-rose/10"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-black/5 dark:border-white/10 bg-white/70 dark:bg-ink-soft/60 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-paper dark:bg-ink-soft shadow-glass lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            >
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute right-4 top-5 rounded-lg p-1.5 text-ledger-mutedLight hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
