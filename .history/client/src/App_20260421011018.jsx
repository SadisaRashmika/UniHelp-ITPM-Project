import React from 'react'
import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'

import StudentDashboard from './pages/user-feedback/StudentDashboard'
import LectureDashboard from './pages/user-feedback/LectureDashboard'

import MainPortalPage from './pages/login-signin/MainPortalPage';
import AdminDashboard from './pages/admin/AdminDashboard';

import LecturerDashboard1 from './pages/academic-ticket/lecturerDashboard1';
import StudentDashboard1 from './pages/academic-ticket/studentDashboard1';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LecturerDashboard1 />} />
        <Route path="/student/dashboard" element={<StuDashboard />} />
        <Route path="/student/home" element={<MainPortalPage />} />
        <Route path="/student/resource" element={<MainPortalPage />} />
        <Route path="/student/timetable" element={<MainPortalPage />} />
        <Route path="/student/jobs" element={<MainPortalPage />} />
        <Route path="/student/support" element={<MainPortalPage />} />
        <Route path="/student/feedback" element={<MainPortalPage />} />
        <Route path="/lecturer/home" element={<MainPortalPage />} />
        <Route path="/lecturer/resource" element={<MainPortalPage />} />
        <Route path="/lecturer/timetable" element={<MainPortalPage />} />
        <Route path="/lecturer/jobs" element={<MainPortalPage />} />
        <Route path="/lecturer/support" element={<MainPortalPage />} />
        <Route path="/lecturer/feedback" element={<MainPortalPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/academic-ticket/lecturer-dashboard" element={<LecturerDashboard1 />} />
        <Route path="/academic-ticket/student-dashboard" element={<StudentDashboard1 />} />
        <Route path="/vimo/student" element={<StudentDashboard />} />
        <Route path="/vimo/lecture" element={<LectureDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;