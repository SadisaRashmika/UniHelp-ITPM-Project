const db = require('../../../config/db');

const addChatMessage = async (ticket_id, sender_id, sender_role, message, is_system_message = false) => {
    const query = `
        INSERT INTO ticket_chats (ticket_id, sender_id, sender_role, message, is_system_message)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await db.query(query, [ticket_id, sender_id, sender_role, message, is_system_message]);
    return result.rows[0];
};

const getTicketChats = async (ticket_id) => {
    const query = `
        SELECT * FROM ticket_chats 
        WHERE ticket_id = $1 
        ORDER BY created_at ASC
    `;
    const result = await db.query(query, [ticket_id]);
    return result.rows;
};

module.exports = {
    addChatMessage,
    getTicketChats
};
