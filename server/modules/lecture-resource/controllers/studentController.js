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

const getLectureResources = async (req, res) => {
  try {
    const resources = await studentModel.getLectureResources();
    res.status(200).json(resources);
  } catch (err) {
    console.error('Error fetching lecture resources:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const uploadStudentNote = async (req, res) => {
  try {
    const { studentId, lectureId, title, shortNote } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const noteId = await studentModel.uploadStudentNote(
      studentId,
      Number(lectureId),
      title,
      shortNote,
      file
    );

    if (!noteId) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(201).json({ message: 'Note uploaded successfully', noteId });
  } catch (err) {
    console.error('Error uploading student note:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const getMyUploads = async (req, res) => {
  try {
    const { studentId } = req.query;
    const uploads = await studentModel.getMyUploads(studentId);
    res.status(200).json(uploads);
  } catch (err) {
    console.error('Error fetching my uploads:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const getAcceptedStudentNotes = async (req, res) => {
  try {
    const { studentId } = req.query;
    const notes = await studentModel.getAcceptedStudentNotes(studentId || null);
    res.status(200).json(notes);
  } catch (err) {
    console.error('Error fetching accepted student notes:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const likeStudentNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { studentId } = req.body;
    const result = await studentModel.likeStudentNote(Number(noteId), studentId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ likes: result.likes });
  } catch (err) {
    console.error('Error liking note:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const createBonusMarkRequest = async (req, res) => {
  try {
    const { studentId, subject, lecturerEmail } = req.body;
    const result = await studentModel.createBonusMarkRequest(studentId, subject, lecturerEmail);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    res.status(201).json({ message: 'Bonus mark request submitted', requestId: result.id });
  } catch (err) {
    console.error('Error creating bonus request:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const deleteAcceptedUpload = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }

    const deleted = await studentModel.deleteAcceptedUpload(studentId, Number(noteId));
    if (!deleted) {
      return res.status(404).json({ message: 'Accepted upload not found for this student' });
    }

    res.status(200).json({ message: 'Accepted upload deleted successfully' });
  } catch (err) {
    console.error('Error deleting accepted upload:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

module.exports = {
  getStudentProfile,
  getLectureResources,
  uploadStudentNote,
  getMyUploads,
  getAcceptedStudentNotes,
  likeStudentNote,
  createBonusMarkRequest,
  deleteAcceptedUpload,
};