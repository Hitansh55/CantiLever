import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, NotebookPen, User } from 'lucide-react'
import Threads from '../components/Threads'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { GoogleIcon, mapAuthError } from './Login'

export default function Register() {
  const { register: registerUser, loginWithGoogle } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const password = watch('password')

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await registerUser(data.name, data.email, data.password)
      toast.success('Account created — welcome to Ledgr!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(mapAuthError(err.code))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
      toast.success('Signed in with Google')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(mapAuthError(err.code))
    }
  }

  const threadColor = theme === 'dark' ? [1, 1, 1] : [0.05, 0.06, 0.09]

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-paper dark:bg-ink py-10">
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
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-card">
            <NotebookPen size={22} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Create your ledger</h1>
          <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
            A calm, organized place to track your work.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
              Full name
            </label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                className="input-field pl-10"
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose">{errors.name.message}</p>}
          </div>

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

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight hover:text-accent"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
              Confirm password
            </label>
            <input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className="input-field"
              {...register('confirm', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            {errors.confirm && <p className="mt-1 text-xs text-rose">{errors.confirm.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          <span className="text-xs text-ledger-mutedLight dark:text-ledger-mutedDark">or</span>
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <button onClick={handleGoogle} className="btn-ghost w-full">
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
