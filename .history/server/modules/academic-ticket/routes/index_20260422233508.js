// Import required packages for Express routing
const express = require('express'); // Express.js web framework
const router = express.Router(); // Create Express router instance

// Import all route modules for academic-ticket functionality
const taskRoutes = require('./taskRoutes'); // Task management routes
const practicalRoutes = require('./practicalRoutes'); // Practical assignment routes
const internshipRoutes = require('./internshipRoutes'); // Internship application routes
const quizRoutes = require('./quizRoutes'); // Quiz management routes
const quizStructureRoutes = require('./quizStructureRoutes'); // Quiz structure (faculty/intake/semester/module) routes
const quizJobRoutes = require('./quizJobRoutes'); // Quiz job routes (quiz-jobs)

// Register all route modules with their respective prefixes

// Task routes - handles academic tasks and assignments
router.use('/tasks', taskRoutes);

// Practical routes - handles practical assignments and file uploads
router.use('/practicals', practicalRoutes);

// Internship routes - handles internship applications and resume uploads
router.use('/internship-applications', internshipRoutes);

// Import controllers
const quizController = require('../controllers/quizController');

const submissionController = require('../controllers/submissionController');

// Quiz routes - handles quiz CRUD operations
router.use('/quizzes', quizRoutes);

// Quiz job routes - handles quiz job creation and listing
router.use('/quiz-jobs', quizJobRoutes);

// Submissions routes
router.get('/submissions', submissionController.getSubmissions);
router.put('/submissions/:id/grade', submissionController.gradeSubmission);

// Recent activities route for overview dashboard
router.get('/recent-activities', quizController.getRecentActivities);




// Quiz structure routes - handles faculty, intake, semester, and module management
router.use('/quiz-structure', quizStructureRoutes);

// Legacy/Fallback routes for hierarchy (redirecting to quiz-structure where appropriate)
router.get('/hierarchy/modules', (req, res) => {
    // Redirect old lecturer modules call to the new structure API logic
    if (req.query.lecturer_id) {
        return res.redirect(307, `/api/academic-ticket/quiz-structure/lecturer/modules?lecturer_id=${req.query.lecturer_id}`);
    }
    res.status(404).json({ message: 'Legacy hierarchy endpoint removed. Please use quiz-structure.' });
});

router.get('/hierarchy/modules/:id/notices', (req, res) => {
    res.redirect(307, `/api/academic-ticket/quiz-structure/modules/${req.params.id}/notices`);
});


// Export the main router for use in server.js
module.exports = router;
