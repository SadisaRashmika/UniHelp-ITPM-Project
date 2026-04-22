const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'uni-help',
});

// Initialize practicals table
const initializePracticalsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS practicals (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      due_date DATE,
      priority VARCHAR(50) DEFAULT 'medium',
      status VARCHAR(50) DEFAULT 'pending',
      course_code VARCHAR(20),
      lecturer_id VARCHAR(50),
      max_marks INTEGER DEFAULT 100,
      duration INTEGER DEFAULT 60,
      practical_type VARCHAR(20) DEFAULT 'lab',
      instructions TEXT,
      requirements JSONB DEFAULT '[]',
      resources JSONB DEFAULT '[]',
      submission_type VARCHAR(20) DEFAULT 'file',
      lab_equipment JSONB DEFAULT '[]',
      software_requirements JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_practicals_lecturer_id ON practicals(lecturer_id);
    CREATE INDEX IF NOT EXISTS idx_practicals_course_code ON practicals(course_code);
    CREATE INDEX IF NOT EXISTS idx_practicals_status ON practicals(status);
    CREATE INDEX IF NOT EXISTS idx_practicals_due_date ON practicals(due_date);
    CREATE INDEX IF NOT EXISTS idx_practicals_created_at ON practicals(created_at);

    CREATE TRIGGER update_practicals_updated_at 
      BEFORE UPDATE ON practicals 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Practicals table initialized successfully');
  } catch (error) {
    console.error('Error initializing practicals table:', error);
    throw error;
  }
};

// Create a new practical
const createPractical = async (practicalData) => {
  console.log('=== PRACTICAL CREATION DEBUG ===');
  console.log('Input practicalData:', practicalData);

  const { 
    title, 
    description, 
    due_date, 
    priority, 
    course_code, 
    lecturer_id, 
    max_marks, 
    duration, 
    practical_type, 
    instructions, 
    requirements, 
    resources, 
    submission_type, 
    lab_equipment, 
    software_requirements, 
    status 
  } = practicalData;

  const query = `
    INSERT INTO practicals (title, description, due_date, priority, course_code, lecturer_id, max_marks, duration, practical_type, instructions, requirements, resources, submission_type, lab_equipment, software_requirements, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *
  `;

  const values = [
    title,
    description,
    due_date,
    priority || 'medium',
    course_code,
    lecturer_id,
    max_marks || 100,
    duration || 60,
    practical_type || 'lab',
    instructions || '',
    JSON.stringify(requirements || []),
    JSON.stringify(resources || []),
    submission_type || 'file',
    JSON.stringify(lab_equipment || []),
    JSON.stringify(software_requirements || []),
    status || 'pending'
  ];

  console.log('SQL Query:', query);
  console.log('SQL Values:', values);

  try {
    console.log('Executing database query...');
    const result = await pool.query(query, values);
    console.log('Database query successful!');
    console.log('Result rows:', result.rows);
    console.log('Inserted practical:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Database query failed:', error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to create practical: ${error.message}`);
  }
};

// Get practicals with filters
const getPracticals = async (filters = {}, limit = 20, offset = 0) => {
  let query = 'SELECT * FROM practicals WHERE 1=1';
  const values = [];
  let paramIndex = 1;

  if (filters.lecturer_id) {
    query += ` AND lecturer_id = $${paramIndex++}`;
    values.push(filters.lecturer_id);
  }

  if (filters.course_code) {
    query += ` AND course_code = $${paramIndex++}`;
    values.push(filters.course_code);
  }

  if (filters.status) {
    query += ` AND status = $${paramIndex++}`;
    values.push(filters.status);
  }

  if (filters.practical_type) {
    query += ` AND practical_type = $${paramIndex++}`;
    values.push(filters.practical_type);
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  values.push(limit, offset);

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching practicals:', error);
    throw new Error(`Failed to fetch practicals: ${error.message}`);
  }
};

// Get practical by ID
const getPracticalById = async (id) => {
  const query = 'SELECT * FROM practicals WHERE id = $1';
  
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching practical by ID:', error);
    throw new Error(`Failed to fetch practical: ${error.message}`);
  }
};

// Update practical
const updatePractical = async (id, updateData) => {
  const allowedFields = ['title', 'description', 'due_date', 'priority', 'status', 'max_marks', 'duration', 'practical_type', 'instructions', 'requirements', 'resources', 'submission_type', 'lab_equipment', 'software_requirements'];
  
  const updateFields = [];
  const values = [];
  let paramIndex = 1;

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      updateFields.push(`${key} = $${paramIndex++}`);
      if (key === 'requirements' || key === 'resources' || key === 'lab_equipment' || key === 'software_requirements') {
        values.push(JSON.stringify(updateData[key]));
      } else {
        values.push(updateData[key]);
      }
    }
  });

  if (updateFields.length === 0) {
    throw new Error('No valid fields to update');
  }

  const query = `UPDATE practicals SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}`;
  values.push(id);

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating practical:', error);
    throw new Error(`Failed to update practical: ${error.message}`);
  }
};

// Delete practical
const deletePractical = async (id) => {
  const query = 'DELETE FROM practicals WHERE id = $1 RETURNING *';
  
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting practical:', error);
    throw new Error(`Failed to delete practical: ${error.message}`);
  }
};

// Get recent practical activities for overview
const getRecentPracticalActivities = async (lecturer_id, limit = 10) => {
  const query = `
    SELECT * FROM practicals 
    WHERE lecturer_id = $1 
    ORDER BY updated_at DESC 
    LIMIT $2
  `;
  
  try {
    const result = await pool.query(query, [lecturer_id, parseInt(limit)]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching recent practical activities:', error);
    throw new Error(`Failed to get recent practical activities: ${error.message}`);
  }
};

module.exports = {
  initializePracticalsTable,
  createPractical,
  getPracticals,
  getPracticalById,
  updatePractical,
  deletePractical,
  getRecentPracticalActivities,
};
