const ticketModel = require('../models/ticketModel');
const chatModel = require('../models/chatModel');
const { sendInquiryEmail } = require('../services/email-services');
const { notifyStatusChange } = require('../services/chat-services');
const db = require('../../../config/db');

const submitTicket = async (req, res) => {
    const { student_id, subject, description, category, contact_number, lecturer_id } = req.body;
    const screenshot_url = req.file ? `/uploads/tickets/${req.file.filename}` : null;

    try {
        // Fetch internal student id, name, and email
        const studentRes = await db.query('SELECT id, name, email FROM students WHERE student_id = $1', [student_id]);
        const student = studentRes.rows[0];

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const internalId = student.id;
        const studentName = student.name;
        const studentEmail = student.email;

        // Resolve lecturer internal ID and fetch email if provided
        let internalLecturerId = null;
        let lecturerEmail = null;
        if (lecturer_id) {
            let lecturerSearchQuery = 'SELECT id, email FROM lecturers WHERE employee_id = $1';
            let lecturerParams = [lecturer_id];
            if (!isNaN(lecturer_id)) {
                lecturerSearchQuery = 'SELECT id, email FROM lecturers WHERE employee_id = $1 OR id = $2::integer';
                lecturerParams = [lecturer_id, lecturer_id];
            }
            const lecturerRes = await db.query(lecturerSearchQuery, lecturerParams);
            if (lecturerRes.rows.length > 0) {
                internalLecturerId = lecturerRes.rows[0].id;
                lecturerEmail = lecturerRes.rows[0].email;
            }
        }

        const ticket = await ticketModel.submitTicket(internalId, subject, description, screenshot_url, category, contact_number, internalLecturerId);
        
        // Trigger automated email notification with lecturer email and student CC
        await sendInquiryEmail(ticket, studentName, lecturerEmail, studentEmail);
        
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

const getLecturerTickets = async (req, res) => {
    const { lecturer_id } = req.params;
    const { limit = 50 } = req.query;
    try {
        const tickets = await ticketModel.getLecturerTickets(lecturer_id, parseInt(limit));
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching lecturer tickets:', error.message);
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
    const { status, role } = req.body; // role can be passed from frontend
    try {
        const ticket = await ticketModel.updateTicketStatus(id, status);
        
        // Trigger automated chat message for status change
        await notifyStatusChange(id, status, role);
        
        res.status(200).json({ message: 'Ticket status updated', ticket });
    } catch (error) {
        console.error('Error updating ticket status:', error.message);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
};

// --- CHAT INTERFACE ---
const getTicketChats = async (req, res) => {
    const { id } = req.params;
    try {
        const chats = await chatModel.getTicketChats(id);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching ticket chats:', error.message);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
};

const addChatMessage = async (req, res) => {
    const { id: ticket_id } = req.params;
    const { sender_id, sender_role, message } = req.body;
    try {
        let internalSenderId = sender_id;

        // Resolve internal ID if it's a student or lecturer registration ID
        if (sender_role === 'student') {
            const studentRes = await db.query('SELECT id FROM students WHERE student_id = $1', [sender_id]);
            if (studentRes.rows.length > 0) {
                internalSenderId = studentRes.rows[0].id;
            }
        } else if (sender_role === 'lecturer') {
            let lecturerSearchQuery = 'SELECT id FROM lecturers WHERE employee_id = $1';
            let lecturerParams = [sender_id];
            if (!isNaN(sender_id)) {
                lecturerSearchQuery = 'SELECT id FROM lecturers WHERE employee_id = $1 OR id = $2::integer';
                lecturerParams = [sender_id, sender_id];
            }
            const lecturerRes = await db.query(lecturerSearchQuery, lecturerParams);
            if (lecturerRes.rows.length > 0) {
                internalSenderId = lecturerRes.rows[0].id;
            }
        }

        const chat = await chatModel.addChatMessage(ticket_id, internalSenderId, sender_role, message);
        res.status(201).json(chat);
    } catch (error) {
        console.error('Error adding chat message:', error.message);
        res.status(500).json({ error: 'Failed to add message' });
    }
};

module.exports = {
    submitTicket,
    getStudentTickets,
    getLecturerTickets,
    getAllTickets,
    updateTicketStatus,
    getTicketChats,
    addChatMessage
};
