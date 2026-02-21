// import React from 'react'

// const App = () => {
//   return (
//     <div>
//       <NoteUploadForm.jsx/>
//     </div>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Student & Lecturer Dashboards
import StudentDashboard from "./modules/lecture-resource/pages/student/Dashboard";
import LecturerDashboard from "./modules/lecture-resource/pages/lecturer/Dashboard";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 mb-6">
          <Link className="text-blue-500 underline" to="/student">Student Dashboard</Link>
          <Link className="text-blue-500 underline" to="/lecturer">Lecturer Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/lecturer" element={<LecturerDashboard />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;