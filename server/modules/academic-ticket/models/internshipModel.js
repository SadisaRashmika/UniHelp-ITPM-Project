const db = require('../../../config/db');

/**
 * Initialize Internship Applications Table
 */
const initializeInternshipTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS internship_applications (
            id SERIAL PRIMARY KEY,
            student_id VARCHAR(50),
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            university VARCHAR(255) NOT NULL,
            major VARCHAR(255) NOT NULL,
            graduation_year INTEGER NOT NULL,
            gpa DECIMAL(3, 2),
            internship_type VARCHAR(50) NOT NULL,
            company VARCHAR(255) NOT NULL,
            position VARCHAR(255) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            cover_letter TEXT,
            skills TEXT,
            resume_path VARCHAR(500),
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await db.query(query);
        console.log('✅ Internship applications table initialized');
    } catch (err) {
        console.error('❌ Error initializing internship table:', err.message);
    }
};

module.exports = {
    initializeInternshipTable
};
