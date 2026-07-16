import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import MyTasks from './pages/MyTasks'
import Completed from './pages/Completed'
import Pending from './pages/Pending'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { useTheme } from './context/ThemeContext'

export default function App() {
  const { theme } = useTheme()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: theme === 'dark' ? '#161B22' : '#FFFFFF',
            color: theme === 'dark' ? '#E6E8EB' : '#1A1D23',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#1E7F72', secondary: '#fff' } },
          error: { iconTheme: { primary: '#C1554A', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
