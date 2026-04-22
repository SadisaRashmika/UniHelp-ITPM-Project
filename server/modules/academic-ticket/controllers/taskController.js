// const taskModel = require('../models/taskModel'); // Commented out - using mock data instead

// --- QUIZ/PRACTICAL CONTROLLERS ---

const createQuiz = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      due_date, 
      lecturer_id, 
      priority, 
      status, 
      course_code, 
      max_marks, 
      duration, 
      questions,
      type // 'quiz' or 'practical'
    } = req.body;

    if (!title || !lecturer_id) {
      return res.status(400).json({ message: 'Title and Lecturer ID are required' });
    }

    // Mock quiz creation response
    const quiz = {
      id: Math.floor(Math.random() * 1000) + 1,
      title,
      description,
      due_date,
      lecturer_id,
      priority: priority || 'medium',
      status: status || 'active',
      course_code,
      max_marks: max_marks || 100,
      duration: duration || 60,
      questions: questions || [],
      type: type || 'quiz',
      created_at: new Date().toISOString()
    };

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error creating assessment', error: error.message });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const { lecturer_id, type } = req.query;
    
    // Mock quizzes data
    const mockQuizzes = [
      {
        id: 1,
        title: 'React Fundamentals Quiz',
        description: 'Test your knowledge of React basics',
        lecturer_id: 'LEC001',
        course_code: 'CS101',
        type: 'quiz',
        status: 'active',
        created_at: '2026-04-20T10:00:00Z'
      },
      {
        id: 2,
        title: 'Database Systems Assignment',
        description: 'Complete the database design task',
        lecturer_id: 'LEC001',
        course_code: 'CS103',
        type: 'practical',
        status: 'pending',
        created_at: '2026-04-19T14:30:00Z'
      }
    ];
    
    // Filter by lecturer_id and type if provided
    let filteredQuizzes = mockQuizzes;
    if (lecturer_id) {
      filteredQuizzes = filteredQuizzes.filter(q => q.lecturer_id === lecturer_id);
    }
    if (type) {
      filteredQuizzes = filteredQuizzes.filter(q => q.type === type);
    }
    
    res.status(200).json({ quizzes: filteredQuizzes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    // Mock quiz data
    const quiz = {
      id: parseInt(id),
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics',
      lecturer_id: 'LEC001',
      course_code: 'CS101',
      type: 'quiz',
      status: 'active',
      created_at: '2026-04-20T10:00:00Z'
    };
    if (!quiz) return res.status(404).json({ message: 'Assessment not found' });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment', error: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // Mock update response
    const quiz = {
      id: parseInt(id),
      ...updates,
      updated_at: new Date().toISOString()
    };
    if (!quiz) return res.status(404).json({ message: 'Assessment not found' });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error updating assessment', error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    // Mock delete - always successful
    const result = { deleted: true };
    if (!result) return res.status(404).json({ message: 'Assessment not found' });
    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assessment', error: error.message });
  }
};

// --- SUBMISSION CONTROLLERS ---

const submitQuiz = async (req, res) => {
  try {
    const { quiz_id, student_id, answer } = req.body;
    if (!quiz_id || !student_id) {
      return res.status(400).json({ message: 'Assessment ID and Student ID are required' });
    }
    // Mock submission response
    const submission = {
      id: Math.floor(Math.random() * 1000) + 1,
      quiz_id,
      student_id,
      answer,
      submitted_at: new Date().toISOString()
    };
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assessment', error: error.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { lecturer_id, quiz_id, student_id } = req.query;
    // Mock submissions data
    const mockSubmissions = [
      {
        id: 1,
        quiz_id: 1,
        student_id: 'STU001',
        answer: 'Sample answer',
        submitted_at: '2026-04-20T15:30:00Z'
      }
    ];
    res.status(200).json({ submissions: mockSubmissions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;
    // Mock grading response
    const submission = {
      id: parseInt(id),
      grade,
      feedback,
      graded_at: new Date().toISOString()
    };
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error grading submission', error: error.message });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const { lecturer_id, limit } = req.query;
    if (!lecturer_id) {
      return res.status(400).json({ message: 'Lecturer ID is required' });
    }
    
    // Mock data for recent activities (in production, this would query the database)
    const mockActivities = [
      {
        id: 1,
        title: 'React Fundamentals Quiz',
        course_code: 'CS101',
        created_at: '2026-04-20T10:00:00Z',
        status: 'active',
        priority: 'high',
        due_date: '2026-04-25T23:59:59Z',
        type: 'quiz'
      },
      {
        id: 2,
        title: 'Database Systems Assignment',
        course_code: 'CS103',
        created_at: '2026-04-19T14:30:00Z',
        status: 'pending',
        priority: 'medium',
        due_date: '2026-04-28T23:59:59Z',
        type: 'practical'
      },
      {
        id: 3,
        title: 'Web Development Practical',
        course_code: 'CS102',
        created_at: '2026-04-18T09:15:00Z',
        status: 'active',
        priority: 'low',
        due_date: '2026-04-30T23:59:59Z',
        type: 'practical'
      },
      {
        id: 4,
        title: 'Data Structures Quiz',
        course_code: 'CS201',
        created_at: '2026-04-17T16:45:00Z',
        status: 'completed',
        priority: 'high',
        due_date: '2026-04-22T23:59:59Z',
        type: 'quiz'
      },
      {
        id: 5,
        title: 'Software Engineering Project',
        course_code: 'CS202',
        created_at: '2026-04-16T11:20:00Z',
        status: 'active',
        priority: 'medium',
        due_date: '2026-05-05T23:59:59Z',
        type: 'practical'
      }
    ];
    
    // Filter by lecturer_id and limit results
    const filteredActivities = mockActivities.slice(0, parseInt(limit) || 5);
    
    res.status(200).json({ activities: filteredActivities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getSubmissions,
  gradeSubmission,
  getRecentActivities
};
