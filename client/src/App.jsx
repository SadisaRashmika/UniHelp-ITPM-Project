import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

// Main app content - shows login or dashboard based on auth state
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth()

  // If not logged in, show login page
  if (!isAuthenticated) {
    return <Login />
  }

  // Role-based routing - show appropriate dashboard based on user role
  if (user?.role === 'student') {
    return <StuDashboard user={user} onLogout={logout} />
  } else if (user?.role === 'admin') {
    // Admin sees admin dashboard
    return <AdminDashboard user={user} onLogout={logout} />
  } else {
    // Lecturer sees lecturer dashboard
    return <LecDashboard user={user} onLogout={logout} />
  }
}

// Root App component with AuthProvider and Router
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppContent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
