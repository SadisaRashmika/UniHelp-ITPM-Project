import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'
import StudentTimetable from './pages/timetable/StudentTimetable'
import LecturerTimetable from './pages/timetable/LecturerTimetable'

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'student') {
      return <Navigate to="/" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }
  
  return children
}

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

// Root App component with AuthProvider and Router
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/timetable" 
            element={
              <ProtectedRoute allowedRoles={['student', 'lecturer', 'admin']}>
                <TimetableRouter />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<AppContent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

// Router for timetable based on user role
function TimetableRouter() {
  const { user } = useAuth()
  
  if (user?.role === 'student') {
    return <StudentTimetable />
  } else {
    return <LecturerTimetable />
  }
}

export default App
