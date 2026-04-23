// Import React hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import Lucide React icons for UI components
import {
  BookOpen, // Book icon for quiz
  Plus, // Plus icon for creating new quiz
  ChevronDown, // Chevron icon for dropdowns
  Search, // Search icon for filtering
  Edit, // Edit icon for modifying quizzes
  Trash2, // Trash icon for deleting quizzes
  Users, // Users icon for module students
  Calendar, // Calendar icon for dates
  Clock, // Clock icon for duration
  Award, // Award icon for marks
  Loader2, // Loading spinner icon
  X, // Close icon for modals
  CheckCircle // Check icon for success
} from "lucide-react";
// Import Axios for HTTP requests to backend API
import axios from "axios";

// Base URL for API endpoints
const API_BASE = "http://localhost:5000/api/academic-ticket";

// Main QuizManagement component for lecturer dashboard
const QuizManagement = () => {
  // State management for component
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [quizStructure, setQuizStructure] = useState([]); // Complete quiz structure data
  const [selectedFaculty, setSelectedFaculty] = useState(""); // Selected faculty ID
  const [selectedIntake, setSelectedIntake] = useState(""); // Selected intake ID
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester ID
  const [selectedModule, setSelectedModule] = useState(""); // Selected module ID
  const [quizzes, setQuizzes] = useState([]); // Quizzes for current selection
  const [showCreateModal, setShowCreateModal] = useState(false); // Create quiz modal state
  const [editingQuiz, setEditingQuiz] = useState(null); // Quiz being edited
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Form state for creating/editing quizzes
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    duration: 30,
    total_marks: 50,
    questions: []
  });

  // Fetch quiz structure when component mounts
  useEffect(() => {
    fetchQuizStructure();
  }, []);

  // Fetch quizzes when module selection changes
  useEffect(() => {
    if (selectedModule) {
      fetchQuizzes();
    } else {
      setQuizzes([]);
    }
  }, [selectedModule]);

  // Fetch complete quiz structure for lecturer
  const fetchQuizStructure = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/quiz-structure/lecturer/structure`);
      setQuizStructure(response.data.data || []);
    } catch (error) {
      console.error("Error fetching quiz structure:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quizzes for selected module
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/quizzes`, {
        params: {
          lecturer_id: 'LEC001', // In production, get from auth
          module_id: selectedModule
        }
      });
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle faculty selection change
  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    setSelectedIntake(""); // Reset dependent selections
    setSelectedSemester("");
    setSelectedModule("");
  };

  // Handle intake selection change
  const handleIntakeChange = (intakeId) => {
    setSelectedIntake(intakeId);
    setSelectedSemester(""); // Reset dependent selections
    setSelectedModule("");
  };

  // Handle semester selection change
  const handleSemesterChange = (semesterId) => {
    setSelectedSemester(semesterId);
    setSelectedModule(""); // Reset module selection
  };

  // Handle module selection change
  const handleModuleChange = (moduleId) => {
    setSelectedModule(moduleId);
  };

  // Get available options for dropdowns based on current selections
  const getIntakes = () => {
    if (!selectedFaculty) return [];
    const faculty = quizStructure.find(f => f.id == selectedFaculty);
    return faculty ? faculty.intakes || [] : [];
  };

  const getSemesters = () => {
    if (!selectedFaculty || !selectedIntake) return [];
    const faculty = quizStructure.find(f => f.id == selectedFaculty);
    const intake = faculty?.intakes.find(i => i.id == selectedIntake);
    return intake ? intake.semesters || [] : [];
  };

  const getModules = () => {
    if (!selectedFaculty || !selectedIntake || !selectedSemester) return [];
    const faculty = quizStructure.find(f => f.id == selectedFaculty);
    const intake = faculty?.intakes.find(i => i.id == selectedIntake);
    const semester = intake?.semesters.find(s => s.id == selectedSemester);
    return semester ? semester.modules || [] : [];
  };

  // Handle quiz creation
  const handleCreateQuiz = async () => {
    try {
      setLoading(true);
      const quizData = {
        ...quizForm,
        faculty_id: selectedFaculty,
        intake_id: selectedIntake,
        semester_id: selectedSemester,
        module_id: selectedModule
      };

      await axios.post(`${API_BASE}/quizzes`, quizData);
      setSuccessMessage("Quiz created successfully!");
      setShowCreateModal(false);
      setQuizForm({ title: "", description: "", duration: 30, total_marks: 50, questions: [] });
      fetchQuizzes(); // Refresh quizzes list

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz edit - open edit modal with quiz data
  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      total_marks: quiz.total_marks,
      questions: quiz.questions || []
    });
    setShowCreateModal(true);
  };

  // Handle quiz update
  const handleUpdateQuiz = async () => {
    try {
      setLoading(true);
      const quizData = {
        ...quizForm,
        faculty_id: selectedFaculty,
        intake_id: selectedIntake,
        semester_id: selectedSemester,
        module_id: selectedModule
      };

      await axios.put(`${API_BASE}/quizzes/${editingQuiz.id}`, quizData);
      setSuccessMessage("Quiz updated successfully!");
      setShowCreateModal(false);
      setEditingQuiz(null);
      setQuizForm({ title: "", description: "", duration: 30, total_marks: 50, questions: [] });
      fetchQuizzes(); // Refresh quizzes list

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz deletion
  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/quizzes/${quizId}`);
      setSuccessMessage("Quiz deleted successfully!");
      fetchQuizzes(); // Refresh quizzes list

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get current module information
  const getCurrentModule = () => {
    if (!selectedModule) return null;
    const modules = getModules();
    return modules.find(m => m.id == selectedModule);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Management</h1>
        <p className="text-slate-600">Create and manage quizzes for your modules</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {/* Structure Selection Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Faculty Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Faculty</label>
          <div className="relative">
            <select
              value={selectedFaculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              className="w-full p-3 pr-10 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Faculty</option>
              {quizStructure.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Intake Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Intake</label>
          <div className="relative">
            <select
              value={selectedIntake}
              onChange={(e) => handleIntakeChange(e.target.value)}
              disabled={!selectedFaculty}
              className="w-full p-3 pr-10 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select Intake</option>
              {getIntakes().map(intake => (
                <option key={intake.id} value={intake.id}>
                  {intake.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Semester Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Semester</label>
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              disabled={!selectedIntake}
              className="w-full p-3 pr-10 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select Semester</option>
              {getSemesters().map(semester => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Module Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Module</label>
          <div className="relative">
            <select
              value={selectedModule}
              onChange={(e) => handleModuleChange(e.target.value)}
              disabled={!selectedSemester}
              className="w-full p-3 pr-10 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select Module</option>
              {getModules().map(module => (
                <option key={module.id} value={module.id}>
                  {module.code} - {module.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>
        </div>
      </div>

      {/* Module Info and Create Quiz Button */}
      {selectedModule && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                {getCurrentModule()?.code} - {getCurrentModule()?.name}
              </h3>
              <p className="text-sm text-blue-700">
                {getCurrentModule()?.credits} credits | {getCurrentModule()?.faculty_name}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Create Quiz
            </button>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      {selectedModule && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Quizzes ({quizzes.length})
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
              <p>No quizzes created for this module yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-slate-900">{quiz.title}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditQuiz(quiz)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{quiz.description}</p>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {quiz.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={14} />
                      {quiz.total_marks} marks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingQuiz(null);
                  setQuizForm({ title: "", description: "", duration: 30, total_marks: 50, questions: [] });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter quiz description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={quizForm.duration}
                    onChange={(e) => setQuizForm({...quizForm, duration: parseInt(e.target.value)})}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Marks</label>
                  <input
                    type="number"
                    value={quizForm.total_marks}
                    onChange={(e) => setQuizForm({...quizForm, total_marks: parseInt(e.target.value)})}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingQuiz(null);
                  setQuizForm({ title: "", description: "", duration: 30, total_marks: 50, questions: [] });
                }}
                className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
                disabled={!quizForm.title || !quizForm.description || loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {editingQuiz ? "Update Quiz" : "Create Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
