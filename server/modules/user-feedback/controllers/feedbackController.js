const feedbackModel = require('../models/feedbackModel');


const submitFeedback = async (req, res) => {
    const { student_id, lecturer_id, subject, rating, comment } = req.body;
    try {
        const feedback = await feedbackModel.submitFeedback(student_id, lecturer_id, subject, rating, comment);
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

module.exports = {
    submitFeedback,
    getAllFeedback,
    getLecturerFeedback,
    getStudentFeedback,
    updateFeedback,
    deleteFeedback
};
