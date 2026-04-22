const express = require('express');
const router = express.Router();
const {
  createQuizJob,
  getQuizJobs,
  getQuizJobById,
  updateQuizJob,
  deleteQuizJob,
  updateQuizJobStatus
} = require('../controllers/quizJobController');

// POST /api/academic-ticket/quiz-jobs - Create new quiz job
router.post('/', createQuizJob);

// GET /api/academic-ticket/quiz-jobs - Get all quiz jobs (with optional filters)
router.get('/', getQuizJobs);

// GET /api/academic-ticket/quiz-jobs/:id - Get single quiz job by ID
router.get('/:id', getQuizJobById);

// PUT /api/academic-ticket/quiz-jobs/:id - Update quiz job (full update)
router.put('/:id', updateQuizJob);

// PATCH /api/academic-ticket/quiz-jobs/:id/status - Update quiz job status
router.patch('/:id/status', updateQuizJobStatus);

// DELETE /api/academic-ticket/quiz-jobs/:id - Delete quiz job
router.delete('/:id', deleteQuizJob);

module.exports = router;
