const db = require('../../../config/db');

const getAllUsers = async () => {
    const lecturersQuery = "SELECT id, name, employee_id as user_id, email, department as category, 'Lecturer' as role FROM lecturers";
    const studentsQuery = "SELECT id, name, student_id as user_id, email, year as category, 'Student' as role FROM students";

    const [lecturers, students] = await Promise.all([
        db.query(lecturersQuery),
        db.query(studentsQuery)
    ]);

    return [...lecturers.rows, ...students.rows];
};

const updateLecturer = async (id, name, email, department, employee_id) => {
    const query = 'UPDATE lecturers SET name = $1, email = $2, department = $3, employee_id = $4 WHERE id = $5 RETURNING *';
    const result = await db.query(query, [name, email, department, employee_id, id]);
    return result.rows[0];
};

const updateStudent = async (id, name, email, year, student_id) => {
    const query = 'UPDATE students SET name = $1, email = $2, year = $3, student_id = $4 WHERE id = $5 RETURNING *';
    const result = await db.query(query, [name, email, year, student_id, id]);
    return result.rows[0];
};

module.exports = {
    getAllUsers,
    updateLecturer,
    updateStudent
};
