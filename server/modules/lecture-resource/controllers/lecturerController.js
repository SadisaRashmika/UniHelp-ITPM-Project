const lecturerModel = require('../models/lecturerModel'); // Import the lecturer model

// Controller to fetch lecturer profile data
const getLecturerProfile = async (req, res) => {
  try {
    const { lecturerId } = req.query; // Get the lecturer 'employee_id' from query parameters
    console.log('Fetching lecturer profile for ID:', lecturerId); // Log for debugging

    // Fetch lecturer data using the model (employee_id as a string)
    const lecturerData = await lecturerModel.getLecturerProfile(lecturerId); 

    if (!lecturerData) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    res.status(200).json(lecturerData); // Return lecturer data
  } catch (err) {
    console.error('Error fetching lecturer profile:', err); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error: err.message }); // Send the error message
  }
};

// Controller to fetch pending submissions and bonus requests for the lecturer
const getPendingCounts = async (req, res) => {
  try {
    const { lecturerId } = req.query; // Get the lecturer 'employee_id' from query parameters

    // Use the model to fetch pending counts (submissions and bonus marks)
    const counts = await lecturerModel.getPendingCounts(lecturerId); 

    res.status(200).json(counts); // Return pending counts
  } catch (err) {
    console.error('Error fetching pending counts:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message }); // Send the error message
  }
};

module.exports = {
  getLecturerProfile,
  getPendingCounts,
};