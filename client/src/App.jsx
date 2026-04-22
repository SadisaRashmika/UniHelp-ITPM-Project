import React from 'react'
import LecDashboard from './pages/lecture-resource/LecDashboard'
import StuDashboard from './pages/lecture-resource/StuDashboard'

import StudentDashboard from './pages/user-feedback/StudentDashboard'
import LectureDashboard from './pages/user-feedback/LectureDashboard'

import MainPortalPage from './pages/login-signin/MainPortalPage';
import AdminDashboard from './pages/admin/AdminDashboard';

import LecturerDashboard1 from './pages/academic-ticket/lecturerDashboard1';
import StudentDashboard1 from './pages/academic-ticket/studentDashboard1';
import TasksPage from './components/academic-ticket/student-dashboard/TasksPage';
import Submissions from './components/academic-ticket/student-dashboard/Submissions';
import Career from './components/academic-ticket/student-dashboard/Career';
import Notifications from './components/academic-ticket/student-dashboard/Notifications';
import Resume from './components/academic-ticket/student-dashboard/Resume';
import Profile from './components/academic-ticket/student-dashboard/Profile';
import StudentOverview from './components/academic-ticket/student-dashboard/Overview';
import Overview from './components/academic-ticket/lec_dashboard/Overview';
import Quiz from './components/academic-ticket/lec_dashboard/Quiz';
import Practical from './components/academic-ticket/lec_dashboard/Practical';
import LecSubmissions from './components/academic-ticket/lec_dashboard/Submissions';
import Analytics from './components/academic-ticket/lec_dashboard/Analytics';
import Grades from './components/academic-ticket/lec_dashboard/Grades';
import StudentGrades from './components/academic-ticket/student-dashboard/Grades';
import { ThemeProvider } from './contexts/ThemeContext';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LecturerDashboard1 />} />
          <Route path="/student/dashboard" element={<StudentDashboard1 />} />
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
          <Route path="/academic-ticket/lec-dashboard/overview" element={<Overview />} />
          <Route path="/academic-ticket/lec-dashboard/quiz" element={<Quiz />} />
          <Route path="/academic-ticket/lec-dashboard/practical" element={<Practical />} />
          <Route path="/academic-ticket/lec-dashboard/submissions" element={<LecSubmissions />} />
          <Route path="/academic-ticket/lec-dashboard/analytics" element={<Analytics />} />
          <Route path="/academic-ticket/lec-dashboard/grades" element={<Grades />} />
          <Route path="/academic-ticket/student-dashboard" element={<StudentDashboard1 />} />
          <Route path="/academic-ticket/student-dashboard/tasks" element={<TasksPage />} />
          <Route path="/academic-ticket/student-dashboard/submissions" element={<Submissions />} />
          <Route path="/academic-ticket/student-dashboard/grades" element={<StudentGrades />} />
          <Route path="/academic-ticket/student-dashboard/career" element={<Career />} />
          <Route path="/academic-ticket/student-dashboard/notifications" element={<Notifications />} />
          <Route path="/academic-ticket/student-dashboard/resume" element={<Resume />} />
          <Route path="/academic-ticket/student-dashboard/overview" element={<StudentOverview />} />
          <Route path="/academic-ticket/studentdashboard" element={<Profile />} />
          <Route path="/vimo/student" element={<StudentDashboard />} />
          <Route path="/vimo/lecture" element={<LectureDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;