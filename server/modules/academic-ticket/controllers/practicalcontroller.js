const { 
  createPractical: createPracticalModel, 
  getPracticals: getPracticalsModel, 
  getPracticalById: getPracticalByIdModel, 
  updatePractical: updatePracticalModel, 
  deletePractical: deletePracticalModel, 
  getRecentPracticalActivities: getRecentPracticalActivitiesModel 
} = require('../models/practicalModel.js');

// Create Practical
const createPractical = async (req, res) => {
  try {
    console.log('=== PRACTICAL CREATION DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const practicalData = {
      title: req.body.title,
      description: req.body.description,
      due_date: req.body.due_date,
      priority: req.body.priority || 'medium',
      course_code: req.body.course_code,
      lecturer_id: req.body.lecturer_id,
      max_marks: req.body.max_marks || 100,
      duration: req.body.duration || 60,
      practical_type: req.body.practical_type || 'lab',
      instructions: req.body.instructions || '',
      requirements: req.body.requirements || [],
      resources: req.body.resources || [],
      submission_type: req.body.submission_type || 'file',
      lab_equipment: req.body.lab_equipment || [],
      software_requirements: req.body.software_requirements || [],
      status: req.body.status || 'pending'
    };

    console.log('Processed practical data:', practicalData);

    // VALIDATION SECTION: Comprehensive Practical Data Validation
    // Validation 1: Required fields check
    const requiredFields = ['title', 'description', 'due_date', 'course_code', 'lecturer_id'];
    const missingFields = requiredFields.filter(field => !practicalData[field]);
    if (missingFields.length > 0) {
      console.log('Validation failed - missing required fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validation 2: Title length and format validation
    if (practicalData.title.trim().length < 3 || practicalData.title.trim().length > 255) {
      console.log('Validation failed - invalid title length');
      return res.status(400).json({ 
        message: 'Title must be between 3 and 255 characters long' 
      });
    }

    // Validation 3: Description length validation
    if (practicalData.description.trim().length < 10 || practicalData.description.trim().length > 2000) {
      console.log('Validation failed - invalid description length');
      return res.status(400).json({ 
        message: 'Description must be between 10 and 2000 characters long' 
      });
    }

    // Validation 4: Due date validation (must be future date)
    const dueDate = new Date(practicalData.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
    if (dueDate <= today) {
      console.log('Validation failed - due date must be in the future');
      return res.status(400).json({ 
        message: 'Due date must be a future date' 
      });
    }

    // Validation 5: Course code format validation (alphanumeric with optional hyphen)
    const courseCodePattern = /^[A-Z]{2,4}[0-9]{3,4}(-[A-Z0-9]{1,3})?$/i;
    if (!courseCodePattern.test(practicalData.course_code.trim())) {
      console.log('Validation failed - invalid course code format');
      return res.status(400).json({ 
        message: 'Course code must be in format like CS301, IT2030, or CS301-1' 
      });
    }

    // Validation 6: Max marks validation (must be between 10 and 200)
    if (practicalData.max_marks < 10 || practicalData.max_marks > 200) {
      console.log('Validation failed - invalid max marks range');
      return res.status(400).json({ 
        message: 'Maximum marks must be between 10 and 200' 
      });
    }

    // Validation 7: Duration validation (must be between 30 and 300 minutes for practicals)
    if (practicalData.duration < 30 || practicalData.duration > 300) {
      console.log('Validation failed - invalid duration range');
      return res.status(400).json({ 
        message: 'Practical duration must be between 30 and 300 minutes' 
      });
    }

    // Validation 8: Priority validation
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(practicalData.priority.toLowerCase())) {
      console.log('Validation failed - invalid priority value');
      return res.status(400).json({ 
        message: 'Priority must be one of: low, medium, high' 
      });
    }

    // Validation 9: Practical type validation
    const validPracticalTypes = ['lab', 'workshop', 'field_work', 'simulation'];
    if (!validPracticalTypes.includes(practicalData.practical_type.toLowerCase())) {
      console.log('Validation failed - invalid practical type');
      return res.status(400).json({ 
        message: 'Practical type must be one of: lab, workshop, field_work, simulation' 
      });
    }

    // Validation 10: Submission type validation
    const validSubmissionTypes = ['file', 'text', 'link', 'code', 'report'];
    if (!validSubmissionTypes.includes(practicalData.submission_type.toLowerCase())) {
      console.log('Validation failed - invalid submission type');
      return res.status(400).json({ 
        message: 'Submission type must be one of: file, text, link, code, report' 
      });
    }

    // Validation 11: Array validation for requirements, equipment, and software
    if (!Array.isArray(practicalData.requirements)) {
      console.log('Validation failed - requirements must be an array');
      return res.status(400).json({ 
        message: 'Requirements must be an array' 
      });
    }

    if (!Array.isArray(practicalData.lab_equipment)) {
      console.log('Validation failed - lab equipment must be an array');
      return res.status(400).json({ 
        message: 'Lab equipment must be an array' 
      });
    }

    if (!Array.isArray(practicalData.software_requirements)) {
      console.log('Validation failed - software requirements must be an array');
      return res.status(400).json({ 
        message: 'Software requirements must be an array' 
      });
    }

    // Validation 12: Array item validation (ensure no empty strings)
    if (practicalData.requirements.some(req => !req.trim())) {
      console.log('Validation failed - requirements cannot contain empty strings');
      return res.status(400).json({ 
        message: 'Requirements cannot contain empty strings' 
      });
    }

    if (practicalData.lab_equipment.some(eq => !eq.trim())) {
      console.log('Validation failed - lab equipment cannot contain empty strings');
      return res.status(400).json({ 
        message: 'Lab equipment cannot contain empty strings' 
      });
    }

    if (practicalData.software_requirements.some(sw => !sw.trim())) {
      console.log('Validation failed - software requirements cannot contain empty strings');
      return res.status(400).json({ 
        message: 'Software requirements cannot contain empty strings' 
      });
    }

    console.log('Calling createPracticalModel...');
    const result = await createPracticalModel(practicalData);
    console.log('Model result:', result);
    
    res.status(201).json({ 
      message: 'Practical created successfully', 
      practical: result 
    });
  } catch (error) {
    console.error('Error creating practical:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

// Get all practicals
const getPracticals = async (req, res) => {
  try {
    const { lecturer_id, course_code, status, practical_type, limit = 20, offset = 0 } = req.query;
    
    const filters = {};
    if (lecturer_id) filters.lecturer_id = lecturer_id;
    if (course_code) filters.course_code = course_code;
    if (status) filters.status = status;
    if (practical_type) filters.practical_type = practical_type;
    
    const result = await getPracticalsModel(filters, parseInt(limit), parseInt(offset));
    
    res.status(200).json({ 
      message: 'Practicals retrieved successfully', 
      practicals: result,
      total: result.length 
    });
  } catch (error) {
    console.error('Error fetching practicals:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

// Get practical by ID
const getPracticalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        message: 'Practical ID is required' 
      });
    }
    
    const result = await getPracticalByIdModel(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Practical not found' });
    }
    
    res.status(200).json({ 
      message: 'Practical retrieved successfully', 
      practical: result 
    });
  } catch (error) {
    console.error('Error fetching practical:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

// Update practical
const updatePractical = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        message: 'Practical ID is required' 
      });
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    // VALIDATION SECTION: Practical Update Data Validation
    // Validation 1: Title validation if provided
    if (updates.title) {
      if (updates.title.trim().length < 3 || updates.title.trim().length > 255) {
        console.log('Validation failed - invalid title length in update');
        return res.status(400).json({ 
          message: 'Title must be between 3 and 255 characters long' 
        });
      }
    }

    // Validation 2: Description validation if provided
    if (updates.description) {
      if (updates.description.trim().length < 10 || updates.description.trim().length > 2000) {
        console.log('Validation failed - invalid description length in update');
        return res.status(400).json({ 
          message: 'Description must be between 10 and 2000 characters long' 
        });
      }
    }

    // Validation 3: Due date validation if provided
    if (updates.due_date) {
      const dueDate = new Date(updates.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate <= today) {
        console.log('Validation failed - due date must be in the future in update');
        return res.status(400).json({ 
          message: 'Due date must be a future date' 
        });
      }
    }

    // Validation 4: Course code validation if provided
    if (updates.course_code) {
      const courseCodePattern = /^[A-Z]{2,4}[0-9]{3,4}(-[A-Z0-9]{1,3})?$/i;
      if (!courseCodePattern.test(updates.course_code.trim())) {
        console.log('Validation failed - invalid course code format in update');
        return res.status(400).json({ 
          message: 'Course code must be in format like CS301, IT2030, or CS301-1' 
        });
      }
    }

    // Validation 5: Max marks validation if provided
    if (updates.max_marks !== undefined) {
      if (updates.max_marks < 10 || updates.max_marks > 200) {
        console.log('Validation failed - invalid max marks range in update');
        return res.status(400).json({ 
          message: 'Maximum marks must be between 10 and 200' 
        });
      }
    }

    // Validation 6: Duration validation if provided
    if (updates.duration !== undefined) {
      if (updates.duration < 30 || updates.duration > 300) {
        console.log('Validation failed - invalid duration range in update');
        return res.status(400).json({ 
          message: 'Practical duration must be between 30 and 300 minutes' 
        });
      }
    }

    // Validation 7: Priority validation if provided
    if (updates.priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(updates.priority.toLowerCase())) {
        console.log('Validation failed - invalid priority value in update');
        return res.status(400).json({ 
          message: 'Priority must be one of: low, medium, high' 
        });
      }
    }

    // Validation 8: Practical type validation if provided
    if (updates.practical_type) {
      const validPracticalTypes = ['lab', 'workshop', 'field_work', 'simulation'];
      if (!validPracticalTypes.includes(updates.practical_type.toLowerCase())) {
        console.log('Validation failed - invalid practical type in update');
        return res.status(400).json({ 
          message: 'Practical type must be one of: lab, workshop, field_work, simulation' 
        });
      }
    }

    // Validation 9: Submission type validation if provided
    if (updates.submission_type) {
      const validSubmissionTypes = ['file', 'text', 'link', 'code', 'report'];
      if (!validSubmissionTypes.includes(updates.submission_type.toLowerCase())) {
        console.log('Validation failed - invalid submission type in update');
        return res.status(400).json({ 
          message: 'Submission type must be one of: file, text, link, code, report' 
        });
      }
    }

    // Validation 10: Array validation if provided
    if (updates.requirements !== undefined && !Array.isArray(updates.requirements)) {
      console.log('Validation failed - requirements must be an array in update');
      return res.status(400).json({ 
        message: 'Requirements must be an array' 
      });
    }

    if (updates.lab_equipment !== undefined && !Array.isArray(updates.lab_equipment)) {
      console.log('Validation failed - lab equipment must be an array in update');
      return res.status(400).json({ 
        message: 'Lab equipment must be an array' 
      });
    }

    if (updates.software_requirements !== undefined && !Array.isArray(updates.software_requirements)) {
      console.log('Validation failed - software requirements must be an array in update');
      return res.status(400).json({ 
        message: 'Software requirements must be an array' 
      });
    }
    
    const result = await updatePracticalModel(id, updates);
    
    if (!result) {
      return res.status(404).json({ message: 'Practical not found' });
    }
    
    res.status(200).json({ 
      message: 'Practical updated successfully', 
      practical: result 
    });
  } catch (error) {
    console.error('Error updating practical:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

// Delete practical
const deletePractical = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        message: 'Practical ID is required' 
      });
    }
    
    const result = await deletePracticalModel(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Practical not found' });
    }
    
    res.status(200).json({ 
      message: 'Practical deleted successfully',
      practical: result
    });
  } catch (error) {
    console.error('Error deleting practical:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

// Get recent practical activities for overview
const getRecentPracticalActivities = async (req, res) => {
  try {
    const { lecturer_id, limit = 10 } = req.query;
    
    if (!lecturer_id) {
      return res.status(400).json({ 
        message: 'Lecturer ID is required' 
      });
    }
    
    const result = await getRecentPracticalActivitiesModel(lecturer_id, parseInt(limit));
    
    res.status(200).json({ 
      message: 'Recent practical activities retrieved successfully', 
      activities: result 
    });
  } catch (error) {
    console.error('Error fetching recent practical activities:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

// Submit practical (for students)
const submitPractical = async (req, res) => {
  try {
    console.log('=== PRACTICAL SUBMISSION DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { practical_id, student_id, submission_text, submission_link } = req.body;
    
    // Validate required fields
    if (!practical_id || !student_id) {
      return res.status(400).json({ 
        message: 'Missing required fields: practical_id, student_id' 
      });
    }
    
    const submissionData = {
      practical_id,
      student_id,
      submission_text: submission_text || '',
      submission_link: submission_link || '',
      submission_files: req.files ? req.files.map(file => file.filename) : [],
      submitted_at: new Date()
    };
    
    // This would call a model function to save the submission
    // const result = await submitPracticalModel(submissionData);
    
    res.status(201).json({ 
      message: 'Practical submitted successfully', 
      submission: submissionData 
    });
  } catch (error) {
    console.error('Error submitting practical:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

// Grade practical submission
const gradePractical = async (req, res) => {
  try {
    console.log('=== PRACTICAL GRADING DEBUG ===');
    console.log('Request body:', req.body);
    
    const { submission_id, marks, feedback, graded_by } = req.body;
    
    // Validate required fields
    if (!submission_id || marks === undefined || !graded_by) {
      return res.status(400).json({ 
        message: 'Missing required fields: submission_id, marks, graded_by' 
      });
    }
    
    const gradingData = {
      submission_id,
      marks,
      feedback: feedback || '',
      graded_by,
      graded_at: new Date()
    };
    
    // This would call a model function to save the grading
    // const result = await gradePracticalModel(gradingData);
    
    res.status(200).json({ 
      message: 'Practical graded successfully', 
      grading: gradingData 
    });
  } catch (error) {
    console.error('Error grading practical:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

module.exports = {
  createPractical,
  getPracticals,
  getPracticalById,
  updatePractical,
  deletePractical,
  getRecentPracticalActivities,
  submitPractical,
  gradePractical
};