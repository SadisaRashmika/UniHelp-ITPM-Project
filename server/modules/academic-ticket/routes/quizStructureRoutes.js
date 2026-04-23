// Import required packages for Express routing
const express = require('express'); // Express.js web framework
const router = express.Router(); // Create Express router instance
const quizStructureController = require('../controllers/quizStructureController'); // Import quiz structure controller functions

// Define API routes for quiz structure management

// GET /api/academic-ticket/quiz-structure/faculties
// Get all faculties available in the system
// Returns list of all faculties for dropdown selection
router.get('/faculties', quizStructureController.getFaculties);

// GET /api/academic-ticket/quiz-structure/faculty/:facultyId/intakes
// Get intakes by faculty ID
// Returns intakes that have modules for the specified faculty
router.get('/faculty/:facultyId/intakes', quizStructureController.getIntakesByFaculty);

// GET /api/academic-ticket/quiz-structure/faculty/:facultyId/intake/:intakeId/semesters
// Get semesters by faculty and intake
// Returns semesters that have modules for the specified faculty and intake
router.get('/faculty/:facultyId/intake/:intakeId/semesters', quizStructureController.getSemestersByFacultyIntake);

// GET /api/academic-ticket/quiz-structure/faculty/:facultyId/intake/:intakeId/semester/:semesterId/modules
// Get modules by faculty, intake, and semester
// Returns modules for the complete structure selection
router.get('/faculty/:facultyId/intake/:intakeId/semester/:semesterId/modules', quizStructureController.getModulesByStructure);

// GET /api/academic-ticket/quiz-structure/lecturer/modules
// Get modules assigned to the current lecturer
// Returns all modules that the lecturer is responsible for
router.get('/lecturer/modules', quizStructureController.getModulesByLecturer);

// GET /api/academic-ticket/quiz-structure/lecturer/structure
// Get complete quiz structure for lecturer
// Returns nested structure: faculties -> intakes -> semesters -> modules
router.get('/lecturer/structure', quizStructureController.getQuizStructureForLecturer);

// GET /api/academic-ticket/quiz-structure/modules/:moduleId/notices
// Get notices for a specific module
router.get('/modules/:moduleId/notices', quizStructureController.getModuleNotices);

// POST /api/academic-ticket/quiz-structure/modules
// Create new module
router.post('/modules', quizStructureController.createModule);

// Export router for use in main application
module.exports = router;
