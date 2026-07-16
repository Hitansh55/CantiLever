import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

/**
 * ParticleButton — primary call-to-action button that bursts a shower
 * of small particles from its center on click, then fires onClick.
 */
export default function ParticleButton({
  onClick,
  children = 'Add Task',
  icon: Icon = Plus,
  disabled = false,
  loading = false,
  className = '',
}) {
  const [particles, setParticles] = useState([])
  const idRef = useRef(0)

  function burst() {
    const count = 14
    const next = Array.from({ length: count }).map(() => {
      idRef.current += 1
      const angle = Math.random() * Math.PI * 2
      const radius = 40 + Math.random() * 50
      return {
        id: idRef.current,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 3 + Math.random() * 4,
        duration: 0.5 + Math.random() * 0.4,
      }
    })
    setParticles((prev) => [...prev, ...next])
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !next.includes(p)))
    }, 900)
  }

  function handleClick(e) {
    if (disabled || loading) return
    burst()
    onClick?.(e)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={typeof children === 'string' ? children : 'Add task'}
      className={`relative inline-flex select-none items-center justify-center gap-2 overflow-visible rounded-xl
        bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all
        hover:bg-accent-dark hover:shadow-cardHover active:scale-95 disabled:opacity-60 disabled:pointer-events-none
        ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 overflow-visible">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute left-1/2 top-1/2 rounded-full bg-amber"
            style={{ width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
            transition={{ duration: p.duration, ease: 'easeOut' }}
          />
        ))}
      </span>
      {loading ? (
        <motion.span
          className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
        />
      ) : (
        <Icon size={16} strokeWidth={2.5} />
      )}
      <span>{children}</span>
    </button>
  )
}
