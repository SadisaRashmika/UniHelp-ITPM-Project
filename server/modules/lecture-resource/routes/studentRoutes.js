const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/notes/' });

// Get student profile
router.get('/profile', studentController.getStudentProfile);

// Get lecture resources for student home
router.get('/lectures', studentController.getLectureResources);

// Upload note for a lecture
router.post('/notes/upload', upload.single('file'), studentController.uploadStudentNote);

// Get student's uploads with status
router.get('/notes/my-uploads', studentController.getMyUploads);

// Delete own accepted upload
router.delete('/notes/my-uploads/:noteId', studentController.deleteAcceptedUpload);

// Get all accepted student notes
router.get('/notes/accepted', studentController.getAcceptedStudentNotes);

// Like an accepted student note
router.post('/notes/:noteId/like', studentController.likeStudentNote);

// Create bonus marks request
router.post('/bonus-requests', studentController.createBonusMarkRequest);

module.exports = router;