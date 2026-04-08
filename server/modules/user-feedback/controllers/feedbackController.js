const feedbackModel = require('../models/feedbackModel');


const submitFeedback = async (req, res) => {
    const { student_id, lecturer_id, subject, rating, comment } = req.body;
    try {
        const db = require('../../../config/db');

        // Resolve student internal ID (Try as student_id first, then as id if numeric)
        let studentSearchQuery = 'SELECT id FROM students WHERE student_id = $1';
        let studentParams = [student_id];
        if (!isNaN(student_id)) {
            studentSearchQuery = 'SELECT id FROM students WHERE student_id = $1 OR id = $2::integer';
            studentParams = [student_id, student_id];
        }
        const studentRes = await db.query(studentSearchQuery, studentParams);
        if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const internalStudentId = studentRes.rows[0].id;

        // Resolve lecturer internal ID (Try as employee_id first, then as id if numeric)
        let lecturerSearchQuery = 'SELECT id FROM lecturers WHERE employee_id = $1';
        let lecturerParams = [lecturer_id];
        if (!isNaN(lecturer_id)) {
            lecturerSearchQuery = 'SELECT id FROM lecturers WHERE employee_id = $1 OR id = $2::integer';
            lecturerParams = [lecturer_id, lecturer_id];
        }
        const lecturerRes = await db.query(lecturerSearchQuery, lecturerParams);
        if (lecturerRes.rows.length === 0) return res.status(404).json({ error: 'Lecturer not found' });
        const internalLecturerId = lecturerRes.rows[0].id;

        const feedback = await feedbackModel.submitFeedback(internalStudentId, internalLecturerId, subject, rating, comment);
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error('Error submitting feedback:', error.message);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};


const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.getAllFeedback();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching all feedback:', error.message);
        res.status(500).json({ error: 'Failed to fetch feedback data' });
    }
};


const getLecturerFeedback = async (req, res) => {
    const { lecturer_id } = req.params;
    try {
        const feedbacks = await feedbackModel.getLecturerFeedback(lecturer_id);
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching lecturer feedback:', error.message);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};


const getStudentFeedback = async (req, res) => {
    const { student_id } = req.params;
    try {
        const feedbacks = await feedbackModel.getStudentFeedback(student_id);
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching student feedback:', error.message);
        res.status(500).json({ error: 'Failed to fetch student feedback' });
    }
};


const updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { rating, comment, subject } = req.body;
    try {
        const feedback = await feedbackModel.getFeedbackById(id);
        if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
        
        const createdAt = new Date(feedback.created_at);
        const now = new Date();
        const diffMins = (now - createdAt) / 60000;

        if (diffMins > 10) {
            return res.status(403).json({ error: 'Update timeframe has expired (10 mins limit)' });
        }

        const updated = await feedbackModel.updateFeedback(id, rating, comment, subject);
        res.status(200).json({ message: 'Feedback updated successfully', feedback: updated });
    } catch (error) {
        console.error('Error updating feedback:', error.message);
        res.status(500).json({ error: 'Failed to update feedback' });
    }
};


const deleteFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await feedbackModel.getFeedbackById(id);
        if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
        
        const createdAt = new Date(feedback.created_at);
        const now = new Date();
        const diffMins = (now - createdAt) / 60000;

        if (diffMins > 10) {
            return res.status(403).json({ error: 'Deletion timeframe has expired (10 mins limit)' });
        }

        await feedbackModel.deleteFeedback(id);
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error.message);
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
};

const getLecturerModules = async (req, res) => {
    const { lecturer_id } = req.params;
    try {
        const modules = await feedbackModel.getLecturerModules(lecturer_id);
        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching lecturer modules:', error.message);
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    getLecturerFeedback,
    getStudentFeedback,
    updateFeedback,
    deleteFeedback,
    getLecturerModules
};
