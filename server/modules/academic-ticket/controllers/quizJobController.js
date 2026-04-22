const db = require('../../../config/db');

// CREATE - Create a new quiz job
const createQuizJob = async (req, res) => {
  try {
    const {
      title,
      description,
      due_date,
      priority = 'medium',
      status = 'pending',
      course_code,
      lecturer_id,
      max_marks = 100,
      duration = 60,
      questions,
      type = 'quiz',
      module_id,
      faculty_id,
      intake_id,
      semester_id,
      total_marks,
      job_status = 'active',
      job_priority = 'normal',
      assigned_to,
      deadline,
      notes
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Get lecturer ID from auth or fallback for testing
    const lecturerId = req.user ? req.user.id : lecturer_id || 'LEC001';

    const insertQuery = `
      INSERT INTO quiz_job (
        title,
        description,
        due_date,
        priority,
        status,
        course_code,
        lecturer_id,
        max_marks,
        duration,
        questions,
        type,
        module_id,
        faculty_id,
        intake_id,
        semester_id,
        total_marks,
        job_status,
        job_priority,
        assigned_to,
        deadline,
        completion_status,
        notes,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *;
    `;
    
    const values = [
      title.trim(),
      description || '',
      due_date || null,
      priority,
      status,
      course_code || '',
      lecturerId,
      max_marks,
      duration,
      JSON.stringify(questions || []),
      type,
      module_id ? parseInt(module_id) : null,
      faculty_id ? parseInt(faculty_id) : null,
      intake_id ? parseInt(intake_id) : null,
      semester_id ? parseInt(semester_id) : null,
      total_marks || max_marks,
      job_status,
      job_priority,
      assigned_to || '',
      deadline || due_date || null,
      'incomplete',
      notes || '',
      lecturerId
    ];

    const result = await db.query(insertQuery, values);
    
    res.status(201).json({
      success: true,
      message: 'Quiz job created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating quiz job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating quiz job',
      error: error.message
    });
  }
};

// READ - Get all quiz jobs
const getQuizJobs = async (req, res) => {
  try {
    const { lecturer_id, module_id, faculty_id, intake_id, semester_id, type, status, job_status } = req.query;
    
    let query = `
      SELECT 
        qj.*,
        m.name as module_name,
        m.code as module_code,
        f.name as faculty_name,
        i.year as intake_year,
        s.name as semester_name
      FROM quiz_job qj
      LEFT JOIN modules m ON qj.module_id = m.id
      LEFT JOIN faculties f ON qj.faculty_id = f.id
      LEFT JOIN intakes i ON qj.intake_id = i.id
      LEFT JOIN semesters s ON qj.semester_id = s.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (lecturer_id) {
      query += ` AND qj.lecturer_id = $${paramIndex}`;
      params.push(lecturer_id);
      paramIndex++;
    }
    
    if (module_id) {
      query += ` AND qj.module_id = $${paramIndex}`;
      params.push(module_id);
      paramIndex++;
    }

    if (faculty_id) {
      query += ` AND qj.faculty_id = $${paramIndex}`;
      params.push(faculty_id);
      paramIndex++;
    }

    if (intake_id) {
      query += ` AND qj.intake_id = $${paramIndex}`;
      params.push(intake_id);
      paramIndex++;
    }

    if (semester_id) {
      query += ` AND qj.semester_id = $${paramIndex}`;
      params.push(semester_id);
      paramIndex++;
    }
    
    if (type) {
      query += ` AND qj.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    if (status) {
      query += ` AND qj.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (job_status) {
      query += ` AND qj.job_status = $${paramIndex}`;
      params.push(job_status);
      paramIndex++;
    }
    
    query += ` ORDER BY qj.created_at DESC`;
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching quiz jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz jobs',
      error: error.message
    });
  }
};

// READ - Get single quiz job by ID
const getQuizJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        qj.*,
        m.name as module_name,
        m.code as module_code,
        f.name as faculty_name,
        i.year as intake_year,
        s.name as semester_name
      FROM quiz_job qj
      LEFT JOIN modules m ON qj.module_id = m.id
      LEFT JOIN faculties f ON qj.faculty_id = f.id
      LEFT JOIN intakes i ON qj.intake_id = i.id
      LEFT JOIN semesters s ON qj.semester_id = s.id
      WHERE qj.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz job not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching quiz job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz job',
      error: error.message
    });
  }
};

// UPDATE - Update quiz job
const updateQuizJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    const { id: _, created_at, updated_at, created_by, ...allowedUpdates } = updateData;
    
    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    Object.keys(allowedUpdates).forEach(key => {
      updateFields.push(`${key} = $${paramIndex}`);
      values.push(allowedUpdates[key]);
      paramIndex++;
    });
    
    values.push(id); // Add id for WHERE clause
    
    const updateQuery = `
      UPDATE quiz_job 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz job not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Quiz job updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating quiz job:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quiz job',
      error: error.message
    });
  }
};

// DELETE - Delete quiz job
const deleteQuizJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if quiz job exists
    const checkQuery = 'SELECT id FROM quiz_job WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz job not found'
      });
    }
    
    // Delete the quiz job
    const deleteQuery = 'DELETE FROM quiz_job WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);
    
    res.json({
      success: true,
      message: 'Quiz job deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting quiz job:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting quiz job',
      error: error.message
    });
  }
};

// PATCH - Update quiz job status
const updateQuizJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, job_status, completion_status } = req.body;
    
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }
    
    if (job_status !== undefined) {
      updateFields.push(`job_status = $${paramIndex}`);
      values.push(job_status);
      paramIndex++;
    }
    
    if (completion_status !== undefined) {
      updateFields.push(`completion_status = $${paramIndex}`);
      values.push(completion_status);
      paramIndex++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No status fields provided'
      });
    }
    
    values.push(id);
    
    const updateQuery = `
      UPDATE quiz_job 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz job not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Quiz job status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating quiz job status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quiz job status',
      error: error.message
    });
  }
};

module.exports = {
  createQuizJob,
  getQuizJobs,
  getQuizJobById,
  updateQuizJob,
  deleteQuizJob,
  updateQuizJobStatus
};
