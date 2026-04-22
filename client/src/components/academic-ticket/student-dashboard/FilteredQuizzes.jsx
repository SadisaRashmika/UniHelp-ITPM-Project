import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Clock, Brain, Activity, Filter, Search, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/academic-ticket';

const FilteredQuizzes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedIntake, setSelectedIntake] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  
  // Data states
  const [faculties, setFaculties] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [practicals, setPracticals] = useState([]);
  
  // UI states
  const [activeTab, setActiveTab] = useState('quizzes');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch faculties on component mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  // Fetch intakes when faculty is selected
  useEffect(() => {
    if (selectedFaculty) {
      fetchIntakes();
    } else {
      setIntakes([]);
      setSelectedIntake('');
      setSelectedSemester('');
      setSelectedModule('');
    }
  }, [selectedFaculty]);

  // Fetch semesters when intake is selected
  useEffect(() => {
    if (selectedIntake) {
      fetchSemesters();
    } else {
      setSemesters([]);
      setSelectedSemester('');
      setSelectedModule('');
    }
  }, [selectedIntake]);

  // Fetch modules when semester is selected
  useEffect(() => {
    if (selectedSemester) {
      fetchModules();
    } else {
      setModules([]);
      setSelectedModule('');
    }
  }, [selectedSemester]);

  // Fetch content when filters change
  useEffect(() => {
    if (selectedFaculty && selectedIntake && selectedSemester) {
      fetchContent();
    } else {
      setQuizzes([]);
      setPracticals([]);
    }
  }, [selectedFaculty, selectedIntake, selectedSemester, selectedModule]);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get(`${API_BASE}/quiz-structure/faculties`);
      setFaculties(response.data.data || []);
    } catch (err) {
      console.error('Error fetching faculties:', err);
      setError('Failed to load faculties');
    }
  };

  const fetchIntakes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/quiz-structure/faculty/${selectedFaculty}/intakes`);
      setIntakes(response.data.data || []);
    } catch (err) {
      console.error('Error fetching intakes:', err);
      setError('Failed to load intakes');
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${API_BASE}/quiz-structure/faculty/${selectedFaculty}/intake/${selectedIntake}/semesters`);
      setSemesters(response.data.data || []);
    } catch (err) {
      console.error('Error fetching semesters:', err);
      setError('Failed to load semesters');
    }
  };

  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API_BASE}/quiz-structure/faculty/${selectedFaculty}/intake/${selectedIntake}/semester/${selectedSemester}/modules`);
      setModules(response.data.data || []);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('Failed to load modules');
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch quizzes
      const quizResponse = await axios.get(`${API_BASE}/quiz-jobs`, {
        params: {
          faculty_id: selectedFaculty,
          intake_id: selectedIntake,
          semester_id: selectedSemester,
          module_id: selectedModule || undefined,
          type: 'quiz'
        }
      });
      setQuizzes(quizResponse.data.data || []);
      
      // Fetch practicals
      const practicalResponse = await axios.get(`${API_BASE}/practicals`, {
        params: {
          faculty_id: selectedFaculty,
          intake_id: selectedIntake,
          semester_id: selectedSemester,
          module_id: selectedModule || undefined
        }
      });
      setPracticals(practicalResponse.data.data || []);
      
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedFaculty('');
    setSelectedIntake('');
    setSelectedSemester('');
    setSelectedModule('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Academic Content</h2>
        <p className="text-gray-600">Filter and view your quizzes and practical assignments</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {(selectedFaculty || selectedIntake || selectedSemester || selectedModule) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Faculty Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Faculty</label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Faculty</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                ))}
              </select>
            </div>

            {/* Intake Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Intake/Year</label>
              <select
                value={selectedIntake}
                onChange={(e) => setSelectedIntake(e.target.value)}
                disabled={!selectedFaculty}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Select Intake</option>
                {intakes.map(intake => (
                  <option key={intake.id} value={intake.id}>{intake.year}</option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedIntake}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>{semester.name}</option>
                ))}
              </select>
            </div>

            {/* Module Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                disabled={!selectedSemester}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">All Modules</option>
                {modules.map(module => (
                  <option key={module.id} value={module.id}>{module.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'quizzes'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('practicals')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'practicals'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Practicals ({practicals.length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading content...</span>
        </div>
      )}

      {/* No Filters Applied */}
      {!loading && !selectedFaculty && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Select Filters to View Content</h3>
          <p className="text-gray-500">Choose faculty, intake, and semester to see available quizzes and practicals</p>
        </div>
      )}

      {/* Content Display */}
      {!loading && selectedFaculty && (
        <div className="space-y-4">
          {activeTab === 'quizzes' && (
            <>
              {quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Quizzes Found</h3>
                  <p className="text-gray-500">No quizzes available for the selected filters</p>
                </div>
              ) : (
                quizzes.map(quiz => (
                  <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {quiz.module_name || 'General'}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {quiz.duration} minutes
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(quiz.due_date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.status)}`}>
                          {quiz.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(quiz.priority || 'medium')}`}>
                          {quiz.priority || 'medium'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Max marks: {quiz.max_marks || 100}
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Start Quiz
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'practicals' && (
            <>
              {practicals.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Practicals Found</h3>
                  <p className="text-gray-500">No practical assignments available for the selected filters</p>
                </div>
              ) : (
                practicals.map(practical => (
                  <div key={practical.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{practical.title}</h3>
                        {practical.description && (
                          <p className="text-gray-600 text-sm mb-3">{practical.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {practical.module_name || 'General'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(practical.due_date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(practical.status)}`}>
                          {practical.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(practical.priority || 'medium')}`}>
                          {practical.priority || 'medium'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {practical.file_path ? 'Files attached' : 'No files'}
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        View Practical
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilteredQuizzes;
