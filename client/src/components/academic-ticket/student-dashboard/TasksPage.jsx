// Import React hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import Lucide React icons for UI components
import {
  FileText, // Document icon for tasks
  Clock, // Clock icon for deadlines
  CheckCircle, // Check icon for completed items
  AlertCircle, // Alert icon for notifications
  ChartColumnBig, // Chart icon for overview
  BookOpen, // Book icon for quiz
  Briefcase, // Briefcase icon for career
  Users, // Users icon for resume/profile
  Bell, // Bell icon for notifications
  Sun, // Sun icon for light mode
  Moon, // Moon icon for dark mode
  Send, // Send icon for submission
  Loader2, // Loading spinner icon
  X, // Close icon for modals
  Award, // Award icon for grades
  Calendar,
  MessageSquare,
  Globe
} from "lucide-react";
// Import React Router hooks for navigation
import { useNavigate } from "react-router-dom";
// Import Axios for HTTP requests to backend API
import axios from "axios";
import ModuleBrowser from "../shared/ModuleBrowser";
import ModuleDetail from "../shared/ModuleDetail";

// Base URL for API endpoints
const API_BASE = "http://localhost:5000/api/academic-ticket";

// Main TasksPage component for student dashboard
const TasksPage = () => {
  // React Router hook for navigation between pages
  const navigate = useNavigate();
  
  // State management for component
  const [activeTab, setActiveTab] = useState("tasks"); // Currently active sidebar tab
  const [lightMode, setLightMode] = useState(false); // Theme mode state (light/dark)
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [tasks, setTasks] = useState([]); // Array of tasks/quizzes from API
  const [selectedTask, setSelectedTask] = useState(null); // Currently selected task for modal
  const [answer, setAnswer] = useState(""); // Student's answer for selected task
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submission
  const [successMsg, setSuccessMsg] = useState(""); // Success message after submission
  const [selectedModule, setSelectedModule] = useState(null); // Currently selected module (student-specific)

  // Mock student information (in production, this would come from authentication)
  const student = { id: "STU001", name: "Alex Student" };

  // Sidebar navigation items configuration
  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: Globe, label: "Academic Explorer", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: Award, label: "Grades", link: "/academic-ticket/student-dashboard/grades", key: "grades" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  // Fetch tasks/quizzes from backend API
// Loads quiz data organized by faculty/intake/semester/module structure
const fetchTasks = async () => {
  try {
    setLoading(true); // Set loading state to true
    // Make API call to fetch student's quizzes from backend
    // Include student ID to get personalized quiz data
    const response = await axios.get(`${API_BASE}/quizzes?student_id=${student.id}`);
    setTasks(response.data); // Update tasks state with API response
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log error for debugging
  } finally {
    setLoading(false); // Always set loading to false when done
  }
};

// useEffect hook to fetch tasks when component mounts
useEffect(() => {
  fetchTasks(); // Call fetchTasks function on component mount
}, []); // Empty dependency array means this runs only once

// Handle sidebar navigation clicks
// Updates active tab and navigates to selected page
const handleSidebarClick = (item) => {
  setActiveTab(item.key); // Update active tab state
  navigate(item.link); // Navigate to selected page using React Router
};

// Handle quiz submission
// Sends student's answer to backend API
const handleSubmitQuiz = async () => {
  if (!answer.trim()) return; // Don't submit if answer is empty
  
  try {
    setIsSubmitting(true); // Set submitting state to true
    // Make API call to submit quiz answer
    await axios.post(`${API_BASE}/submissions`, {
      quiz_id: selectedTask.id, // ID of selected quiz
      student_id: student.id, // Student ID
      answer: answer // Student's answer text
    });
    
    setSuccessMsg("Submitted successfully!"); // Show success message
    setAnswer(""); // Clear answer input
    
    // Close modal and clear success message after 2 seconds
    setTimeout(() => {
      setSelectedTask(null); // Close modal
      setSuccessMsg(""); // Clear success message
    }, 2000);
    
  } catch (error) {
    console.error("Submission failed:", error); // Log error for debugging
  } finally {
    setIsSubmitting(false); // Always set submitting to false when done
  }
};

  // Main component render method
// Returns JSX structure for the tasks page
return (
  <div className="flex h-screen bg-transparent text-slate-900 ">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        {/* Sidebar header with logo and title */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Logo container with gradient background */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TSK</span>
            </div>

            {/* App name and description */}
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help</span>
              <p className="text-xs text-slate-400 mt-0.5">Tasks Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation menu items */}
        <nav className="flex-1 px-4 py-4">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-all ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-600 font-semibold" // Active state styling
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900" // Hover state styling
              }`}
            >
              {/* Navigation icon with conditional styling */}
              <item.icon size={17} className={activeTab === item.key ? "text-blue-500" : "text-slate-400"} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col p-8 overflow-auto bg-slate-50/30">
        <div className="max-w-7xl mx-auto w-full text-left">
          {selectedModule ? (
            <ModuleDetail 
              module={selectedModule} 
              onBack={() => setSelectedModule(null)} 
              role="student"
            />
          ) : (
            <>
              <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Explorer</h1>
                <p className="text-slate-500 mt-2 text-lg font-medium">Browse your courses and academic materials</p>
              </div>
              <ModuleBrowser onModuleSelect={(module) => setSelectedModule(module)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Card component for displaying statistics
// Used in header to show task counts
const Card = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className={`${colors[color]} px-6 py-3 rounded-2xl flex items-center gap-4`}>
      <Icon size={20} />
      <div>
        <p className="text-[10px] uppercase font-black opacity-60 tracking-wider">{title}</p>
        <p className="text-xl font-black leading-tight">{value}</p>
      </div>
    </div>
  );
};

export default TasksPage;