const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uni-help',
  password: '123456789',
  port: 5432,
});

async function checkAllData() {
  try {
    console.log('=== CHECKING ALL DATABASE DATA ===');
    
    // Test connection
    await db.query('SELECT 1');
    console.log('✅ PostgreSQL connected successfully');
    
    // Check all tables and their data count
    const tables = ['faculties', 'intakes', 'semesters', 'modules', 'quizzes', 'submissions'];
    
    for (const tableName of tables) {
      try {
        const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
        const countResult = await db.query(countQuery);
        const count = countResult.rows[0].count;
        
        console.log(`\n📊 ${tableName.toUpperCase()} table: ${count} records`);
        
        if (count > 0) {
          // Get sample data
          const sampleQuery = `SELECT * FROM ${tableName} LIMIT 5`;
          const sampleResult = await db.query(sampleQuery);
          
          sampleResult.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${JSON.stringify(row)}`);
          });
        }
      } catch (err) {
        console.log(`   ❌ Error accessing ${tableName}: ${err.message}`);
      }
    }
    
    console.log('\n=== END DATABASE DATA CHECK ===');
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await db.end();
  }
}

checkAllData();
