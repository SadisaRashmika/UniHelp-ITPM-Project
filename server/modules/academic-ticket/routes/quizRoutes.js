// Import required packages for Express routing
const express = require('express'); // Express.js web framework
const router = express.Router(); // Create Express router instance
const quizController = require('../controllers/quizController'); // Import quiz controller functions

// Define RESTful API routes for quiz management

// GET /api/academic-ticket/quizzes
// Get all quizzes for a lecturer
// Accepts lecturer_id query parameter to filter by lecturer
router.get('/', quizController.getQuizzes);

// GET /api/academic-ticket/quizzes/:id
// Get single quiz by ID
// Returns specific quiz details with questions
router.get('/:id', quizController.getQuizById);

// POST /api/academic-ticket/quizzes
// Create new quiz
// Handles quiz creation with questions and options
router.post('/', quizController.createQuiz);

// PUT /api/academic-ticket/quizzes/:id
// Update existing quiz
// Updates quiz details, questions, or options
router.put('/:id', quizController.updateQuiz);

// DELETE /api/academic-ticket/quizzes/:id
// Delete quiz by ID
// Permanently removes quiz from database
router.delete('/:id', quizController.deleteQuiz);

// POST /api/academic-ticket/quizzes/:id/submit
// Submit quiz answers by student
// Handles quiz submission and scoring
router.post('/:id/submit', quizController.submitQuiz);

// Export router for use in main application
module.exports = router;
