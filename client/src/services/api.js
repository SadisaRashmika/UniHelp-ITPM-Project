// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:5000';

// Student API endpoints
export const studentAPI = {
  // Get student profile
  getProfile: (studentId) => `${API_BASE_URL}/api/students/${studentId}/profile`,
  
  // Get student submissions
  getSubmissions: (studentId) => `${API_BASE_URL}/api/students/${studentId}/submissions`,
  
  // Submit assignment
  submitAssignment: (studentId, assignmentData) => ({
    url: `${API_BASE_URL}/api/students/${studentId}/submissions`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData),
    },
  }),
  
  // Get student tasks
  getTasks: (studentId) => `${API_BASE_URL}/api/students/${studentId}/tasks`,
  
  // Get student grades
  getGrades: (studentId) => `${API_BASE_URL}/api/students/${studentId}/grades`,
};

// Academic Ticket API endpoints
export const academicAPI = {
  // Quiz endpoints
  getQuizzes: (lecturerId) => `${API_BASE_URL}/api/academic-ticket/quizzes?lecturer_id=${lecturerId}`,
  createQuiz: () => `${API_BASE_URL}/api/academic-ticket/quizzes`,
  getQuizById: (quizId) => `${API_BASE_URL}/api/academic-ticket/quizzes/${quizId}`,
  updateQuiz: (quizId) => ({
    url: `${API_BASE_URL}/api/academic-ticket/quizzes/${quizId}`,
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }),
  deleteQuiz: (quizId) => ({
    url: `${API_BASE_URL}/api/academic-ticket/quizzes/${quizId}`,
    options: {
      method: 'DELETE',
    },
  }),
  
  // Task endpoints
  getTasks: (lecturerId) => `${API_BASE_URL}/api/academic-ticket/tasks?lecturer_id=${lecturerId}`,
  createTask: () => `${API_BASE_URL}/api/academic-ticket/tasks`,
  
  // Recent activities
  getRecentActivities: (lecturerId) => `${API_BASE_URL}/api/academic-ticket/recent-activities?lecturer_id=${lecturerId}`,
};

// Helper function for making API requests
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Export default configuration
export default {
  API_BASE_URL,
  studentAPI,
  academicAPI,
  apiRequest,
};
