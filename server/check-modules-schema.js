const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'unihelp',
  password: '1234',
  port: 5432,
});

async function checkModulesSchema() {
  try {
    console.log('=== MODULES TABLE SCHEMA ===');
    
    // Get schema information
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'modules' 
      ORDER BY ordinal_position
    `;
    const schemaResult = await db.query(schemaQuery);
    
    console.log('Columns:');
    schemaResult.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`  - ${col.column_name}: ${col.data_type} ${nullable} ${defaultVal}`);
    });
    
    // Get sample data
    const sampleQuery = 'SELECT * FROM modules LIMIT 5';
    const sampleResult = await db.query(sampleQuery);
    
    console.log('\nSample data:');
    sampleResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${JSON.stringify(row)}`);
    });
    
    console.log('\n=== END MODULES SCHEMA ===');
    
  } catch (error) {
    console.error('Error checking modules schema:', error);
  } finally {
    await db.end();
  }
}

checkModulesSchema();
