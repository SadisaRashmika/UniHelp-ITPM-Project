const db = require('../../../config/db');

const submitFeedback = async (student_id, lecturer_id, subject, rating, comment) => {
    const query = 'INSERT INTO feedbacks (student_id, lecturer_id, subject, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await db.query(query, [student_id, lecturer_id, subject, rating, comment]);
    return result.rows[0];
};

const getAllFeedback = async () => {
    const query = `
        SELECT f.*, s.name as student_name, l.name as lecturer_name 
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
        WHERE f.lecturer_id = $1
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
        WHERE f.student_id = $1
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

module.exports = {
    submitFeedback,
    getAllFeedback,
    getLecturerFeedback,
    getStudentFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};
