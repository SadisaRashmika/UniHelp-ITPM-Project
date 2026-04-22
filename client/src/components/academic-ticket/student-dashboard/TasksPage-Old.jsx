// src/pages/student-dashboard/Tasks.jsx
import React, { useState, useEffect } from "react";
import { ChartColumnBig, Users, Settings, Sun, Moon, Bell, BookOpen, Briefcase, FileText, Upload, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define studentAPI object with proper methods
const studentAPI = {
  getTasks: async (studentId) => {
    try {
      const response = await fetch(`/api/academic-ticket/tasks/student/${studentId}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("tasks");
  const [lightMode, setLightMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubmission, setShowSubmission] = useState(false);

  const navigate = useNavigate();

  // Sidebar items
  const sidebarItems = [  
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Tasks", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Submissions", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  useEffect(() => {
    // Fetch tasks from API
    const fetchTasks = async () => {
      try {
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const studentId = user.id;
        
        const tasksData = await studentAPI.getTasks(studentId);
        
        // Transform API data to match component structure
        const transformedTasks = tasksData.map(task => ({
          id: task.id,
          title: task.title,
          course: task.course_code || task.course,
          deadline: task.deadline,
          status: task.status === 'completed' ? 'completed' : 'pending',
          progress: task.status === 'completed' ? 100 : 20,
          description: task.description,
          lecturer: task.lecturer_name || "Dr. John Smith",
          task_type: task.task_type === 'quiz' ? 'quiz' : 'assignment',
          marks: task.marks || null,
          feedback: task.feedback || null,
          // For quizzes, add quiz-specific data
          total_questions: task.total_questions || task.totalQuestions || null,
          duration_minutes: task.duration_minutes || task.duration || null,
          max_marks: task.max_marks || task.maxMarks || null,
          // Additional fields for better display
          createdAt: task.createdAt || new Date().toISOString(),
          submissions: task.submissions || 0,
          gradedSubmissions: task.gradedSubmissions || 0
        }));
        
        setTasks(transformedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Fallback to mock data if API fails
        const mockTasks = [
          { 
            id: 1, 
            title: "Database Design Assignment", 
            course: "DBMS", 
            deadline: "2026-04-01", 
            status: "pending", 
            progress: 20,
            description: "Design a normalized database schema for a university management system",
            lecturer: "Dr. John Smith",
            task_type: "assignment"
          },
          { 
            id: 2, 
            title: "React Fundamentals Quiz", 
            course: "Web Dev", 
            deadline: "2026-04-15", 
            status: "pending", 
            progress: 0,
            description: "Test your knowledge of React basics including hooks and components",
            lecturer: "Prof. Sarah Johnson",
            task_type: "quiz",
            total_questions: 5,
            duration_minutes: 30
          },
          { 
            id: 3, 
            title: "IT Project Plan", 
            course: "ITPM", 
            deadline: "2026-04-10", 
            status: "pending", 
            progress: 40,
            description: "Create a comprehensive project plan for a software development project",
            lecturer: "Dr. Sarah Johnson",
            task_type: "assignment",
            marks: null,
            feedback: null
          },
          { 
            id: 4, 
            title: "Node.js API Development", 
            course: "Backend", 
            deadline: "2026-04-15", 
            status: "pending", 
            progress: 10,
            description: "Develop RESTful APIs using Node.js and Express framework",
            lecturer: "Dr. John Smith",
            task_type: "assignment",
            marks: null,
            feedback: null
          },
          { 
            id: 5, 
            title: "UI/UX Design Portfolio", 
            course: "Frontend", 
            deadline: "2026-04-20", 
            status: "completed", 
            progress: 100,
            description: "Create a portfolio showcasing your UI/UX design projects",
            lecturer: "Dr. Sarah Johnson",
            task_type: "project",
            marks: 92,
            feedback: "Outstanding design work! Very creative and professional portfolio presentation."
          }
        ];
        setTasks(mockTasks);
      }
    };

    fetchTasks();
    
    // Set up polling to check for new tasks every 30 seconds
    const interval = setInterval(fetchTasks, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    try {
      const studentId = "student-123";
      const tasksData = await studentAPI.getTasks(studentId);
      
      const transformedTasks = tasksData.map(task => ({
        id: task.id,
        title: task.title,
        course: task.course_code || task.course,
        deadline: task.deadline,
        status: task.status === 'completed' ? 'completed' : 'pending',
        progress: task.status === 'completed' ? 100 : 20,
        description: task.description,
        lecturer: task.lecturer_name || "Dr. John Smith",
        task_type: task.task_type === 'quiz' ? 'quiz' : 'assignment',
        marks: task.marks || null,
        feedback: task.feedback || null,
        total_questions: task.total_questions || task.totalQuestions || null,
        duration_minutes: task.duration_minutes || task.duration || null,
        max_marks: task.max_marks || task.maxMarks || null,
        createdAt: task.createdAt || new Date().toISOString(),
        submissions: task.submissions || 0,
        gradedSubmissions: task.gradedSubmissions || 0
      }));
      
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || task.status === filter)
  );

  const getStatusColor = (status) => {
    if (status === "completed") return "text-green-600 font-semibold";
    if (status === "pending") return "text-red-500 font-semibold";
    return "text-gray-500";
  };

  const handleSubmitTask = (task) => {
    setSelectedTask(task);
    setShowSubmission(true);
  };

  const handleTaskSubmit = async (submissionData) => {
    // API call to submit task would go here
    console.log('Submitting task:', submissionData);
    
    // Update task status to completed
    setTasks(prev => prev.map(task => 
      task.id === submissionData.taskId 
        ? { ...task, status: 'completed', progress: 100 }
        : task
    ));
    
    return Promise.resolve();
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Tasks</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-gray-900">Uni-Help System</span>
              <p className="text-xs text-gray-400 mt-0.5">Task Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-all text-left ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
              }`}
            >
              <item.icon size={17} className={activeTab === item.key ? "text-blue-500" : "text-gray-400"} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Sun
              onClick={() => setLightMode(true)}
              size={20}
              className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <Moon
              onClick={() => setLightMode(false)}
              size={20}
              className={`cursor-pointer ${!lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <span className="text-xs text-gray-400">Theme</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-gray-600">Manage and track all your academic tasks</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search size={16} />
            Refresh Tasks
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks by title, course, or lecturer..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* TASK SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{tasks.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{tasks.filter(t => t.status === "pending").length}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{tasks.filter(t => t.status === "completed").length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Due Soon</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{tasks.filter(t => {
                  const dueDate = new Date(t.deadline);
                  const today = new Date();
                  const diffTime = dueDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 3 && diffDays >= 0 && t.status === "pending";
                }).length}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* TASK TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Task List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grades</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{task.description}</div>
                        <div className="text-xs text-gray-400 mt-1"> {task.lecturer}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {task.course}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{task.deadline}</div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const dueDate = new Date(task.deadline);
                          const today = new Date();
                          const diffTime = dueDate - today;
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          
                          if (diffDays < 0) return <span className="text-red-600 font-medium">Overdue</span>;
                          if (diffDays === 0) return <span className="text-orange-600 font-medium">Due Today</span>;
                          if (diffDays === 1) return <span className="text-yellow-600 font-medium">Tomorrow</span>;
                          if (diffDays <= 3) return <span className="text-yellow-600 font-medium">{diffDays} days left</span>;
                          return <span className="text-green-600 font-medium">{diffDays} days left</span>;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${task.status === 'completed' ? 'green' : 'blue'}-600 h-2 rounded-full transition-all duration-300`} 
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {task.marks !== null && task.feedback !== null ? (
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{task.marks}/100</div>
                          <div className="text-xs text-gray-500">{task.feedback}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => task.task_type === 'quiz' 
                          ? navigate(`/academic-ticket/student-dashboard/quiz/${task.id}`)
                          : handleSubmitTask(task)
                        }
                        className={`text-xs px-3 py-1 rounded ${
                          task.task_type === 'quiz'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } transition-colors`}
                      >
                        {task.task_type === 'quiz' ? 'Start Quiz' : 'Submit Assignment'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TASK SUBMISSION MODAL */}
      {showSubmission && selectedTask && (
        <StuTaskSubmission
          task={selectedTask}
          isOpen={showSubmission}
          onClose={() => {
            setShowSubmission(false);
            setSelectedTask(null);
          }}
          onSubmit={handleTaskSubmit}
        />
      )}
    </div>
  );
};

export default Tasks;
