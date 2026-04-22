// Import database connection for database operations
const db = require('../../../config/db');

// Get all quizzes for a specific lecturer with optional structure filtering
// Returns quizzes filtered by lecturer ID and optionally by faculty/intake/semester/module
const getQuizzes = async (req, res) => {
  try {
    const { 
      lecturer_id, 
      faculty_id, 
      intake_id, 
      semester_id, 
      module_id,
      type,
      student_id
    } = req.query; // Extract filter parameters from query
    
    // Build the base query with joins to get module and structure information
    let query = `
      SELECT 
        q.id,
        q.title,
        q.description,
        q.duration,
        q.total_marks,
        q.created_by as lecturer_id,
        q.module_id,
        q.questions,
        q.type,
        q.created_at,
        q.updated_at,
        m.code as module_code,
        m.name as module_name,
        m.faculty_id,
        m.intake_id,
        m.semester_id,
        f.name as faculty_name,
        i.year as intake_year,
        s.name as semester_name
      FROM quizzes q
      LEFT JOIN modules m ON q.module_id = m.id
      LEFT JOIN faculties f ON m.faculty_id = f.id
      LEFT JOIN intakes i ON m.intake_id = i.id
      LEFT JOIN semesters s ON m.semester_id = s.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Add filters dynamically
    if (lecturer_id) {
      query += ` AND q.created_by = $${paramIndex}`;
      params.push(lecturer_id);
      paramIndex++;
    }
    
    if (faculty_id) {
      query += ` AND m.faculty_id = $${paramIndex}`;
      params.push(faculty_id);
      paramIndex++;
    }
    
    if (intake_id) {
      query += ` AND m.intake_id = $${paramIndex}`;
      params.push(intake_id);
      paramIndex++;
    }
    
    if (semester_id) {
      query += ` AND m.semester_id = $${paramIndex}`;
      params.push(semester_id);
      paramIndex++;
    }
    
    if (module_id) {
      query += ` AND q.module_id = $${paramIndex}`;
      params.push(module_id);
      paramIndex++;
    }
    
    if (type) {
      query += ` AND q.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    query += ` ORDER BY q.created_at DESC`;
    
    const result = await db.query(query, params);
    
    // Return success response with filtered quizzes
    res.json({
      success: true,
      data: result.rows,
      quizzes: result.rows // Added for compatibility with Overview.jsx
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error); // Log error for debugging
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes'
    });
  }
};

// Get single quiz by ID
// Returns specific quiz details with all questions and answers
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params; // Extract quiz ID from URL parameters
    
    // Mock quiz data for demonstration purposes
    // In production, this would fetch from database using the ID
    const mockQuiz = {
      id: parseInt(id), // Convert string ID to integer
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics',
      course: 'Web Development',
      lecturer_id: 'LEC001',
      duration: 30, // Quiz duration in minutes
      total_marks: 50, // Total possible marks
      created_at: '2026-03-20T10:00:00Z',
      questions: [
        {
          id: 1,
          question: 'What is React?',
          options: ['A library', 'A framework', 'A database', 'An operating system'],
          correct_answer: 'A library'
        },
        {
          id: 2,
          question: 'What is JSX?',
          options: ['JavaScript XML', 'Java XML', 'JSON XML', 'JavaScript Extension'],
          correct_answer: 'JavaScript XML'
        }
      ]
    };

    // Return success response with quiz data
    res.json({
      success: true,
      data: mockQuiz
    });
  } catch (error) {
    console.error('Error fetching quiz:', error); // Log error for debugging
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz'
    });
  }
};

// Create new quiz with faculty/intake/semester/module structure
// Handles quiz creation with questions and structure assignments
const createQuiz = async (req, res) => {
  try {
    const {
      title,
      questions,
      faculty_id,
      intake_id,
      semester_id,
      type = 'quiz'
    } = req.body; // Extract quiz data from request body

    // Normalize payload to support both quiz and practical forms.
    const normalizedDescription = (req.body.description ?? req.body.instructions ?? '').trim();
    const normalizedDuration = Number(req.body.duration ?? 60);
    const normalizedTotalMarks = Number(req.body.total_marks ?? req.body.max_marks ?? 100);
    const normalizedModuleId = Number(req.body.module_id);

    // Validate required and numeric fields with clear feedback.
    const missingFields = [];
    if (!title || !String(title).trim()) missingFields.push('title');
    if (!Number.isFinite(normalizedModuleId) || normalizedModuleId <= 0) missingFields.push('module_id');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid fields: ${missingFields.join(', ')}`
      });
    }

    if (!Number.isFinite(normalizedDuration) || normalizedDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'duration must be a positive number'
      });
    }

    if (!Number.isFinite(normalizedTotalMarks) || normalizedTotalMarks <= 0) {
      return res.status(400).json({
        success: false,
        message: 'total_marks must be a positive number'
      });
    }

    // Get lecturer ID from auth or fallback for testing
    const lecturerId = req.user?.id || 'LEC001';
    
    // Insert quiz into database
    const query = `
      INSERT INTO quizzes (
        title, description, duration, total_marks, questions, 
        created_by, module_id, type, faculty_id, intake_id, semester_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *
    `;
    
    const values = [
      title,
      normalizedDescription || (type === 'practical' ? 'Practical assessment' : 'Quiz assessment'),
      normalizedDuration,
      normalizedTotalMarks,
      JSON.stringify(questions || []),
      lecturerId,
      normalizedModuleId,
      type,
      faculty_id ? parseInt(faculty_id) : null,
      intake_id ? parseInt(intake_id) : null,
      semester_id ? parseInt(semester_id) : null
    ];
    
    const result = await db.query(query, values);
    
    // Return success response with created quiz data
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating quiz:', error); // Log error for debugging
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

// Update existing quiz
// Updates quiz details, questions, or options
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params; // Extract quiz ID from URL parameters
    const updateData = req.body; // Extract update data from request body
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    // Add fields to update dynamically
    if (updateData.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      values.push(updateData.title);
      paramIndex++;
    }
    
    if (updateData.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(updateData.description);
      paramIndex++;
    }
    
    if (updateData.duration !== undefined) {
      updateFields.push(`duration = $${paramIndex}`);
      values.push(parseInt(updateData.duration));
      paramIndex++;
    }
    
    if (updateData.total_marks !== undefined) {
      updateFields.push(`total_marks = $${paramIndex}`);
      values.push(parseInt(updateData.total_marks));
      paramIndex++;
    }
    
    if (updateData.questions !== undefined) {
      updateFields.push(`questions = $${paramIndex}`);
      values.push(JSON.stringify(updateData.questions));
      paramIndex++;
    }
    
    if (updateData.faculty_id !== undefined) {
      updateFields.push(`faculty_id = $${paramIndex}`);
      values.push(parseInt(updateData.faculty_id));
      paramIndex++;
    }
    
    if (updateData.intake_id !== undefined) {
      updateFields.push(`intake_id = $${paramIndex}`);
      values.push(parseInt(updateData.intake_id));
      paramIndex++;
    }
    
    if (updateData.semester_id !== undefined) {
      updateFields.push(`semester_id = $${paramIndex}`);
      values.push(parseInt(updateData.semester_id));
      paramIndex++;
    }
    
    if (updateData.module_id !== undefined) {
      updateFields.push(`module_id = $${paramIndex}`);
      values.push(parseInt(updateData.module_id));
      paramIndex++;
    }
    
    if (updateData.type !== undefined) {
      updateFields.push(`type = $${paramIndex}`);
      values.push(updateData.type);
      paramIndex++;
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;
    
    // Add the WHERE clause parameter (quiz ID)
    values.push(id);
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    const query = `
      UPDATE quizzes 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Return success response with updated data
    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating quiz:', error); // Log error for debugging
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error updating quiz',
      error: error.message
    });
  }
};

// Delete quiz by ID
// Permanently removes quiz from database
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params; // Extract quiz ID from URL parameters
    
    // First check if quiz exists
    const checkQuery = 'SELECT * FROM quizzes WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Delete the quiz
    const deleteQuery = 'DELETE FROM quizzes WHERE id = $1 RETURNING *';
    const deleteResult = await db.query(deleteQuery, [id]);
    
    // Return success response
    res.json({
      success: true,
      message: 'Quiz deleted successfully',
      data: deleteResult.rows[0]
    });
  } catch (error) {
    console.error('Error deleting quiz:', error); // Log error for debugging
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error deleting quiz',
      error: error.message
    });
  }
};

// Submit quiz answers by student
// Handles quiz submission and scoring
const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params; // Extract quiz ID from URL parameters
    const { answers, student_id } = req.body; // Extract answers and student ID from request body
    
    // Mock scoring logic for demonstration
    // In production, this would calculate actual score based on correct answers
    const score = Math.floor(Math.random() * 50) + 50; // Random score between 50-100
    
    // Return success response with submission results
    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        quiz_id: id,
        student_id,
        score, // Calculated score
        total_marks: 100, // Total possible marks
        submitted_at: new Date().toISOString() // Submission timestamp
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error); // Log error for debugging
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz'
    });
  }
};

// Get recent activities for a lecturer
// Returns a list of recently created or modified quizzes and submissions
const getRecentActivities = async (req, res) => {
  try {
    const { lecturer_id, limit = 5 } = req.query;
    
    // Mock data for recent activities (in production, this would be a complex query across multiple tables)
    const activities = [
      {
        id: 1,
        title: 'React Fundamentals Quiz',
        course_code: 'CS101',
        created_at: '2026-03-20T10:00:00Z',
        status: 'active',
        priority: 'high',
        due_date: '2026-04-25'
      },
      {
        id: 2,
        title: 'Database Design Quiz',
        course_code: 'CS103',
        created_at: '2026-03-22T14:30:00Z',
        status: 'active',
        priority: 'medium',
        due_date: '2026-04-28'
      },
      {
        id: 3,
        title: 'Data Structures Quiz',
        course_code: 'CS201',
        created_at: '2026-04-15T09:30:00Z',
        status: 'pending',
        priority: 'low',
        due_date: '2026-05-02'
      }
    ];

    res.json({
      success: true,
      activities: activities.slice(0, limit)
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities'
    });
  }
};

// Export all controller functions for use in routes
module.exports = {
  getQuizzes, // Get all quizzes for lecturer
  getQuizById, // Get single quiz by ID
  createQuiz, // Create new quiz
  updateQuiz, // Update existing quiz
  deleteQuiz, // Delete quiz
  submitQuiz, // Submit quiz answers
  getRecentActivities // Get recent activities for overview
};
