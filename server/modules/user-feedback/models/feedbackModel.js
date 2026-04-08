const db = require('../../../config/db');

const submitFeedback = async (student_id, lecturer_id, module_id, rating, comment) => {
    const query = 'INSERT INTO feedbacks (student_id, lecturer_id, module_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await db.query(query, [student_id, lecturer_id, module_id, rating, comment]);
    return result.rows[0];
};

const getStudentFeedback = async (studentId) => {
    const query = `
        SELECT f.*, l.name as lecturer_name, s.name as student_name
        FROM feedbacks f
        JOIN lecturers l ON f.lecturer_id = l.id
        JOIN students s ON f.student_id = s.id
        WHERE s.student_id = $1 OR s.id = (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END)
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
};

const getLecturerFeedback = async (lecturerId) => {
    const query = `
        SELECT f.*, l.name as lecturer_name, s.name as student_name
        FROM feedbacks f
        JOIN lecturers l ON f.lecturer_id = l.id
        JOIN students s ON f.student_id = s.id
        WHERE l.employee_id = $1 OR l.id = (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END)
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query, [lecturerId]);
    return result.rows;
};

const getAllFeedback = async () => {
    const query = `
        SELECT f.*, l.name as lecturer_name, s.name as student_name, s.student_id as student_reg_id
        FROM feedbacks f
        JOIN lecturers l ON f.lecturer_id = l.id
        JOIN students s ON f.student_id = s.id
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getLecturerModules = async (lecturerId) => {
    const query = `
        SELECT m.* 
        FROM modules m
        WHERE m.lecturer_id = $1 OR m.lecturer_id IN (
            SELECT id FROM lecturers WHERE employee_id = $1::text
        )
    `;
    const result = await db.query(query, [lecturerId]);
    return result.rows;
};

const updateFeedback = async (id, rating, comment) => {
    const query = 'UPDATE feedbacks SET rating = $1, comment = $2 WHERE id = $3 RETURNING *';
    const result = await db.query(query, [rating, comment, id]);
    return result.rows[0];
};

const deleteFeedback = async (id) => {
    const query = 'DELETE FROM feedbacks WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    submitFeedback,
    getStudentFeedback,
    getLecturerFeedback,
    getAllFeedback,
    getLecturerModules,
    updateFeedback,
    deleteFeedback
};
