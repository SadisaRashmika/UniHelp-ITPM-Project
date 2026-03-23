const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');

// Get lecturer profile
router.get('/profile', lecturerController.getLecturerProfile);

// Get pending counts for submissions and bonus marks
router.get('/pending-counts', lecturerController.getPendingCounts);

module.exports = router;