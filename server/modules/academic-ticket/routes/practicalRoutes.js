const express = require('express');
const router = express.Router();
const {
  createPractical,
  getPracticals,
  getPracticalById,
  updatePractical,
  deletePractical,
  getRecentPracticalActivities,
  submitPractical,
  gradePractical
} = require('../controllers/practicalcontroller.js');

// Middleware for file uploads (if needed)
const multer = require('multer');
const upload = multer({ dest: 'uploads/practicals/' });

// Create a new practical
router.post('/practicals', createPractical);

// Get all practicals with filters
router.get('/practicals', getPracticals);

// Get practical by ID
router.get('/practicals/:id', getPracticalById);

// Update practical
router.put('/practicals/:id', updatePractical);

// Delete practical
router.delete('/practicals/:id', deletePractical);

// Get recent practical activities for overview
router.get('/recent-practical-activities', getRecentPracticalActivities);

// Submit practical (for students)
router.post('/practicals/:id/submit', upload.array('files', 5), submitPractical);

// Grade practical submission
router.post('/practical-submissions/:id/grade', gradePractical);

module.exports = router;
