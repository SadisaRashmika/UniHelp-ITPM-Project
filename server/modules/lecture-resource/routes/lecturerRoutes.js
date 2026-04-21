const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/notes/' });


// Get lecturer profile
router.get('/profile', lecturerController.getLecturerProfile);

// Get pending counts for submissions and bonus marks
router.get('/pending-counts', lecturerController.getPendingCounts);

// Get lecturer stats for profile cards
router.get('/stats', lecturerController.getLecturerStats);

// Get all lecturer resources
router.get('/resources', lecturerController.getLecturerResources);

// Route for uploading lecture resources
router.post('/upload-resource', upload.array('files'), lecturerController.uploadResource);

// Route to create a quiz
router.post('/create-quiz', lecturerController.createQuiz);

// Route to delete a lecturer resource
router.delete('/resources/:lectureId', lecturerController.deleteLecturerResource);

// Route to update a lecturer resource and optional quiz
router.patch('/resources/:lectureId', upload.array('files'), lecturerController.updateLecturerResource);

// Get student note submissions for lecturer review
router.get('/submissions', lecturerController.getStudentSubmissions);

// Review a student note submission (accept/reject)
router.patch('/submissions/:noteId/review', lecturerController.reviewStudentSubmission);

// Bonus marks requests
router.get('/bonus-requests', lecturerController.getBonusMarkRequests);
router.patch('/bonus-requests/:requestId/review', lecturerController.reviewBonusMarkRequest);
router.patch('/bonus-requests/:requestId/mark-added', lecturerController.markBonusAdded);

module.exports = router;