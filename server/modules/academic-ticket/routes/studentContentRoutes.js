const express = require('express');
const router = express.Router();
const {
  getStudentHierarchicalContent,
  getContentByPath,
  getStudentNavigationPaths
} = require('../controllers/studentContentController');

// GET /api/academic-ticket/student-content/hierarchical - Get complete hierarchical content structure
router.get('/hierarchical', getStudentHierarchicalContent);

// GET /api/academic-ticket/student-content/navigation - Get available navigation paths
router.get('/navigation', getStudentNavigationPaths);

// GET /api/academic-ticket/student-content/path/:faculty_id/:intake_id/:semester_id - Get content by path
router.get('/path/:faculty_id/:intake_id/:semester_id', getContentByPath);

// GET /api/academic-ticket/student-content/path/:faculty_id/:intake_id/:semester_id/:module_id - Get content by specific module path
router.get('/path/:faculty_id/:intake_id/:semester_id/:module_id', getContentByPath);

module.exports = router;
