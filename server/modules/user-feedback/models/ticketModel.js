const db = require('../../../config/db');

const submitTicket = async (student_id, subject, description, screenshot_url, category, contact_number) => {
    const query = 'INSERT INTO tickets (student_id, subject, description, screenshot_url, category, contact_number, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const result = await db.query(query, [student_id, subject, description, screenshot_url, category, contact_number, 'pending']);
    return result.rows[0];
};

const getStudentTickets = async (student_id, limit = 50) => {
    const query = `
        SELECT t.* FROM tickets t
        JOIN students s ON t.student_id = s.id
        WHERE s.student_id = $1
        ORDER BY t.created_at DESC
        LIMIT $2
    `;
    const result = await db.query(query, [student_id, limit]);
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
    getAllTickets,
    updateTicketStatus
};
