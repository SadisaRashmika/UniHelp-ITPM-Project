const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'unihelp',
  password: '1234',
  port: 5432,
});

async function getDatabaseOverview() {
  try {
    console.log('=== DATABASE OVERVIEW ===');
    
    // Test connection
    await db.query('SELECT 1');
    console.log('PostgreSQL connected successfully');
    
    // Get all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    const tablesResult = await db.query(tablesQuery);
    console.log('\nTables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Get schema for key tables
    const keyTables = ['faculties', 'intakes', 'semesters', 'modules', 'quizzes', 'submissions'];
    console.log('\nTABLE SCHEMAS:\n');
    
    for (const tableName of keyTables) {
      try {
        const schemaQuery = `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `;
        const schemaResult = await db.query(schemaQuery, [tableName]);
        
        console.log(`\u001b[33m\u25b9 ${tableName.toUpperCase()} table:\u001b[0m`);
        schemaResult.rows.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)';
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`   - ${col.column_name}: ${col.data_type} ${nullable} ${defaultVal}`);
        });
        
        // Get sample data
        const sampleQuery = `SELECT * FROM ${tableName} LIMIT 3`;
        const sampleResult = await db.query(sampleQuery);
        
        if (sampleResult.rows.length > 0) {
          console.log('   \ud83d\udcdd Sample data:');
          sampleResult.rows.forEach((row, index) => {
            console.log(`     ${index + 1}. ${JSON.stringify(row, null, 6)}`);
          });
        }
        console.log('');
      } catch (err) {
        console.log(`   \u274c Error accessing ${tableName}: ${err.message}`);
      }
    }
    
    console.log('=== END DATABASE OVERVIEW ===');
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await db.end();
  }
}

getDatabaseOverview();
