const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

async function getTableSchema(tableName) {
  const result = await pool.query(`
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position
  `, [tableName]);
  return result.rows;
}

async function getTableData(tableName) {
  const result = await pool.query(`SELECT * FROM "${tableName}"`);
  return result.rows;
}

async function generateSQL() {
  try {
    console.log('Connecting to database...');
    
    // Get all table names
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tableNames = tables.rows.map(r => r.table_name);
    console.log('Tables found:', tableNames.join(', '));
    
    let sql = `BEGIN;\n\n`;
    sql += `-- =====================================================================================\n`;
    sql += `-- Database: ${process.env.DB_NAME}\n`;
    sql += `-- Exported: ${new Date().toISOString()}\n`;
    sql += `-- =====================================================================================\n\n`;
    
    // Drop all tables
    sql += `-- =====================================================================================\n`;
    sql += `-- DROP EXISTING TABLES\n`;
    sql += `-- =====================================================================================\n`;
    for (const table of tableNames) {
      sql += `DROP TABLE IF EXISTS ${table} CASCADE;\n`;
    }
    sql += `\n`;
    
    // Create tables
    sql += `-- =====================================================================================\n`;
    sql += `-- CREATE TABLES\n`;
    sql += `-- =====================================================================================\n\n`;
    
    for (const table of tableNames) {
      const columns = await getTableSchema(table);
      let createSql = `CREATE TABLE ${table} (\n`;
      
      const columnDefs = columns.map(col => {
        let def = `  ${col.column_name} ${col.data_type}`;
        if (col.column_default) {
          def += ` DEFAULT ${col.column_default}`;
        }
        if (col.is_nullable === 'NO') {
          def += ` NOT NULL`;
        }
        return def;
      }).join(',\n');
      
      createSql += columnDefs + '\n);\n\n';
      sql += createSql;
    }
    
    // Get constraints
    sql += `-- =====================================================================================\n`;
    sql += `-- CONSTRAINTS & INDEXES\n`;
    sql += `-- =====================================================================================\n\n`;
    
    for (const table of tableNames) {
      // Skip FK constraints - they're part of CREATE TABLE definition
      
      const indexes = await pool.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = $1 AND indexname NOT LIKE 'pg_toast%'
      `, [table]);
      
      for (const idx of indexes.rows) {
        if (!idx.indexdef.includes('PRIMARY KEY')) {
          sql += `${idx.indexdef};\n`;
        }
      }
    }
    sql += `\n`;
    
    // Insert data
    sql += `-- =====================================================================================\n`;
    sql += `-- DATA INSERTS\n`;
    sql += `-- =====================================================================================\n\n`;
    
    for (const table of tableNames) {
      const rows = await getTableData(table);
      
      if (rows.length === 0) {
        sql += `-- ${table}: no data\n\n`;
        continue;
      }
      
      const columns = await getTableSchema(table);
      const columnNames = columns.map(c => c.column_name);
      
      for (const row of rows) {
        const values = columnNames.map(col => {
          const val = row[col];
          if (val === null) {
            return 'NULL';
          }
          if (typeof val === 'string') {
            return `'${val.replace(/'/g, "''")}'`;
          }
          if (typeof val === 'boolean') {
            return val ? 'TRUE' : 'FALSE';
          }
          if (typeof val === 'object') {
            return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
          }
          return String(val);
        }).join(', ');
        
        sql += `INSERT INTO ${table} (${columnNames.join(', ')}) VALUES (${values});\n`;
      }
      sql += `\n`;
    }
    
    sql += `\nCOMMIT;\n`;
    
    // Write to file
    const outputPath = path.join(__dirname, '../z-database/full_v2.sql');
    fs.writeFileSync(outputPath, sql);
    console.log(`Database exported to: ${outputPath}`);
    console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

generateSQL();
