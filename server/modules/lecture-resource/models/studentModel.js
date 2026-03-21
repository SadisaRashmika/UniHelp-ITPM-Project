const db = require('../../../config/db'); // Import the database module

// Fetch student profile data from the database
const getStudentProfile = async (studentId) => {
  const query = `
    SELECT id, name, year, semester, likes, rank 
    FROM students 
    WHERE student_id = $1
  `;
  const result = await db.query(query, [studentId]);  // Query by student_id (string)
  return result.rows[0]; // Return the student data if found
};

module.exports = {
  getStudentProfile,
};