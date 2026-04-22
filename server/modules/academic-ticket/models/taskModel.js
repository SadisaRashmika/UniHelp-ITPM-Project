const db = require('../../../config/db'); // Use the shared database connection

/**
 * Initialize quizzes table with all required columns including type
 */
const initializeQuizzesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'active',
        course_code VARCHAR(50),
        lecturer_id VARCHAR(50),
        max_marks INTEGER DEFAULT 100,
        duration INTEGER DEFAULT 60,
        questions JSONB DEFAULT '[]',
        type VARCHAR(20) DEFAULT 'quiz', -- 'quiz' or 'practical'
        module_id INTEGER, -- Link to modules table
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  const alterTableQuery = `
    DO $$ 
    BEGIN 
      -- Add missing columns if they don't exist
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='type') THEN
        ALTER TABLE quizzes ADD COLUMN type VARCHAR(20) DEFAULT 'quiz';
      END IF;
      -- (Other column checks are already here from previous turn, omitted for brevity but should be maintained)
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='description') THEN
        ALTER TABLE quizzes ADD COLUMN description TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='due_date') THEN
        ALTER TABLE quizzes ADD COLUMN due_date DATE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='priority') THEN
        ALTER TABLE quizzes ADD COLUMN priority VARCHAR(50) DEFAULT 'medium';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='status') THEN
        ALTER TABLE quizzes ADD COLUMN status VARCHAR(50) DEFAULT 'active';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='course_code') THEN
        ALTER TABLE quizzes ADD COLUMN course_code VARCHAR(50);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='lecturer_id') THEN
        ALTER TABLE quizzes ADD COLUMN lecturer_id VARCHAR(50);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='max_marks') THEN
        ALTER TABLE quizzes ADD COLUMN max_marks INTEGER DEFAULT 100;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='duration') THEN
        ALTER TABLE quizzes ADD COLUMN duration INTEGER DEFAULT 60;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='questions') THEN
        ALTER TABLE quizzes ADD COLUMN questions JSONB DEFAULT '[]';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='module_id') THEN
        ALTER TABLE quizzes ADD COLUMN module_id INTEGER;
      END IF;
    END $$;
  `;

  try {
    await db.query(createTableQuery);
    await db.query(alterTableQuery);
    console.log('✅ Quizzes/Practicals table fully initialized');
  } catch (err) {
    console.error('❌ Error initializing quizzes table:', err.message);
  }
};

const initializeSubmissionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        student_id VARCHAR(50), 
        answer TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        grade INTEGER,
        feedback TEXT
    );
  `;
  try {
    await db.query(query);
    console.log('✅ Submissions table initialized');
  } catch (err) {
    console.error('❌ Error initializing submissions table:', err.message);
  }
};

// --- QUIZ/PRACTICAL MODEL FUNCTIONS ---

const createQuiz = async (quizData) => {
  const { title, description, due_date, priority, status, course_code, lecturer_id, max_marks, duration, questions, type, module_id } = quizData;
  const query = `
    INSERT INTO quizzes (title, description, due_date, priority, status, course_code, lecturer_id, max_marks, duration, questions, type, module_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
  const result = await db.query(query, [
    title, 
    description, 
    due_date, 
    priority || 'medium', 
    status || 'active', 
    course_code, 
    lecturer_id, 
    max_marks || 100, 
    duration || 60, 
    JSON.stringify(questions || []),
    type || 'quiz',
    module_id
  ]);
  return result.rows[0];
};

const getQuizzes = async (filters = {}) => {
  let query = 'SELECT * FROM quizzes WHERE 1=1';
  const values = [];
  let paramIndex = 1;

  if (filters.lecturer_id) {
    query += ` AND lecturer_id = $${paramIndex}`;
    values.push(filters.lecturer_id);
    paramIndex++;
  }

  if (filters.type) {
    query += ` AND type = $${paramIndex}`;
    values.push(filters.type);
    paramIndex++;
  }

  if (filters.module_id) {
    query += ` AND module_id = $${paramIndex}`;
    values.push(filters.module_id);
    paramIndex++;
  }

  query += ' ORDER BY created_at DESC';
  const result = await db.query(query, values);
  return result.rows;
};

const getQuizById = async (id) => {
  const query = 'SELECT * FROM quizzes WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const updateQuiz = async (id, updates) => {
  const setClause = [];
  const values = [];
  let paramIndex = 1;

  Object.keys(updates).forEach(key => {
    setClause.push(`${key} = $${paramIndex}`);
    if (key === 'questions') {
      values.push(JSON.stringify(updates[key]));
    } else {
      values.push(updates[key]);
    }
    paramIndex++;
  });

  const query = `
    UPDATE quizzes 
    SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  values.push(id);
  
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteQuiz = async (id) => {
  const query = 'DELETE FROM quizzes WHERE id = $1 RETURNING id';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// --- SUBMISSION MODEL FUNCTIONS ---

const createSubmission = async (submissionData) => {
  const { quiz_id, student_id, answer } = submissionData;
  const query = `
    INSERT INTO submissions (quiz_id, student_id, answer)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await db.query(query, [quiz_id, student_id, answer]);
  return result.rows[0];
};

const getSubmissions = async (filters = {}) => {
  let query = `
    SELECT s.*, q.title as quiz_title, q.type as quiz_type 
    FROM submissions s
    JOIN quizzes q ON s.quiz_id = q.id
    WHERE 1=1
  `;
  const values = [];
  let paramIndex = 1;

  if (filters.quiz_id) {
    query += ` AND s.quiz_id = $${paramIndex}`;
    values.push(filters.quiz_id);
    paramIndex++;
  }

  if (filters.student_id) {
    query += ` AND s.student_id = $${paramIndex}`;
    values.push(filters.student_id);
    paramIndex++;
  }

  if (filters.lecturer_id) {
    query += ` AND q.lecturer_id = $${paramIndex}`;
    values.push(filters.lecturer_id);
    paramIndex++;
  }

  query += ' ORDER BY s.submitted_at DESC';
  const result = await db.query(query, values);
  return result.rows;
};

const gradeSubmission = async (id, gradeData) => {
  const { grade, feedback } = gradeData;
  const query = `
    UPDATE submissions 
    SET grade = $1, feedback = $2
    WHERE id = $3
    RETURNING *
  `;
  const result = await db.query(query, [grade, feedback, id]);
  return result.rows[0];
};

const getRecentActivities = async (lecturer_id, limit = 5) => {
  const query = `
    SELECT * FROM quizzes 
    WHERE lecturer_id = $1 
    ORDER BY created_at DESC 
    LIMIT $2
  `;
  const result = await db.query(query, [lecturer_id, limit]);
  return result.rows;
};

// Initialize tables on load
initializeQuizzesTable();
initializeSubmissionsTable();

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  createSubmission,
  getSubmissions,
  gradeSubmission,
  getRecentActivities
};
