const studentModel = require('../models/studentModel'); // Import the student model

// Controller to fetch student profile data
const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.query; // Get the student 'student_id' from query parameters
    console.log('Fetching student profile for ID:', studentId); // Log for debugging

    // Fetch the student data using the model (student_id as a string)
    const studentData = await studentModel.getStudentProfile(studentId); 

    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(studentData); // Return student data
  } catch (err) {
    console.error('Error fetching student profile:', err); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error: err.message }); // Send the error message
  }
};

module.exports = {
  getStudentProfile,
};