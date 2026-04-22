const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const hierarchyController = require('../controllers/hierarchyController');

// --- Task Management Routes ---
router.get('/recent-activities', taskController.getRecentActivities);

// --- Submission Routes ---
router.post('/submissions', taskController.submitQuiz);
router.get('/submissions', taskController.getSubmissions); // Handles filters like lecturer_id, quiz_id, student_id via query params
router.put('/submissions/:id/grade', taskController.gradeSubmission); // Grade a submission

// --- Hierarchy Routes ---
router.get('/hierarchy/filters', hierarchyController.getHierarchyFilters);
router.get('/hierarchy/modules', hierarchyController.getModules);
router.get('/hierarchy/modules/:id/notices', hierarchyController.getModuleNotices);
router.post('/hierarchy/notices', hierarchyController.createNotice);

module.exports = router;
