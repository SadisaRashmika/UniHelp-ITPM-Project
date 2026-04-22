const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'unihelp',
  password: '1234',
  port: 5432,
});

async function checkSubmissionsTable() {
  try {
    console.log('=== SUBMISSIONS TABLE CHECK ===');
    
    // Check if table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'submissions'
      );
    `;
    const tableExistsResult = await db.query(tableExistsQuery);
    const tableExists = tableExistsResult.rows[0].exists;
    
    if (!tableExists) {
      console.log('Submissions table does not exist. Creating it...');
      
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS submissions (
          id SERIAL PRIMARY KEY,
          quiz_id INTEGER REFERENCES quizzes(id),
          student_id VARCHAR(50),
          answer TEXT,
          submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          grade INTEGER,
          feedback TEXT,
          quiz_title VARCHAR(255)
        );
      `;
      
      await db.query(createTableQuery);
      console.log('Submissions table created successfully!');
    } else {
      console.log('Submissions table exists.');
    }
    
    // Get schema information
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'submissions' 
      ORDER BY ordinal_position
    `;
    const schemaResult = await db.query(schemaQuery);
    
    console.log('\nColumns:');
    schemaResult.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`  - ${col.column_name}: ${col.data_type} ${nullable} ${defaultVal}`);
    });
    
    // Get sample data
    const sampleQuery = 'SELECT * FROM submissions LIMIT 5';
    const sampleResult = await db.query(sampleQuery);
    
    console.log('\nSample data:');
    if (sampleResult.rows.length > 0) {
      sampleResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${JSON.stringify(row)}`);
      });
    } else {
      console.log('  No data in submissions table');
    }
    
    console.log('\n=== END SUBMISSIONS TABLE CHECK ===');
    
  } catch (error) {
    console.error('Error checking submissions table:', error);
  } finally {
    await db.end();
  }
}

checkSubmissionsTable();
