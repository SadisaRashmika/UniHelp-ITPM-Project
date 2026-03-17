import React from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'

// Main app content - shows login or dashboard based on auth state
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth()

  // If not logged in, show login page
  if (!isAuthenticated) {
    return <Login />
  }

  // Role-based routing - show appropriate dashboard based on user role
  // Admin also sees lecturer dashboard for now
  if (user?.role === 'student') {
    return <StuDashboard user={user} onLogout={logout} />
  } else {
    // Lecturer and Admin see lecturer dashboard
    return <LecDashboard user={user} onLogout={logout} />
  }
}

// Root App component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
