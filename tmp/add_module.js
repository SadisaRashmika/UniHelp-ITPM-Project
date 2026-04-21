require('dotenv').config({ path: './server/.env' });
const db = require('../server/config/db');

async function addModule() {
    try {
        // 1. Find lecturer
        const lectRes = await db.query("SELECT id FROM lecturers WHERE email = 'bweerapperuma@gmail.com'");
        if (lectRes.rows.length === 0) {
            console.error('Lecturer not found');
            process.exit(1);
        }
        const lecturerId = lectRes.rows[0].id;
        console.log(`Found lecturer ID: ${lecturerId}`);

        // 2. Add modules (lectures)
        const modules = [
            { title: 'Information Technology Project Management', subject: 'ITPM', topic: 'Agile Methodologies', year: '3rd Year', semester: '2nd Semester' },
            { title: 'Advanced Software Engineering', subject: 'ASE', topic: 'Microservices', year: '3rd Year', semester: '2nd Semester' },
            { title: 'Database Administration', subject: 'DBA', topic: 'Performance Tuning', year: '3rd Year', semester: '2nd Semester' }
        ];

        for (const m of modules) {
            const check = await db.query("SELECT id FROM lectures WHERE lecturer_id = $1 AND title = $2", [lecturerId, m.title]);
            if (check.rows.length === 0) {
                await db.query(
                    "INSERT INTO lectures (lecturer_id, title, subject, topic, year, semester) VALUES ($1, $2, $3, $4, $5, $6)",
                    [lecturerId, m.title, m.subject, m.topic, m.year, m.semester]
                );
                console.log(`Added module: ${m.title}`);
            } else {
                console.log(`Module already exists: ${m.title}`);
            }
        }

        console.log('Success!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

addModule();
