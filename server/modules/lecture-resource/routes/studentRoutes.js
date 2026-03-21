const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get student profile
router.get('/profile', studentController.getStudentProfile);

module.exports = router;