import { motion } from 'framer-motion'

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center gap-3 text-ledger-mutedLight dark:text-ledger-mutedDark">
      <motion.div
        className="h-8 w-8 rounded-full border-2 border-accent/25 border-t-accent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
