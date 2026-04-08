import React from 'react'
import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'
import VimoHome from './pages/user-feedback/VimoHome'
import StudentDashboard from './pages/user-feedback/StudentDashboard'
import LectureDashboard from './pages/user-feedback/LectureDashboard'

import MainPortalPage from './pages/login-signin/MainPortalPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPortalPage />} />
        <Route path="/student/home" element={<MainPortalPage />} />
        <Route path="/student/resource" element={<MainPortalPage />} />
        <Route path="/student/timetable" element={<MainPortalPage />} />
        <Route path="/student/jobs" element={<MainPortalPage />} />
        <Route path="/student/ticket" element={<MainPortalPage />} />
        <Route path="/lecturer/home" element={<MainPortalPage />} />
        <Route path="/lecturer/resource" element={<MainPortalPage />} />
        <Route path="/lecturer/timetable" element={<MainPortalPage />} />
        <Route path="/lecturer/jobs" element={<MainPortalPage />} />
        <Route path="/lecturer/ticket" element={<MainPortalPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/VimoHome" element={<VimoHome />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/lecture" element={<LectureDashboard />} />

        <Route path="/" element={<StuDashboard />} />
        <Route path="/resource-lec" element={<LecDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;