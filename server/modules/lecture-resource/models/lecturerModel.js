const db = require('../../../config/db'); // Import the database module

// Fetch lecturer profile data from the database
const getLecturerProfile = async (employeeId) => {
  const query = `
    SELECT id, name, title, department, points, employee_id, email 
    FROM lecturers 
    WHERE employee_id = $1
  `;
  const result = await db.query(query, [employeeId]);
  return result.rows[0]; // Return the lecturer data if found
};

// Fetch pending submissions and bonus mark requests for the lecturer
const getPendingCounts = async (employeeId) => {
  const submissionsQuery = `
    SELECT COUNT(*) AS submissions 
    FROM student_notes 
    WHERE status = 'pending' AND lecture_id IN 
      (SELECT id FROM lectures WHERE lecturer_id = 
        (SELECT id FROM lecturers WHERE employee_id = $1))
  `;
  const bonusMarksQuery = `
    SELECT COUNT(*) AS bonusMarks 
    FROM bonus_mark_requests 
    WHERE status = 'pending' AND lecturer_id = 
      (SELECT id FROM lecturers WHERE employee_id = $1)
  `;

  const submissionsResult = await db.query(submissionsQuery, [employeeId]);
  const bonusMarksResult = await db.query(bonusMarksQuery, [employeeId]);

  return {
    submissions: parseInt(submissionsResult.rows[0].submissions, 10),
    bonusMarks: parseInt(bonusMarksResult.rows[0].bonusMarks, 10),
  };
};

module.exports = {
  getLecturerProfile,
  getPendingCounts,
};