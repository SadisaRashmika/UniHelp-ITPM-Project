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
      </Routes>
    </BrowserRouter>
  );
};

export default App;