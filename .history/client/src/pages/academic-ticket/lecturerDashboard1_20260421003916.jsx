import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaUsers, FaCalendar, FaChartBar, FaBell, FaBook, FaClipboardList, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { BookOpen, FileText, Users, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Award, Play, Upload, Download, Eye, Settings, Bell, Search, Filter, Sun, Moon, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const LectureDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [lightMode, setLightMode] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showPracticalForm, setShowPracticalForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedPractical, setSelectedPractical] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]); // For all tasks submissions
  const [selectedTaskForSubmissions, setSelectedTaskForSubmissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradingData, setGradingData] = useState({ marks: '', feedback: '' });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [newSubmissionNotification, setNewSubmissionNotification] = useState(null);

  // Sync activeTab with URL path
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Map URL segments to tab keys
    const tabMapping = {
      'overview': 'overview',
      'quiz': 'quiz',
      'practical': 'practical',
      'submissions': 'submissions',
      'analytics': 'analytics',
      'grades': 'grades'
    };
    
    const currentTab = tabMapping[lastSegment] || 'overview';
    setActiveTab(currentTab);
  }, [location.pathname]);

  // Fetch faculties on component mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  // Get lecturer ID from logged-in user
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const lecturerId = user.id ? `LEC${user.id}` : "lecturer-123";

  const [quizzes, setQuizzes] = useState([]);
  const [practicals, setPracticals] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    totalQuizzes: 0,
    totalAssignments: 0,
    publishedTasks: 0,
    totalSubmissions: 0,
    gradedSubmissions: 0,
    averageMarks: 0
  });

  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadline) => {
    const now = new Date();
    const due = new Date(deadline);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { days: Math.abs(diffDays), status: 'overdue', text: `${Math.abs(diffDays)} days overdue` };
    } else if (diffDays === 0) {
      return { days: 0, status: 'due', text: 'Due today' };
    } else if (diffDays === 1) {
      return { days: 1, status: 'urgent', text: 'Due tomorrow' };
    } else if (diffDays <= 3) {
      return { days: diffDays, status: 'urgent', text: `${diffDays} days left` };
    } else {
      return { days: diffDays, status: 'normal', text: `${diffDays} days left` };
    }
  };

  // Fetch submissions for all tasks
  const fetchAllSubmissions = async () => {
    try {
      const allTasks = [...quizzes, ...practicals];
      const submissionPromises = allTasks.map(async (task) => {
        try {
          const taskSubmissions = await lecturerAPI.getSubmissions(task.id);
          return taskSubmissions.map(submission => ({
            ...submission,
            taskTitle: task.title,
            taskType: task.type,
            course: task.course
          }));
        } catch (error) {
          console.error(`Error fetching submissions for task ${task.id}:`, error);
          return [];
        }
      });
      
      const allSubmissionsData = await Promise.all(submissionPromises);
      const flattenedSubmissions = allSubmissionsData.flat();
      setAllSubmissions(flattenedSubmissions);
      
      // Update the submissions state for display
      setSubmissions(flattenedSubmissions);
    } catch (error) {
      console.error('Error fetching all submissions:', error);
    }
  };

  // Fetch data from API - moved outside useEffect to make it accessible
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks and overview in parallel
      const [tasksResponse, overviewResponse] = await Promise.all([
        lecturerAPI.getTasks(lecturerId),
        lecturerAPI.getOverview(lecturerId)
      ]);
      
      // Extract arrays from API responses
      const tasksData = tasksResponse.tasks || [];
      const overviewData = overviewResponse.overview || {};
      
      // Separate quizzes and practicals
      const quizTasks = tasksData.filter(task => task.type === 'quiz');
      const practicalTasks = tasksData.filter(task => task.type === 'assignment');
      
      setQuizzes(quizTasks);
      setPracticals(practicalTasks);
      setOverviewStats(overviewData);
      
      // Fetch submissions after tasks are loaded
      await fetchAllSubmissions();
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when lecturerId changes
  useEffect(() => {
    fetchData();
  }, [lecturerId]);

  // Set up polling for real-time updates (separate useEffect)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check for new submissions
        const [tasksResponse, overviewResponse] = await Promise.all([
          lecturerAPI.getTasks(lecturerId),
          lecturerAPI.getOverview(lecturerId)
        ]);
        
        // Extract arrays from API responses
        const tasksData = tasksResponse.tasks || [];
        const overviewData = overviewResponse.overview || {};
        
        const quizTasks = tasksData.filter(task => task.type === 'quiz');
        const practicalTasks = tasksData.filter(task => task.type === 'assignment');
        
        setQuizzes(quizTasks);
        setPracticals(practicalTasks);
        setOverviewStats(overviewData);
        
        // Also refresh submissions
        await fetchAllSubmissions();
      } catch (error) {
        console.error('Error polling for updates:', error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [lecturerId]);

  const [quizForm, setQuizForm] = useState({
    title: "",
    course: "",
    type: "quiz",
    questions: "",
    duration: "",
    dueDate: "",
    description: "",
    maxFileSize: 10, // MB
    allowFileUpload: true,
    deadlineType: "hard", // hard, soft
    moduleId: "", // Module selection
    weekNumber: 1
  });

  const [practicalForm, setPracticalForm] = useState({
    title: "",
    course: "",
    type: "practical",
    description: "",
    dueDate: "",
    requirements: "",
    maxFileSize: 20, // MB
    allowFileUpload: true,
    deadlineType: "hard", // hard, soft
    moduleId: "", // Module selection
    weekNumber: 1
  });

  // Module selection state
  const [faculties, setFaculties] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [years, setYears] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedIntake, setSelectedIntake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const sidebarItems = [
    { icon: BookOpen, label: "Overview", key: "overview" },
    { icon: FileText, label: "Create Quiz", key: "quiz" },
    { icon: Users, label: "Create Practical", key: "practical" },
    { icon: Calendar, label: "Submissions", key: "submissions" },
    { icon: TrendingUp, label: "Analytics", key: "analytics" },
    { icon: Award, label: "Grades", key: "grades" },
  ];

  // Fetch module data functions
  const fetchFaculties = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/modules/faculties');
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchIntakes = async (facultyId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/modules/faculties/${facultyId}/intakes`);
      const data = await response.json();
      setIntakes(data);
    } catch (error) {
      console.error('Error fetching intakes:', error);
    }
  };

  const fetchYears = async (intakeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/modules/intakes/${intakeId}/years`);
      const data = await response.json();
      setYears(data);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const fetchModules = async (yearId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/modules/years/${yearId}/modules`);
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  // Handle faculty selection
  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    setSelectedIntake("");
    setSelectedYear("");
    setSelectedModule("");
    if (facultyId) fetchIntakes(facultyId);
  };

  // Handle intake selection
  const handleIntakeChange = (intakeId) => {
    setSelectedIntake(intakeId);
    setSelectedYear("");
    setSelectedModule("");
    if (intakeId) fetchYears(intakeId);
  };

  // Handle year selection
  const handleYearChange = (yearId) => {
    setSelectedYear(yearId);
    setSelectedModule("");
    if (yearId) fetchModules(yearId);
  };

  // Handle module selection
  const handleModuleChange = (moduleId) => {
    setSelectedModule(moduleId);
  };

  const handleSidebarClick = (key) => {
    // Navigate to unique path for each section
    const basePath = '/lec_dashboard';
    const routes = {
      overview: `${basePath}/overview`,
      quiz: `${basePath}/quiz`,
      practical: `${basePath}/practical`,
      submissions: `${basePath}/submissions`,
      analytics: `${basePath}/analytics`,
      grades: `${basePath}/grades`
    };
    
    navigate(routes[key] || routes.overview);
  };

  const handleActivityClick = (activity, type) => {
    setSelectedActivity({ ...activity, type });
    setShowActivityModal(true);
  };

  // Enhanced function to handle different activity types
  const getActivityDetails = (activity, type) => {
    switch (type) {
      case 'quiz':
        return {
          title: activity.title,
          course: activity.course,
          description: activity.description,
          questions: activity.questions,
          duration: activity.duration,
          submissions: activity.submissions,
          deadline: activity.deadline,
          createdAt: activity.created_at || Date.now()
        };
      case 'practical':
        return {
          title: activity.title,
          course: activity.course,
          description: activity.description,
          deadline: activity.deadline,
          requirements: activity.requirements,
          submissions: activity.submissions,
          createdAt: activity.created_at || Date.now()
        };
      case 'submission':
        return {
          student_name: activity.student_name,
          task_title: activity.task_title,
          course: activity.course,
          marks: activity.marks,
          max_marks: activity.max_marks,
          submitted_at: activity.submitted_at,
          status: activity.status,
          feedback: activity.feedback
        };
      default:
        return activity;
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Check quiz form data
    const errors = {};
    
    // Validation: Check title
    if (!quizForm.title || quizForm.title.trim() === '') {
      errors.title = "Quiz title is required";
    } else if (quizForm.title.trim().length < 3) {
      errors.title = "Quiz title must be at least 3 characters";
    } else if (quizForm.title.trim().length > 100) {
      errors.title = "Quiz title must be less than 100 characters";
    }
    
    // Validation: Check course selection
    if (!quizForm.course) {
      errors.course = "Course selection is required";
    }
    
    // Validation: Check number of questions
    if (!quizForm.questions || quizForm.questions < 1) {
      errors.questions = "At least 1 question is required";
    } else if (quizForm.questions > 100) {
      errors.questions = "Maximum 100 questions allowed";
    }
    
    // Validation: Check duration format and value
    if (!quizForm.duration || quizForm.duration.trim() === '') {
      errors.duration = "Duration is required";
    } else if (!/^\d+\s*(minutes?|hours?|hrs?|mins?)$/i.test(quizForm.duration.trim())) {
      errors.duration = "Duration must be in format '30 minutes' or '2 hours'";
    } else {
      // Parse duration to check reasonable limits
      const durationMatch = quizForm.duration.match(/(\d+)\s*(minutes?|hours?|hrs?|mins?)/i);
      const durationValue = parseInt(durationMatch[1]);
      const durationUnit = durationMatch[2].toLowerCase();
      const durationMinutes = durationUnit.includes('hour') || durationUnit.includes('hr') ? durationValue * 60 : durationValue;
      
      if (durationMinutes < 5) {
        errors.duration = "Quiz duration must be at least 5 minutes";
      } else if (durationMinutes > 240) { // 4 hours max
        errors.duration = "Quiz duration cannot exceed 4 hours";
      }
    }
    
    // Validation: Check due date
    if (!quizForm.dueDate) {
      errors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(quizForm.dueDate);
      const now = new Date();
      if (dueDate <= now) {
        errors.dueDate = "Due date must be in the future";
      } else {
        // Check if due date is too far in future (more than 6 months)
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        if (dueDate > sixMonthsFromNow) {
          errors.dueDate = "Due date cannot be more than 6 months in the future";
        }
      }
    }
    
    // Validation: Check description
    if (quizForm.description && quizForm.description.trim().length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }
    
    // Display errors if any
    if (Object.keys(errors).length > 0) {
      alert('Please fix the following errors:\n' + Object.values(errors).join('\n'));
      return;
    }
    
    try {
      // Parse duration to get minutes
      const durationMatch = quizForm.duration.match(/(\d+)\s*(minutes?|hours?|hrs?|mins?)/i);
      const durationValue = parseInt(durationMatch[1]);
      const durationUnit = durationMatch[2].toLowerCase();
      const durationMinutes = durationUnit.includes('hour') || durationUnit.includes('hr') ? durationValue * 60 : durationValue;
      
      const quizData = {
        title: quizForm.title,
        description: quizForm.description,
        instructions: quizForm.description,
        due_date: quizForm.dueDate,
        duration_minutes: durationMinutes,
        module_id: parseInt(quizForm.moduleId),
        week_number: parseInt(quizForm.weekNumber) || 1
      };
      
      const result = await fetch('http://localhost:5000/api/modules/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });
      
      const response = await result.json();
      
      // Create notification for students
      const notificationData = {
        type: 'quiz',
        title: 'New Quiz Available',
        message: `${quizForm.title} has been posted for ${quizForm.course}`,
        course: quizForm.course,
        deadline: quizForm.dueDate,
        taskId: result.taskId || result.id,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Send notification to all students
      try {
        const notificationResponse = await fetch('http://localhost:5000/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });
        
        if (notificationResponse.ok) {
          console.log('Notification sent successfully');
        }
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
      
      // Create the new quiz object for immediate UI update
      const newQuiz = {
        id: result.taskId || result.id || Date.now(),
        title: quizForm.title,
        description: quizForm.description,
        course: quizForm.course,
        courseCode: quizForm.course,
        deadline: quizForm.dueDate,
        type: 'quiz',
        taskType: 'quiz',
        maxMarks: parseInt(quizForm.questions) * 10,
        totalQuestions: parseInt(quizForm.questions),
        duration: durationMinutes,
        duration: quizForm.duration,
        questions: parseInt(quizForm.questions),
        submissions: 0,
        gradedSubmissions: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        lecturerId: lecturerId
      };
      
      // Immediately update the quizzes state to show in Recent Activities
      setQuizzes(prevQuizzes => [newQuiz, ...prevQuizzes]);
      
      // Refresh: data from server to ensure consistency
      const [tasksResponse, overviewResponse] = await Promise.all([
        lecturerAPI.getTasks(lecturerId),
        lecturerAPI.getOverview(lecturerId)
      ]);
      
      // Extract arrays from API responses
      const tasksData = tasksResponse.tasks || [];
      const overviewData = overviewResponse.overview || {};
      
      const quizTasks = tasksData.filter(task => task.type === 'quiz');
      const practicalTasks = tasksData.filter(task => task.type === 'assignment');
      
      setQuizzes(quizTasks);
      setPracticals(practicalTasks);
      setOverviewStats(overviewData);
      
      // Fetch submissions after tasks are loaded
      await fetchAllSubmissions();
      
      alert(`Quiz "${quizForm.title}" created successfully! Students will be notified.`);
      
      setQuizForm({
        title: "",
        course: "",
        type: "quiz",
        questions: "",
        duration: "",
        dueDate: "",
        description: "",
        maxFileSize: 10,
        allowFileUpload: true,
        deadlineType: "hard"
      });
      setShowQuizForm(false);
      
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    }
  };

  const handlePracticalSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Check practical form data
    const errors = {};
    
    // Validation: Check title
    if (!practicalForm.title || practicalForm.title.trim() === '') {
      errors.title = "Assignment title is required";
    } else if (practicalForm.title.trim().length < 3) {
      errors.title = "Assignment title must be at least 3 characters";
    } else if (practicalForm.title.trim().length > 100) {
      errors.title = "Assignment title must be less than 100 characters";
    }
    
    // Validation: Check course selection
    if (!practicalForm.course) {
      errors.course = "Course selection is required";
    }
    
    // Validation: Check description
    if (!practicalForm.description || practicalForm.description.trim() === '') {
      errors.description = "Description is required";
    } else if (practicalForm.description.trim().length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }
    
    // Validation: Check due date
    if (!practicalForm.dueDate) {
      errors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(practicalForm.dueDate);
      const now = new Date();
      if (dueDate <= now) {
        errors.dueDate = "Due date must be in the future";
      }
    }
    
    // Validation: Check max file size
    if (practicalForm.maxFileSize && (practicalForm.maxFileSize < 1 || practicalForm.maxFileSize > 100)) {
      errors.maxFileSize = "Max file size must be between 1MB and 100MB";
    }
    
    // Validation: Check requirements
    if (!practicalForm.requirements || practicalForm.requirements.trim() === '') {
      errors.requirements = "Requirements are required";
    } else if (practicalForm.requirements.trim().length > 500) {
      errors.requirements = "Requirements must be less than 500 characters";
    }
    
    // Validation: Check deadline type
    if (!practicalForm.deadlineType) {
      errors.deadlineType = "Deadline type is required";
    }
    
    // Display errors if any
    if (Object.keys(errors).length > 0) {
      alert('Please fix the following errors:\n' + Object.values(errors).join('\n'));
      return;
    }
    
    try {
      const taskData = {
        lecturerId,
        title: practicalForm.title,
        description: practicalForm.description,
        courseCode: practicalForm.course,
        deadline: practicalForm.dueDate,
        taskType: 'assignment',
        maxFileSize: practicalForm.maxFileSize,
        allowFileUpload: practicalForm.allowFileUpload,
        deadlineType: practicalForm.deadlineType,
        requirements: practicalForm.requirements
      };
      
      const result = await lecturerAPI.createTask(lecturerId, taskData);
      
      // Create notification for students
      const notificationData = {
        type: 'assignment',
        title: 'New Assignment Available',
        message: `${practicalForm.title} has been posted for ${practicalForm.course}`,
        course: practicalForm.course,
        deadline: practicalForm.dueDate,
        taskId: result.taskId,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Send notification to all students
      try {
        const notificationResponse = await fetch('http://localhost:5000/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });
        
        if (notificationResponse.ok) {
          console.log('Notification sent successfully');
        }
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
      
      // Refresh the data
      const [tasksResponse, overviewResponse] = await Promise.all([
        lecturerAPI.getTasks(lecturerId),
        lecturerAPI.getOverview(lecturerId)
      ]);
      
      // Extract arrays from API responses
      const tasksData = tasksResponse.tasks || [];
      const overviewData = overviewResponse.overview || {};
      
      const quizTasks = tasksData.filter(task => task.type === 'quiz');
      const practicalTasks = tasksData.filter(task => task.type === 'assignment');
      
      setQuizzes(quizTasks);
      setPracticals(practicalTasks);
      setOverviewStats(overviewData);
      
      // Refresh data immediately to update overview stats
      await fetchData();
      
      alert(`Assignment "${practicalForm.title}" created successfully! Students will be notified.`);
      
      setPracticalForm({
        title: "",
        course: "",
        type: "practical",
        description: "",
        dueDate: "",
        requirements: "",
        maxFileSize: 20,
        allowFileUpload: true,
        deadlineType: "hard"
      });
      setShowPracticalForm(false);
      
    } catch (error) {
      console.error('Error creating practical:', error);
      alert('Error creating assignment');
    }
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradingData({ 
      marks: submission.marks || '', 
      feedback: submission.feedback || '' 
    });
    setShowGradingModal(true);
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission || !gradingData.marks) {
      alert('Please enter marks');
      return;
    }

    try {
      await lecturerAPI.gradeSubmission(selectedSubmission.id, { 
        marks: parseInt(gradingData.marks), 
        feedback: gradingData.feedback 
      });
      
      // Update local state
      setSubmissions(prev => prev.map(sub => 
        sub.id === selectedSubmission.id 
          ? { ...sub, marks: parseInt(gradingData.marks), feedback: gradingData.feedback, status: 'graded' }
          : sub
      ));
      
      // Update all submissions
      setAllSubmissions(prev => prev.map(sub => 
        sub.id === selectedSubmission.id 
          ? { ...sub, marks: parseInt(gradingData.marks), feedback: gradingData.feedback, status: 'graded' }
          : sub
      ));
      
      setShowGradingModal(false);
      setSelectedSubmission(null);
      setGradingData({ marks: '', feedback: '' });
      
      alert('Grade saved successfully!');
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Error saving grade');
    }
  };

  const stats = {
    totalQuizzes: overviewStats.totalQuizzes || quizzes.length,
    totalPracticals: overviewStats.totalAssignments || practicals.length,
    totalSubmissions: overviewStats.totalSubmissions || submissions.length,
    averageScore: overviewStats.averageMarks || 0
  };

  return (
    <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`w-64 h-full p-6 flex flex-col ${lightMode ? "bg-gray-200" : "bg-gray-900 text-white"}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">👨‍🏫</span>
          </div>
          <div>
            <span className="text-xl font-semibold">Lecture Dashboard</span>
            <p className="text-xs text-gray-400 mt-1">Academic Management</p>
          </div>
        </div>

        <nav className="flex-1">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 cursor-pointer transition-colors ${
                activeTab === item.key
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          {/* New Submission Notification */}
          {newSubmissionNotification && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <span className="font-medium">
                  New submission received for {newSubmissionNotification.taskTitle}!
                </span>
              </div>
              <button
                onClick={() => setNewSubmissionNotification(null)}
                className="text-green-700 hover:text-green-900"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 mt-4">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{activeTab.toUpperCase()}</h1>
        </header>

        <main className="space-y-10">
          {activeTab === "overview" && (
            <div className="space-y-10">
              {/* Stats Overview */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold">+12%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</h3>
                  <p className="text-gray-500 text-sm">Total Quizzes</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold">+8%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalPracticals}</h3>
                  <p className="text-gray-500 text-sm">Total Practicals</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold">+25%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</h3>
                  <p className="text-gray-500 text-sm">Total Submissions</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold">+5%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}</h3>
                  <p className="text-gray-500 text-sm">Average Score</p>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {/* Show recently created quizzes */}
                  {quizzes.slice(0, 5).map(quiz => (
                    <div 
                      key={quiz.id} 
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
                      onClick={() => handleActivityClick(quiz, 'quiz')}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Quiz: {quiz.title}</p>
                          <p className="text-xs text-gray-500">{quiz.course} • {quiz.questions} questions • {quiz.duration} • {quiz.submissions || 0} submissions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600 font-medium">{quiz.submissions || 0} submitted</span>
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Show recently created practicals */}
                  {practicals.slice(0, 5).map(practical => (
                    <div 
                      key={practical.id} 
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors border border-green-200"
                      onClick={() => handleActivityClick(practical, 'practical')}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Assignment: {practical.title}</p>
                          <p className="text-xs text-gray-500">{practical.course} • Due: {utils.formatDate(practical.deadline)} • {practical.submissions || 0} submissions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">{practical.submissions || 0} submitted</span>
                        <ChevronRight className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Show recent submissions */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Recent Submissions</h4>
                    {submissions.slice(0, 5).map(submission => (
                      <div 
                        key={submission.id} 
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors border border-purple-200"
                        onClick={() => handleActivityClick(submission, 'submission')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{submission.student_name}</p>
                            <p className="text-xs text-gray-500">
                              {submission.task_title} • {submission.course} • 
                              {submission.marks}/{submission.max_marks} points • 
                              {new Date(submission.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            submission.status === 'graded' ? 'text-green-600' : 
                            submission.status === 'submitted' ? 'text-orange-600' : 'text-gray-600'
                          }`}>
                            {submission.status === 'graded' ? 'Graded' : 
                             submission.status === 'submitted' ? 'Submitted' : 'Pending'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Show if no activities */}
                  {quizzes.length === 0 && practicals.length === 0 && submissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No recent activities. Create your first quiz or assignment!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quiz Management</h2>
                <button
                  onClick={() => setShowQuizForm(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FaPlus /> Create New Quiz
                </button>
              </div>

              {/* Quiz Form Modal */}
              {showQuizForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Create New Quiz</h3>
                      <button
                        onClick={() => setShowQuizForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <form onSubmit={handleQuizSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                          <input
                            type="text"
                            required
                            value={quizForm.title}
                            onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quiz title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                          <select
                            required
                            value={quizForm.course}
                            onChange={(e) => setQuizForm({...quizForm, course: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Course</option>
                            <option value="CS301">CS301 - Database Management</option>
                            <option value="CS302">CS302 - Web Development</option>
                            <option value="CS303">CS303 - Algorithms</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="100"
                            value={quizForm.questions}
                            onChange={(e) => setQuizForm({...quizForm, questions: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Number of questions"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                          <input
                            type="text"
                            required
                            value={quizForm.duration}
                            onChange={(e) => setQuizForm({...quizForm, duration: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 30 minutes"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="datetime-local"
                          required
                          value={quizForm.dueDate}
                          onChange={(e) => setQuizForm({...quizForm, dueDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {quizForm.dueDate && (
                          <div className={`mt-2 text-sm ${
                            calculateDaysRemaining(quizForm.dueDate).status === 'overdue' ? 'text-red-600' :
                            calculateDaysRemaining(quizForm.dueDate).status === 'due' ? 'text-orange-600' :
                            calculateDaysRemaining(quizForm.dueDate).status === 'urgent' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {calculateDaysRemaining(quizForm.dueDate).text}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline Type</label>
                          <select
                            value={quizForm.deadlineType}
                            onChange={(e) => setQuizForm({...quizForm, deadlineType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="hard">Hard Deadline (No late submissions)</option>
                            <option value="soft">Soft Deadline (Late submissions allowed)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Allow File Upload</label>
                          <select
                            value={quizForm.allowFileUpload}
                            onChange={(e) => setQuizForm({...quizForm, allowFileUpload: e.target.value === 'true'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>
                      
                      {quizForm.allowFileUpload && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum File Size (MB)</label>
                          <select
                            value={quizForm.maxFileSize}
                            onChange={(e) => setQuizForm({...quizForm, maxFileSize: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="5">5 MB</option>
                            <option value="10">10 MB</option>
                            <option value="20">20 MB</option>
                            <option value="50">50 MB</option>
                            <option value="100">100 MB</option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows="4"
                          value={quizForm.description}
                          onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Quiz description and instructions"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowQuizForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Create Quiz
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Existing Quizzes */}
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {quiz.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{quiz.course}</p>
                        <div className="grid grid-cols-5 gap-4 text-sm">
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
                            <p className="font-semibold text-gray-900">{utils.formatDate(quiz.dueDate)}</p>
                            {quiz.dueDate && (
                              <p className={`text-xs mt-1 ${
                                calculateDaysRemaining(quiz.dueDate).status === 'overdue' ? 'text-red-600' :
                                calculateDaysRemaining(quiz.dueDate).status === 'due' ? 'text-orange-600' :
                                calculateDaysRemaining(quiz.dueDate).status === 'urgent' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {calculateDaysRemaining(quiz.dueDate).text}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500">Submissions</p>
                            <p className="font-semibold text-gray-900">{quiz.submissions || 0}/{quiz.totalStudents || 60}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">File Limit</p>
                            <p className="font-semibold text-gray-900">{quiz.maxFileSize || 10} MB</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "practical" && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Practical Management</h2>
                <button
                  onClick={() => setShowPracticalForm(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <FaPlus /> Create New Practical
                </button>
              </div>

              {/* Practical Form Modal */}
              {showPracticalForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Create New Practical</h3>
                      <button
                        onClick={() => setShowPracticalForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <form onSubmit={handlePracticalSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Practical Title</label>
                          <input
                            type="text"
                            required
                            value={practicalForm.title}
                            onChange={(e) => setPracticalForm({...practicalForm, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter practical title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                          <select
                            required
                            value={practicalForm.course}
                            onChange={(e) => setPracticalForm({...practicalForm, course: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Select Course</option>
                            <option value="CS301">CS301 - Database Management</option>
                            <option value="CS302">CS302 - Web Development</option>
                            <option value="CS303">CS303 - Algorithms</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="datetime-local"
                          required
                          value={practicalForm.dueDate}
                          onChange={(e) => setPracticalForm({...practicalForm, dueDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {practicalForm.dueDate && (
                          <div className={`mt-2 text-sm ${
                            calculateDaysRemaining(practicalForm.dueDate).status === 'overdue' ? 'text-red-600' :
                            calculateDaysRemaining(practicalForm.dueDate).status === 'due' ? 'text-orange-600' :
                            calculateDaysRemaining(practicalForm.dueDate).status === 'urgent' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {calculateDaysRemaining(practicalForm.dueDate).text}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline Type</label>
                          <select
                            value={practicalForm.deadlineType}
                            onChange={(e) => setPracticalForm({...practicalForm, deadlineType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="hard">Hard Deadline (No late submissions)</option>
                            <option value="soft">Soft Deadline (Late submissions allowed)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Allow File Upload</label>
                          <select
                            value={practicalForm.allowFileUpload}
                            onChange={(e) => setPracticalForm({...practicalForm, allowFileUpload: e.target.value === 'true'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>
                      
                      {practicalForm.allowFileUpload && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum File Size (MB)</label>
                          <select
                            value={practicalForm.maxFileSize}
                            onChange={(e) => setPracticalForm({...practicalForm, maxFileSize: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="5">5 MB</option>
                            <option value="10">10 MB</option>
                            <option value="20">20 MB</option>
                            <option value="50">50 MB</option>
                            <option value="100">100 MB</option>
                            <option value="200">200 MB</option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows="4"
                          required
                          value={practicalForm.description}
                          onChange={(e) => setPracticalForm({...practicalForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Detailed description of the practical assignment"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                        <textarea
                          rows="3"
                          value={practicalForm.requirements}
                          onChange={(e) => setPracticalForm({...practicalForm, requirements: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Specific requirements and deliverables"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowPracticalForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Create Practical
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Existing Practicals */}
              <div className="space-y-4">
                {practicals.map((practical) => (
                  <div key={practical.id} className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{practical.title}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {practical.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{practical.course}</p>
                        <p className="text-sm text-gray-700 mb-3">{practical.description}</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-semibold text-gray-900">{utils.formatDate(practical.dueDate)}</p>
                            {practical.dueDate && (
                              <p className={`text-xs mt-1 ${
                                calculateDaysRemaining(practical.dueDate).status === 'overdue' ? 'text-red-600' :
                                calculateDaysRemaining(practical.dueDate).status === 'due' ? 'text-orange-600' :
                                calculateDaysRemaining(practical.dueDate).status === 'urgent' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {calculateDaysRemaining(practical.dueDate).text}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500">Submissions</p>
                            <p className="font-semibold text-gray-900">{practical.submissions || 0}/{practical.totalStudents || 60}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">File Limit</p>
                            <p className="font-semibold text-gray-900">{practical.maxFileSize || 20} MB</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Deadline Type</p>
                            <p className="font-semibold text-gray-900 capitalize">{practical.deadlineType || 'hard'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "submissions" && (
            <div className="space-y-10">
              <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
              
              {/* Submissions Table */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No submissions yet. Students haven't submitted any work.</p>
                          </td>
                        </tr>
                      ) : (
                        submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                                <div className="text-xs text-gray-500">{submission.studentId}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                submission.taskType === 'quiz' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {submission.taskType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.taskTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.course}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {utils.formatDate(submission.submissionDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {submission.marks ? (
                                <span className="text-sm font-semibold text-green-600">{submission.marks}/100</span>
                              ) : (
                                <span className="text-sm text-gray-500">Not graded</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                submission.status === 'graded' 
                                  ? 'bg-green-100 text-green-700'
                                  : submission.status === 'submitted'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {submission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {submission.status !== 'graded' && (
                                <button
                                  onClick={() => handleGradeSubmission(submission)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  Grade
                                </button>
                              )}
                              {submission.status === 'graded' && (
                                <span className="text-green-600 font-medium">Graded</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-10">
              <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="font-semibold text-gray-800 mb-4">Task Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Quizzes Created</span>
                      <span className="font-semibold text-gray-900">{quizzes.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Practicals Created</span>
                      <span className="font-semibold text-gray-900">{practicals.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Submissions Received</span>
                      <span className="font-semibold text-gray-900">{submissions.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>• Most recent quiz created: {quizzes[0]?.title || 'None'}</p>
                      <p>• Most recent practical created: {practicals[0]?.title || 'None'}</p>
                      <p>• Last submission received: {submissions[0]?.student_name || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="space-y-10">
              <h2 className="text-2xl font-bold text-gray-900">Grade Management</h2>
              
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Grades</h3>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'graded').map((submission) => (
                    <div key={submission.id} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{submission.studentName} - {submission.title}</p>
                          <p className="text-sm text-gray-600">{submission.course}</p>
                          <p className="text-xs text-gray-500">Submitted: {submission.submissionDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{submission.score}/100</p>
                          <p className="text-xs text-gray-500">Grade: {submission.score >= 90 ? 'A' : submission.score >= 80 ? 'B' : submission.score >= 70 ? 'C' : 'D'}</p>
                        </div>
                      </div>
                      {submission.feedback && (
                        <div className="mt-2 p-2 bg-white rounded">
                          <p className="text-sm text-gray-700"><strong>Feedback:</strong> {submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Grade Submission</h3>
              <button
                onClick={() => setShowGradingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedSubmission.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Student:</span>
                    <span className="ml-2 font-medium">{selectedSubmission.studentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Course:</span>
                    <span className="ml-2 font-medium">{selectedSubmission.course}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <span className="ml-2 font-medium">{selectedSubmission.submissionDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-medium">{selectedSubmission.type}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks (out of 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradingData.marks}
                  onChange={(e) => setGradingData(prev => ({ ...prev, marks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter marks"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea
                  rows="4"
                  value={gradingData.feedback}
                  onChange={(e) => setGradingData(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide feedback to the student..."
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {showActivityModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedActivity.type === 'quiz' ? 'Quiz Details' : 
                 selectedActivity.type === 'practical' ? 'Assignment Details' : 
                 selectedActivity.type === 'submission' ? 'Submission Details' : 'Activity Details'}
              </h3>
              <button
                onClick={() => setShowActivityModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Title</h4>
                <p className="text-gray-700">{selectedActivity.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Course</h4>
                <p className="text-gray-700">{selectedActivity.course}</p>
              </div>
              
              {selectedActivity.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedActivity.description}</p>
                </div>
              )}
              
              {selectedActivity.type === 'quiz' && (
                <>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quiz Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Questions:</span>
                        <span className="text-gray-700 ml-2">{selectedActivity.questions}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-gray-700 ml-2">{selectedActivity.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Submissions</h4>
                    <p className="text-gray-700">{selectedActivity.submissions || 0} students have submitted</p>
                  </div>
                </>
              )}
              
              {selectedActivity.type === 'practical' && (
                <>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Assignment Details</h4>
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="text-gray-500">Deadline:</span>
                        <span className="text-gray-700 ml-2">{utils.formatDate(selectedActivity.deadline)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Requirements:</span>
                        <p className="text-gray-700 mt-2">{selectedActivity.requirements || 'No specific requirements'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Submissions</h4>
                    <p className="text-gray-700">{selectedActivity.submissions || 0} students have submitted</p>
                  </div>
                </>
              )}
              
              {selectedActivity.type === 'submission' && (
                <>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                    <p className="text-gray-700">{selectedActivity.student_name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="text-gray-500">Task:</span>
                        <span className="text-gray-700 ml-2">{selectedActivity.task_title}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500">Course:</span>
                        <span className="text-gray-700 ml-2">{selectedActivity.course}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500">Score:</span>
                        <span className="text-gray-700 ml-2">{selectedActivity.marks}/{selectedActivity.max_marks} points</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500">Submitted:</span>
                        <span className="text-gray-700 ml-2">{new Date(selectedActivity.submitted_at).toLocaleDateString()}</span>
                      </div>
                      {selectedActivity.feedback && (
                        <div className="mt-2">
                          <span className="text-gray-500">Feedback:</span>
                          <p className="text-gray-700 mt-2 bg-gray-50 p-2 rounded">{selectedActivity.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Created</h4>
                <p className="text-gray-700">{new Date(selectedActivity.createdAt || Date.now()).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowActivityModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default <LectureDashboard1></LectureDashboard1>;
