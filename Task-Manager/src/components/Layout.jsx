import { useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { TaskSearchContext } from '../context/TaskSearchContext'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <TaskSearchContext.Provider value={{ search, setSearch }}>
      <div className="flex h-screen w-full overflow-hidden bg-paper dark:bg-ink">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setMobileOpen(true)} search={search} onSearchChange={setSearch} />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TaskSearchContext.Provider>
  )
}
