const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const multer = require('multer');
const path = require('path');

// Configure multer for resume uploads
const fs = require('fs');

// Ensure uploads directory exists
const uploadPath = 'uploads/resumes/';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only .pdf, .doc and .docx files are allowed!'));
    }
});

// Routes
router.get('/', internshipController.getInternshipApplications);
router.post('/', upload.single('resume'), internshipController.submitInternshipApplication);
router.get('/student/:studentId', internshipController.getStudentInternshipApplications);
router.put('/:id/status', internshipController.updateApplicationStatus);

module.exports = router;
