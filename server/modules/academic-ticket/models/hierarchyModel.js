const db = require('../../../config/db');

/**
 * Initialize Hierarchy Tables
 */
const initializeHierarchyTables = async () => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS faculties (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS intakes (
            id SERIAL PRIMARY KEY,
            year INTEGER NOT NULL UNIQUE
        )`,
        `CREATE TABLE IF NOT EXISTS semesters (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        )`,
        `CREATE TABLE IF NOT EXISTS modules (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            faculty_id INTEGER REFERENCES faculties(id) ON DELETE CASCADE,
            intake_id INTEGER REFERENCES intakes(id) ON DELETE CASCADE,
            semester_id INTEGER REFERENCES semesters(id) ON DELETE CASCADE,
            lecturer_id VARCHAR(50)
        )`,
        `CREATE TABLE IF NOT EXISTS module_notices (
            id SERIAL PRIMARY KEY,
            module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
            lecturer_id VARCHAR(50),
            title VARCHAR(255) NOT NULL,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    try {
        for (let query of queries) {
            await db.query(query);
        }
        
        // Seed some initial data if empty
        const facultyCount = await db.query('SELECT COUNT(*) FROM faculties');
        if (parseInt(facultyCount.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO faculties (name, code) VALUES 
                ('Computing', 'FOC'),
                ('Business', 'FOB'),
                ('Engineering', 'FOE')
            `);
            await db.query(`INSERT INTO intakes (year) VALUES (2023), (2024), (2025), (2026)`);
            await db.query(`
                INSERT INTO semesters (name) VALUES 
                ('Year 1 Semester 1'), ('Year 1 Semester 2'),
                ('Year 2 Semester 1'), ('Year 2 Semester 2'),
                ('Year 3 Semester 1'), ('Year 3 Semester 2'),
                ('Year 4 Semester 1'), ('Year 4 Semester 2')
            `);
            // Add a sample module for testing
            await db.query(`
                INSERT INTO modules (name, code, faculty_id, intake_id, semester_id, lecturer_id)
                VALUES ('Database Management Systems', 'CS301', 1, 2, 5, 'LEC001')
            `);
        }

        console.log('✅ Hierarchy tables initialized and seeded');
    } catch (err) {
        console.error('❌ Error initializing hierarchy tables:', err.message);
    }
};

const getFaculties = async () => {
    const result = await db.query('SELECT * FROM faculties ORDER BY name');
    return result.rows;
};

const getIntakes = async () => {
    const result = await db.query('SELECT * FROM intakes ORDER BY year DESC');
    return result.rows;
};

const getSemesters = async () => {
    const result = await db.query('SELECT * FROM semesters ORDER BY id');
    return result.rows;
};

const getModules = async (facultyId, intakeId, semesterId) => {
    let query = 'SELECT * FROM modules WHERE 1=1';
    const params = [];
    let paramIdx = 1;

    if (facultyId) {
        query += ` AND faculty_id = $${paramIdx++}`;
        params.push(facultyId);
    }
    if (intakeId) {
        query += ` AND intake_id = $${paramIdx++}`;
        params.push(intakeId);
    }
    if (semesterId) {
        query += ` AND semester_id = $${paramIdx++}`;
        params.push(semesterId);
    }

    const result = await db.query(query, params);
    return result.rows;
};

const getModuleById = async (id) => {
    const result = await db.query('SELECT * FROM modules WHERE id = $1', [id]);
    return result.rows[0];
};

const getModuleNotices = async (moduleId) => {
    const result = await db.query('SELECT * FROM module_notices WHERE module_id = $1 ORDER BY created_at DESC', [moduleId]);
    return result.rows;
};

const createModuleNotice = async (noticeData) => {
    const { module_id, lecturer_id, title, content } = noticeData;
    const result = await db.query(
        'INSERT INTO module_notices (module_id, lecturer_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
        [module_id, lecturer_id, title, content]
    );
    return result.rows[0];
};

// Auto-init tables
initializeHierarchyTables();

module.exports = {
    getFaculties,
    getIntakes,
    getSemesters,
    getModules,
    getModuleById,
    getModuleNotices,
    createModuleNotice
};
