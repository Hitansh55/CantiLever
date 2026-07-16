import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, NotebookPen } from 'lucide-react'
import Threads from '../components/Threads'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const from = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
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
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(mapAuthError(err.code))
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
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-card">
            <NotebookPen size={22} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Ledgr</h1>
          <p className="mt-1 text-sm text-ledger-mutedLight dark:text-ledger-mutedDark">
            Welcome back. Your ledger is right where you left it.
          </p>
        </div>

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

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-medium text-ledger-mutedLight dark:text-ledger-mutedDark">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger-mutedLight" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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

          <label className="flex items-center gap-2 text-xs text-ledger-mutedLight dark:text-ledger-mutedDark">
            <input type="checkbox" className="h-4 w-4 rounded border-black/20 text-accent focus:ring-accent" {...register('remember')} />
            Remember me
          </label>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in...' : 'Log in'}
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
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.55c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.53H2.18v2.85A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.83 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.65-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.05l3.65 2.85C6.7 7.32 9.13 5.38 12 5.38z" />
    </svg>
  )
}

export function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/email-already-in-use':
      return 'An account already exists with that email.'
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a moment.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
