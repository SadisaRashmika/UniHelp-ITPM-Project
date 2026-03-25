const ticketModel = require('../models/ticketModel');


const submitTicket = async (req, res) => {
    const { student_id, subject, description, category } = req.body;
    
    const screenshot_url = req.file ? `/uploads/tickets/${req.file.filename}` : null;

    try {
        const ticket = await ticketModel.submitTicket(student_id, subject, description, screenshot_url, category);
        res.status(201).json({ message: 'Ticket submitted successfully', ticket });
    } catch (error) {
        console.error('Error submitting ticket:', error.message);
        res.status(500).json({ error: 'Failed to submit ticket' });
    }
};


const getStudentTickets = async (req, res) => {
    const { student_id } = req.params;
    const { limit = 50 } = req.query;
    try {
        const tickets = await ticketModel.getStudentTickets(student_id, parseInt(limit));
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching student tickets:', error.message);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
};


const getAllTickets = async (req, res) => {
    const { limit = 100 } = req.query;
    try {
        const tickets = await ticketModel.getAllTickets(parseInt(limit));
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching all tickets:', error.message);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
};


const updateTicketStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const ticket = await ticketModel.updateTicketStatus(id, status);
        res.status(200).json({ message: 'Ticket status updated', ticket });
    } catch (error) {
        console.error('Error updating ticket status:', error.message);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
};

module.exports = {
    submitTicket,
    getStudentTickets,
    getAllTickets,
    updateTicketStatus
};
