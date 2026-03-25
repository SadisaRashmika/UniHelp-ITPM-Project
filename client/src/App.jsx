import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'
import VimoHome from './pages/user-feedback/VimoHome'
import AdminDashboard from './pages/user-feedback/AdminDashboard'
import StudentDashboard from './pages/user-feedback/StudentDashboard'
import LectureDashboard from './pages/user-feedback/LectureDashboard'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/VimoHome" element={<VimoHome />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/lecture" element={<LectureDashboard />} />

        <Route path="/" element={<StuDashboard />} />
        <Route path="/resource-lec" element={<LecDashboard />} />
      </Routes>
    </Router>
  )
}

export default App