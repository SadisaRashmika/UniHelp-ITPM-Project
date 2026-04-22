// Mock data for student submissions
// In production, this would be a database query
const getSubmissions = async (req, res) => {
  try {
    const { lecturer_id } = req.query;
    
    // Mock submissions for demonstration
    const submissions = [
      {
        id: 1,
        student_id: 'ST001',
        quiz_id: 1,
        quiz_title: 'React Fundamentals Quiz',
        submitted_at: '2026-04-10T14:30:00Z',
        grade: 85,
        feedback: 'Excellent work!',
        answer: 'React is a JavaScript library for building user interfaces.'
      },
      {
        id: 2,
        student_id: 'ST002',
        quiz_id: 1,
        quiz_title: 'React Fundamentals Quiz',
        submitted_at: '2026-04-11T09:15:00Z',
        grade: null,
        feedback: '',
        answer: 'React is a framework made by Facebook.'
      },
      {
        id: 3,
        student_id: 'ST003',
        quiz_id: 2,
        quiz_title: 'Database Design Quiz',
        submitted_at: '2026-04-12T11:00:00Z',
        grade: 92,
        feedback: 'Very thorough explanation of normalization.',
        answer: 'Normalization is the process of organizing data in a database.'
      }
    ];

    // Normally we would filter by lecturer_id by joining with quizzes table
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions'
    });
  }
};

const createSubmission = async (req, res) => {
  try {
    console.log('createSubmission called with body:', req.body);
    
    const { quiz_id, student_id, answer } = req.body;
    
    // Validate required fields
    if (!quiz_id || !student_id || !answer) {
      return res.status(400).json({
        success: false,
        message: 'quiz_id, student_id, and answer are required'
      });
    }

    // For now, return a simple success response without database operations
    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: {
        id: Date.now(),
        quiz_id: parseInt(quiz_id),
        student_id,
        answer,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      }
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating submission',
      error: error.message
    });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;
    
    // In production, this would update the database
    res.json({
      success: true,
      message: 'Submission graded successfully',
      data: { id, grade, feedback }
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error grading submission'
    });
  }
};

module.exports = {
  getSubmissions,
  createSubmission,
  gradeSubmission
};
