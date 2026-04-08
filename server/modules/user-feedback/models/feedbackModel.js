const db = require('../../../config/db');

const submitFeedback = async (student_id, lecturer_id, subject, rating, comment) => {
    const query = 'INSERT INTO feedbacks (student_id, lecturer_id, subject, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await db.query(query, [student_id, lecturer_id, subject, rating, comment]);
    return result.rows[0];
};

const getAllFeedback = async () => {
    const query = `
        SELECT f.*, s.name as student_name, s.student_id as student_reg_id, l.name as lecturer_name 
        FROM feedbacks f
        LEFT JOIN students s ON f.student_id = s.id
        LEFT JOIN lecturers l ON f.lecturer_id = l.id
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getLecturerFeedback = async (lecturer_id) => {
    const query = `
        SELECT f.*, s.name as student_name 
        FROM feedbacks f
        LEFT JOIN students s ON f.student_id = s.id
        JOIN lecturers l ON f.lecturer_id = l.id
        WHERE l.employee_id = $1
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query, [lecturer_id]);
    return result.rows;
};

const getStudentFeedback = async (student_id) => {
    const query = `
        SELECT f.*, l.name as lecturer_name 
        FROM feedbacks f
        LEFT JOIN lecturers l ON f.lecturer_id = l.id
        JOIN students s ON f.student_id = s.id
        WHERE s.student_id = $1
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query, [student_id]);
    return result.rows;
};

const getFeedbackById = async (id) => {
    const query = 'SELECT * FROM feedbacks WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const updateFeedback = async (id, rating, comment, subject) => {
    const query = 'UPDATE feedbacks SET rating = $1, comment = $2, subject = $3 WHERE id = $4 RETURNING *';
    const result = await db.query(query, [rating, comment, subject, id]);
    return result.rows[0];
};

const deleteFeedback = async (id) => {
    const query = 'DELETE FROM feedbacks WHERE id = $1';
    await db.query(query, [id]);
};

const getLecturerModules = async (lecturer_id) => {
    let query = `
        SELECT DISTINCT subject FROM lectures le
        JOIN lecturers l ON le.lecturer_id = l.id
        WHERE l.employee_id = $1
    `;
    let params = [lecturer_id];

    if (!isNaN(lecturer_id)) {
        query = `
            SELECT DISTINCT subject FROM lectures le
            JOIN lecturers l ON le.lecturer_id = l.id
            WHERE l.employee_id = $1 OR l.id = $2::integer
        `;
        params = [lecturer_id, lecturer_id];
    }
    
    const result = await db.query(query, params);
    return result.rows.map(row => row.subject);
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    getLecturerFeedback,
    getStudentFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    getLecturerModules
};
