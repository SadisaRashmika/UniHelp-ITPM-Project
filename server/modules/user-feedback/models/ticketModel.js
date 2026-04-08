const db = require('../../../config/db');

const submitTicket = async (student_id, subject, description, screenshot_url, category, contact_number, lecturer_id = null) => {
    const query = 'INSERT INTO tickets (student_id, subject, description, screenshot_url, category, contact_number, status, lecturer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const result = await db.query(query, [student_id, subject, description, screenshot_url, category, contact_number, 'pending', lecturer_id]);
    return result.rows[0];
};

const getStudentTickets = async (studentId, limit = 50) => {
    const query = `
        SELECT t.*, s.name as student_name, s.student_id as student_reg_id, l.name as lecturer_name 
        FROM tickets t
        JOIN students s ON t.student_id = s.id
        LEFT JOIN lecturers l ON t.lecturer_id = l.id
        WHERE s.student_id = $1 OR s.id = (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END)
        ORDER BY t.created_at DESC
        LIMIT $2
    `;
    const result = await db.query(query, [studentId, limit]);
    return result.rows;
};

const getLecturerTickets = async (lecturerId, limit = 50) => {
    const query = `
        SELECT t.*, s.name as student_name, s.student_id as student_reg_id, l.name as lecturer_name 
        FROM tickets t
        JOIN students s ON t.student_id = s.id
        JOIN lecturers l ON t.lecturer_id = l.id
        WHERE l.employee_id = $1 OR l.id = (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END)
        ORDER BY t.created_at DESC
        LIMIT $2
    `;
    const result = await db.query(query, [lecturerId, limit]);
    return result.rows;
};

const getAllTickets = async (limit = 100) => {
    const query = `
        SELECT t.*, s.name as student_name, s.student_id as student_reg_id
        FROM tickets t
        LEFT JOIN students s ON t.student_id = s.id
        ORDER BY t.created_at DESC
        LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
};

const updateTicketStatus = async (id, status) => {
    const query = 'UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [status, id]);
    return result.rows[0];
};

module.exports = {
    submitTicket,
    getStudentTickets,
    getLecturerTickets,
    getAllTickets,
    updateTicketStatus
};
