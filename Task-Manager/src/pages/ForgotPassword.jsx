import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, NotebookPen } from 'lucide-react'
import Threads from '../components/Threads'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { mapAuthError } from './Login'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const { theme } = useTheme()
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await resetPassword(data.email)
      setSent(true)
      toast.success('Reset link sent — check your inbox.')
    } catch (err) {
      toast.error(mapAuthError(err.code))
    } finally {
      setSubmitting(false)
    }
  }

  const threadColor = theme === 'dark' ? [1, 1, 1] : [0.05, 0.06, 0.09]

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-paper dark:bg-ink">
      <div className="absolute inset-0">
        <Threads color={threadColor} amplitude={1.1} enableMouseInteraction />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-transparent to-paper/70 dark:from-ink/40 dark:via-transparent dark:to-ink/80" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel relative z-10 mx-4 w-full max-w-md rounded-3xl p-8 shadow-glass sm:p-10"
      >
        <Link to="/login" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-ledger-mutedLight hover:text-accent">
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-card">
            <NotebookPen size={22} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
            {sent ? 'Check your inbox for a reset link.' : "We'll email you a link to get back in."}
          </p>
        </div>

        {!sent ? (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Sending link...' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <Link to="/login" className="btn-primary mt-8 w-full">
            Return to login
          </Link>
        )}
      </motion.div>
    </div>
  )
}
