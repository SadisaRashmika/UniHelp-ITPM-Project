const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uni-help',
  password: '123456789',
  port: 5432,
});

async function createQuizJobTable() {
  try {
    console.log('=== CREATING QUIZ_JOB TABLE ===');
    
    // Drop table if it exists (for fresh creation)
    await db.query('DROP TABLE IF EXISTS quiz_job CASCADE');
    console.log('Dropped existing quiz_job table if it existed');
    
    // Create quiz_job table
    const createTableQuery = `
      CREATE TABLE quiz_job (
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
        questions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(50),
        type VARCHAR(20) DEFAULT 'quiz',
        module_id INTEGER,
        faculty_id INTEGER,
        intake_id INTEGER,
        semester_id INTEGER,
        total_marks INTEGER,
        job_status VARCHAR(50) DEFAULT 'active',
        job_priority VARCHAR(50) DEFAULT 'normal',
        assigned_to VARCHAR(50),
        deadline DATE,
        completion_status VARCHAR(50) DEFAULT 'incomplete',
        notes TEXT,
        CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        CONSTRAINT chk_status CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
        CONSTRAINT chk_type CHECK (type IN ('quiz', 'practical', 'assignment')),
        CONSTRAINT chk_job_status CHECK (job_status IN ('active', 'inactive', 'completed')),
        CONSTRAINT chk_job_priority CHECK (job_priority IN ('low', 'normal', 'high', 'urgent')),
        CONSTRAINT chk_completion_status CHECK (completion_status IN ('incomplete', 'in_progress', 'completed'))
      )
    `;
    
    await db.query(createTableQuery);
    console.log('Created quiz_job table successfully');
    
    // Create indexes for better performance
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_quiz_job_lecturer_id ON quiz_job(lecturer_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_job_module_id ON quiz_job(module_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_job_status ON quiz_job(status);
      CREATE INDEX IF NOT EXISTS idx_quiz_job_type ON quiz_job(type);
      CREATE INDEX IF NOT EXISTS idx_quiz_job_created_at ON quiz_job(created_at);
      CREATE INDEX IF NOT EXISTS idx_quiz_job_job_status ON quiz_job(job_status);
    `;
    
    await db.query(createIndexesQuery);
    console.log('Created indexes for quiz_job table');
    
    // Create trigger for updated_at
    const createTriggerQuery = `
      CREATE OR REPLACE FUNCTION update_quiz_job_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      CREATE TRIGGER update_quiz_job_updated_at
        BEFORE UPDATE ON quiz_job
        FOR EACH ROW
        EXECUTE FUNCTION update_quiz_job_updated_at();
    `;
    
    await db.query(createTriggerQuery);
    console.log('Created trigger for updated_at');
    
    console.log('=== QUIZ_JOB TABLE CREATED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('Error creating quiz_job table:', error);
  } finally {
    await db.end();
  }
}

createQuizJobTable();
