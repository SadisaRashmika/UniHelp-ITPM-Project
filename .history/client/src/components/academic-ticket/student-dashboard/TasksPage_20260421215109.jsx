import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Calendar, Clock, AlertCircle, CheckCircle, FileText, Brain, Activity, BookOpen, Palette } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

const TasksPage = () => {
  const { currentTheme, toggleLightMode, updateColorPalette, allPalettes } = useTheme();
  
  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id;

  // Fetch tasks (using mock data for now)
  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Use mock data directly to avoid API errors
      const mockTasks = [
        {
          id: 1,
          title: "Data Structures Assignment",
          description: "Implement binary search tree with insertion, deletion, and traversal operations",
          type: "practical",
          course: "CS201",
          module_code: "CS201",
          module_name: "Data Structures & Algorithms",
          due_date: "2024-04-10",
          due_time: "11:59 PM",
          status: "pending",
          week_number: 8,
          max_attempts: 3,
          created_at: "2024-03-28T10:00:00Z",
          is_active: true
        },
                {
          id: 3,
          title: "Database Design Project",
          description: "Design and implement a relational database schema for a university management system",
          type: "practical",
          course: "CS203",
          module_code: "CS203",
          module_name: "Database Systems",
          due_date: "2024-04-15",
          due_time: "5:00 PM",
          status: "pending",
          week_number: 9,
          max_attempts: 1,
          created_at: "2024-03-28T10:00:00Z",
          is_active: true
        },
                {
          id: 5,
          title: "React Components Practical",
          description: "Build responsive React components with hooks and state management",
          type: "practical",
          course: "IT213",
          module_code: "IT213",
          module_name: "Web Development",
          due_date: "2024-04-05",
          due_time: "11:59 PM",
          status: "completed",
          week_number: 7,
          max_attempts: 2,
          created_at: "2024-03-21T10:00:00Z",
          is_active: true
        }
      ];
      
      setTasks(mockTasks);
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [studentId]);

  // Separate quizzes and practicals from fetched tasks
  const quizzes = tasks.filter(task => task.type === 'quiz');
  const practicals = tasks.filter(task => task.type === 'practical');

  return (
    <div className="flex-1 flex flex-col overflow-auto">
        {/* HEADER */}
      <header className={`${currentTheme.secondary} border-b border-gray-200 px-6 py-4`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TASKS</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your assignments and quizzes</p>
          </div>
          <div className="flex items-center gap-4">
                        
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
              <p className="text-xs text-gray-500">Computer Science</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AJ
            </div>
          </div>
        </div>
      </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-500">Loading tasks...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-500">Error loading tasks</p>
                <button 
                  onClick={fetchTasks}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Total Tasks</h3>
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                  <p className="text-sm text-gray-500">All assignments</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{tasks.filter(t => t.status === 'pending').length}</p>
                  <p className="text-sm text-gray-500">Need attention</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{tasks.filter(t => t.status === 'completed').length}</p>
                  <p className="text-sm text-gray-500">Finished work</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Due Soon</h3>
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{tasks.filter(t => {
                    const dueDate = new Date(t.deadline);
                    const today = new Date();
                    const diffTime = dueDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 3 && diffDays >= 0 && t.status === "pending";
                  }).length}</p>
                  <p className="text-sm text-gray-500">Due Soon</p>
                </div>
              </div>
              {/* Quizzes Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                  Quizzes
                </h3>
                
                {quizzes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No quizzes available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <div 
                        key={quiz.id} 
                        className="border-l-4 border-blue-500 pl-4 py-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {quiz.type}
                              </span>
                              {quiz.status === 'completed' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{quiz.course}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Questions</p>
                                <p className="font-semibold text-gray-900">{quiz.questions}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Duration</p>
                                <p className="font-semibold text-gray-900">{quiz.duration}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Due Date</p>
                                <p className="font-semibold text-gray-900">{quiz.dueDate}</p>
                              </div>
                            </div>
                            {quiz.lecturerScore && (
                              <div className="mt-2 p-2 bg-white rounded">
                                <p className="text-sm text-gray-700">
                                  <strong>Score:</strong> {quiz.lecturerScore}/100
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {quiz.status === 'pending' ? (
                              <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                Start Quiz
                              </button>
                            ) : (
                              <button className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                                View Results
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Practicals Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-green-500" />
                  Practical Assignments
                </h3>
                
                {practicals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No practical assignments available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {practicals.map((practical) => (
                      <div 
                        key={practical.id} 
                        className="border-l-4 border-green-500 pl-4 py-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{practical.title}</h4>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {practical.type}
                              </span>
                              {practical.status === 'completed' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  Submitted
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{practical.course}</p>
                            <p className="text-sm text-gray-700 mb-2">{practical.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Due Date</p>
                                <p className="font-semibold text-gray-900">{practical.dueDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Status</p>
                                <p className="font-semibold text-gray-900 capitalize">{practical.status}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {practical.status === 'pending' ? (
                              <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                Submit Work
                              </button>
                            ) : (
                              <button className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                                View Submission
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
    </div>
  );
};

export default TasksPage;
