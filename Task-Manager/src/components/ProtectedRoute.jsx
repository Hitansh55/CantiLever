import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()

  if (initializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-paper dark:bg-ink">
        <Loader label="Checking your session..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
