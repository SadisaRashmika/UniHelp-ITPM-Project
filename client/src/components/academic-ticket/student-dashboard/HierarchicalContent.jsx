import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, FileText, Calendar, Bell, Users, Folder, FolderOpen, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/academic-ticket';

const HierarchicalContent = () => {
  const [hierarchicalData, setHierarchicalData] = useState({ faculties: [] });
  const [navigationPaths, setNavigationPaths] = useState([]);
  const [expandedFaculties, setExpandedFaculties] = useState({});
  const [expandedIntakes, setExpandedIntakes] = useState({});
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [selectedPath, setSelectedPath] = useState(null);
  const [pathContent, setPathContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHierarchicalContent();
    fetchNavigationPaths();
  }, []);

  const fetchHierarchicalContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/student-content/hierarchical`);
      setHierarchicalData(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching hierarchical content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const fetchNavigationPaths = async () => {
    try {
      const response = await axios.get(`${API_BASE}/student-content/navigation`);
      setNavigationPaths(response.data.data);
    } catch (err) {
      console.error('Error fetching navigation paths:', err);
    }
  };

  const fetchContentByPath = async (facultyId, intakeId, semesterId, moduleId = null) => {
    try {
      setLoading(true);
      const url = moduleId 
        ? `${API_BASE}/student-content/path/${facultyId}/${intakeId}/${semesterId}/${moduleId}`
        : `${API_BASE}/student-content/path/${facultyId}/${intakeId}/${semesterId}`;
      
      const response = await axios.get(url);
      setPathContent(response.data.data);
      setSelectedPath({ facultyId, intakeId, semesterId, moduleId });
      setError(null);
    } catch (err) {
      console.error('Error fetching content by path:', err);
      setError('Failed to load content for this path');
      setPathContent([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaculty = (facultyId) => {
    setExpandedFaculties(prev => ({
      ...prev,
      [facultyId]: !prev[facultyId]
    }));
  };

  const toggleIntake = (facultyId, intakeId) => {
    setExpandedIntakes(prev => ({
      ...prev,
      [`${facultyId}-${intakeId}`]: !prev[`${facultyId}-${intakeId}`]
    }));
  };

  const toggleSemester = (facultyId, intakeId, semesterId) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [`${facultyId}-${intakeId}-${semesterId}`]: !prev[`${facultyId}-${intakeId}-${semesterId}`]
    }));
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'quiz':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'practical':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'notice':
        return <Bell className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
      case 'normal':
        return 'text-blue-600 bg-blue-50';
      case 'low':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading && hierarchicalData.faculties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Academic Content</h2>
        <p className="text-gray-600">Navigate through your academic content by faculty, intake, semester, and module</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Navigation Tree */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Navigation</h3>
          <div className="space-y-2">
            {hierarchicalData.faculties.map((faculty) => (
              <div key={faculty.id} className="border border-gray-200 rounded-lg">
                {/* Faculty Level */}
                <div
                  className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 cursor-pointer rounded-t-lg"
                  onClick={() => toggleFaculty(faculty.id)}
                >
                  <div className="flex items-center">
                    {expandedFaculties[faculty.id] ? 
                      <ChevronDown className="w-5 h-5 text-gray-500 mr-2" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500 mr-2" />
                    }
                    {expandedFaculties[faculty.id] ? 
                      <FolderOpen className="w-5 h-5 text-blue-500 mr-2" /> : 
                      <Folder className="w-5 h-5 text-blue-500 mr-2" />
                    }
                    <span className="font-medium text-gray-800">{faculty.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{faculty.code}</span>
                </div>

                {/* Intake Level */}
                {expandedFaculties[faculty.id] && faculty.intakes && (
                  <div className="border-t border-gray-200">
                    {faculty.intakes.map((intake) => (
                      <div key={intake.id} className="border-b border-gray-100 last:border-b-0">
                        <div
                          className="flex items-center justify-between p-3 pl-8 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleIntake(faculty.id, intake.id)}
                        >
                          <div className="flex items-center">
                            {expandedIntakes[`${faculty.id}-${intake.id}`] ? 
                              <ChevronDown className="w-4 h-4 text-gray-500 mr-2" /> : 
                              <ChevronRight className="w-4 h-4 text-gray-500 mr-2" />
                            }
                            <span className="text-gray-700">Year {intake.year}</span>
                          </div>
                        </div>

                        {/* Semester Level */}
                        {expandedIntakes[`${faculty.id}-${intake.id}`] && intake.semesters && (
                          <div className="border-l-2 border-gray-200 ml-4">
                            {intake.semesters.map((semester) => (
                              <div key={semester.id} className="border-b border-gray-100 last:border-b-0">
                                <div
                                  className="flex items-center justify-between p-3 pl-8 hover:bg-gray-50 cursor-pointer"
                                  onClick={() => toggleSemester(faculty.id, intake.id, semester.id)}
                                >
                                  <div className="flex items-center">
                                    {expandedSemesters[`${faculty.id}-${intake.id}-${semester.id}`] ? 
                                      <ChevronDown className="w-4 h-4 text-gray-500 mr-2" /> : 
                                      <ChevronRight className="w-4 h-4 text-gray-500 mr-2" />
                                    }
                                    <span className="text-gray-700">{semester.name}</span>
                                  </div>
                                </div>

                                {/* Module Level */}
                                {expandedSemesters[`${faculty.id}-${intake.id}-${semester.id}`] && semester.modules && (
                                  <div className="border-l-2 border-gray-200 ml-4">
                                    {semester.modules.map((module) => (
                                      <div
                                        key={module.id}
                                        className="flex items-center justify-between p-3 pl-8 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => fetchContentByPath(faculty.id, intake.id, semester.id, module.id)}
                                      >
                                        <div className="flex items-center">
                                          <BookOpen className="w-4 h-4 text-green-500 mr-2" />
                                          <span className="text-gray-700">{module.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{module.code}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Content</h3>
          
          {selectedPath ? (
            <div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Showing content for selected path
                </p>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : pathContent.length > 0 ? (
                <div className="space-y-3">
                  {pathContent.map((content) => (
                    <div key={`${content.content_type}-${content.content_id}`} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          {getContentIcon(content.content_type)}
                          <h4 className="ml-2 font-semibold text-gray-800">{content.content_title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(content.content_status)}`}>
                            {content.content_status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(content.content_priority)}`}>
                            {content.content_priority}
                          </span>
                        </div>
                      </div>
                      
                      {content.content_description && (
                        <p className="text-gray-600 text-sm mb-3">{content.content_description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          {content.module_name && (
                            <span className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {content.module_name}
                            </span>
                          )}
                          {content.content_due_date && (
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(content.content_due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(content.content_created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No content available for this selection</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Folder className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Select a module from the navigation to view content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HierarchicalContent;
