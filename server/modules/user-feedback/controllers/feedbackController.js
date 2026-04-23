const feedbackModel = require('../models/feedbackModel');

const submitFeedback = async (req, res) => {
    const { student_id, lecturer_id, subject, rating, comment } = req.body;
    try {
        const feedback = await feedbackModel.submitFeedback(student_id, lecturer_id, subject, rating, comment);
        res.status(201).json(feedback);
    } catch (error) {
        console.error('Error submitting feedback:', error.message);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to submit feedback' });
    }
};

const getStudentFeedback = async (req, res) => {
    const { student_id } = req.params;
    try {
        const feedback = await feedbackModel.getStudentFeedback(student_id);
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching student feedback:', error.message);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};

const getLecturerFeedback = async (req, res) => {
    const { lecturer_id } = req.params;
    try {
        const feedback = await feedbackModel.getLecturerFeedback(lecturer_id);
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching lecturer feedback:', error.message);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedback = await feedbackModel.getAllFeedback();
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error.message);
        res.status(500).json({ error: 'Failed to fetch feedback' });
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

const updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    try {
        const feedback = await feedbackModel.updateFeedback(id, rating, comment);
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error updating feedback:', error.message);
        res.status(500).json({ error: 'Failed to update feedback' });
    }
};

const deleteFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await feedbackModel.deleteFeedback(id);
        res.status(200).json({ message: 'Feedback deleted successfully', feedback });
    } catch (error) {
        console.error('Error deleting feedback:', error.message);
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
};

module.exports = {
    submitFeedback,
    getStudentFeedback,
    getLecturerFeedback,
    getAllFeedback,
    getLecturerModules,
    updateFeedback,
    deleteFeedback
};
