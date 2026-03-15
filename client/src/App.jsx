import React from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'

// Main app content - shows login or dashboard based on auth state
function AppContent() {
  const { isAuthenticated } = useAuth()

  // If not logged in, show login page
  if (!isAuthenticated) {
    return <Login />
  }

  // If logged in, show the appropriate dashboard based on role
  // For now, we show the lecturer dashboard
  // TODO: Add role-based routing
  return (
    <div>
      <LecDashboard />
      {/* <StuDashboard /> */}
    </div>
  )
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
