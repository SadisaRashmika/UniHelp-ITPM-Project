// Import database connection for database operations
const db = require('../../../config/db');

// Get all faculties
// Returns list of all faculties available in the system
const getFaculties = async (req, res) => {
  try {
    const query = 'SELECT * FROM faculties ORDER BY name';
    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculties'
    });
  }
};

// Get intakes by faculty
// Returns all available intakes for the specified faculty
const getIntakesByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    // Fix: Return ALL intakes, not just those with modules
    const query = `
      SELECT id, year 
      FROM intakes
      ORDER BY year
    `;
    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching intakes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching intakes'
    });
  }
};

// Get semesters by faculty and intake
// Returns all available semesters for the specified faculty and intake
const getSemestersByFacultyIntake = async (req, res) => {
  try {
    const { facultyId, intakeId } = req.params;
    
    // Fix: Return ALL semesters, not just those with modules
    const query = `
      SELECT id, name 
      FROM semesters
      ORDER BY name
    `;
    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching semesters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching semesters'
    });
  }
};

// Get modules by faculty, intake, and semester
// Returns modules for the specified faculty, intake, and semester combination
const getModulesByStructure = async (req, res) => {
  try {
    const { facultyId, intakeId, semesterId } = req.params;
    
    // Fix: Return ALL modules for the selected faculty, not just exact matches
    const query = `
      SELECT 
        m.*,
        f.name as faculty_name,
        i.name as intake_name,
        s.name as semester_name
      FROM modules m
      LEFT JOIN faculties f ON m.faculty_id = f.id
      LEFT JOIN intakes i ON m.intake_id = i.id
      LEFT JOIN semesters s ON m.semester_id = s.id
      WHERE m.faculty_id = $1
      ORDER BY m.code
    `;
    
    const result = await db.query(query, [facultyId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules'
    });
  }
};

// Get modules by lecturer
// Returns modules assigned to the current lecturer
const getModulesByLecturer = async (req, res) => {
  try {
    const lecturerId = req.user?.id || 'LEC001'; // Get from auth or fallback for testing
    
    // Mock data for lecturer modules (in production, this would query the database)
    const allModules = [
      // Modules for LEC001
      { id: 1, code: 'CS101', name: 'Introduction to Programming', faculty_id: 1, intake_id: 1, semester_id: 1, credits: 4, description: 'Basic programming concepts', lecturer_id: 'LEC001' },
      { id: 2, code: 'CS102', name: 'Web Development Fundamentals', faculty_id: 1, intake_id: 1, semester_id: 1, credits: 3, description: 'HTML, CSS, and JavaScript basics', lecturer_id: 'LEC001' },
      { id: 3, code: 'CS301', name: 'Machine Learning', faculty_id: 1, intake_id: 1, semester_id: 3, credits: 4, description: 'Introduction to machine learning algorithms', lecturer_id: 'LEC001' },
      
      // Modules for LEC002
      { id: 4, code: 'CS103', name: 'Database Systems', faculty_id: 1, intake_id: 1, semester_id: 1, credits: 3, description: 'Relational database design and SQL', lecturer_id: 'LEC002' },
      { id: 5, code: 'CS201', name: 'Data Structures and Algorithms', faculty_id: 1, intake_id: 1, semester_id: 2, credits: 4, description: 'Advanced data structures and algorithm analysis', lecturer_id: 'LEC002' },
      { id: 6, code: 'CS302', name: 'Cloud Computing', faculty_id: 1, intake_id: 1, semester_id: 3, credits: 3, description: 'Cloud services and deployment', lecturer_id: 'LEC002' }
    ];

    // Filter modules for current lecturer
    const modules = allModules.filter(module => module.lecturer_id === lecturerId);

    // Add related entity names
    const modulesWithNames = modules.map(module => ({
      ...module,
      faculty_name: module.faculty_id == 1 ? 'Faculty of Computing' : module.faculty_id == 2 ? 'Faculty of Engineering' : 'Faculty of Business',
      intake_name: module.intake_id == 1 ? 'January 2026' : module.intake_id == 2 ? 'May 2026' : 'September 2026',
      semester_name: module.semester_id == 1 ? 'Semester 1' : module.semester_id == 2 ? 'Semester 2' : 'Semester 3'
    }));

    res.json({
      success: true,
      data: modulesWithNames
    });
  } catch (error) {
    console.error('Error fetching lecturer modules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules'
    });
  }
};

// Get quiz structure for lecturer
// Returns the complete structure (faculty, intake, semester, modules) for the lecturer
const getQuizStructureForLecturer = async (req, res) => {
  try {
    const lecturerId = req.user?.id || 'LEC001'; // Get from auth or fallback for testing
    
    // Mock nested structure data for lecturer (in production, this would query the database)
    const structure = [
      {
        id: 1,
        name: 'Faculty of Computing',
        code: 'FC',
        description: 'Computer Science and IT programs',
        intakes: [
          {
            id: 1,
            name: 'January 2026',
            year: 2026,
            description: 'First intake of 2026',
            semesters: [
              {
                id: 1,
                name: 'Semester 1',
                number: 1,
                academic_year: '2025/2026',
                modules: [
                  { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 4, description: 'Basic programming concepts', lecturer_id: 'LEC001' },
                  { id: 2, code: 'CS102', name: 'Web Development Fundamentals', credits: 3, description: 'HTML, CSS, and JavaScript basics', lecturer_id: 'LEC001' }
                ]
              },
              {
                id: 2,
                name: 'Semester 2',
                number: 2,
                academic_year: '2025/2026',
                modules: [
                  { id: 4, code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, description: 'Advanced data structures', lecturer_id: 'LEC002' }
                ]
              },
              {
                id: 3,
                name: 'Semester 3',
                number: 3,
                academic_year: '2025/2026',
                modules: [
                  { id: 3, code: 'CS301', name: 'Machine Learning', credits: 4, description: 'Introduction to ML', lecturer_id: 'LEC001' }
                ]
              }
            ]
          }
        ]
      }
    ];

    res.json({
      success: true,
      data: structure
    });
  } catch (error) {
    console.error('Error fetching quiz structure:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz structure'
    });
  }
};

// Create new module
// Allows lecturers to create new modules within their assigned structure
const createModule = async (req, res) => {
  try {
    const {
      code,
      name,
      faculty_id,
      intake_id,
      semester_id,
      credits,
      description
    } = req.body;

    const lecturerId = req.user?.id || 'LEC001'; // Get from auth or fallback

    // Validate required fields
    const requiredFields = ['code', 'name', 'faculty_id', 'intake_id', 'semester_id'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Mock creation response (in production, this would insert into database)
    const newModule = {
      id: Math.floor(Math.random() * 1000) + 100, // Generate random ID
      code,
      name,
      faculty_id: parseInt(faculty_id),
      intake_id: parseInt(intake_id),
      semester_id: parseInt(semester_id),
      credits: parseInt(credits) || 3,
      description,
      lecturer_id,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: newModule
    });
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating module'
    });
  }
};

// Get notices for a specific module
const getModuleNotices = async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    // Mock data for notices (in production, this would query the database)
    const notices = [
      { id: 1, title: 'Midterm Exam Schedule', content: 'The midterm exam will be held on May 15th at 10:00 AM.', module_id: moduleId, created_at: new Date().toISOString() },
      { id: 2, title: 'New Resource Uploaded', content: 'Check the resources tab for the latest lecture notes.', module_id: moduleId, created_at: new Date().toISOString() }
    ];

    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notices'
    });
  }
};

// Export all controller functions for use in routes
module.exports = {
  getFaculties,
  getIntakesByFaculty,
  getSemestersByFacultyIntake,
  getModulesByStructure,
  getModulesByLecturer,
  getQuizStructureForLecturer,
  getModuleNotices,
  createModule
};
