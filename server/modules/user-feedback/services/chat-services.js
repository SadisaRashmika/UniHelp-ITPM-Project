const { addChatMessage } = require('../models/chatModel');

const logSystemMessage = async (ticket_id, message) => {
    try {
        await addChatMessage(ticket_id, 0, 'system', message, true);
    } catch (error) {
        console.error('Error logging system message:', error);
    }
};

const notifyStatusChange = async (ticket_id, newStatus, role) => {
    let message = '';
    if (newStatus === 'resolved') {
        message = 'Inquiry closed, resolved.';
    } else if (newStatus === 'pending') {
        message = 'Inquiry reopened/reset to pending.';
    } else if (newStatus === 'in-review') {
        message = 'Diagnostic analysis initiated.';
    }
    
    if (message) {
        await logSystemMessage(ticket_id, `[SYSTEM] ${message}`);
    }
};

const notifyUserClose = async (ticket_id) => {
    await logSystemMessage(ticket_id, '[SYSTEM] Inquiry closed by student.');
};

module.exports = {
    logSystemMessage,
    notifyStatusChange,
    notifyUserClose
};
