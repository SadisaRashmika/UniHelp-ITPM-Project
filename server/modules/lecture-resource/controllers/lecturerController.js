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

const getLecturerStats = async (req, res) => {
  try {
    const { lecturerId } = req.query;
    const stats = await lecturerModel.getLecturerStats(lecturerId);
    res.status(200).json(stats);
  } catch (err) {
    console.error('Error fetching lecturer stats:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

const getLecturerResources = async (req, res) => {
  try {
    const { lecturerId } = req.query;
    const resources = await lecturerModel.getLecturerResources(lecturerId);
    res.status(200).json(resources);
  } catch (err) {
    console.error('Error fetching lecturer resources:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Controller to create a new lecture with yt link
const uploadResource = async (req, res) => {
  try {
    const { lecturerId, title, subject, topic, year, semester, youtubeUrl } = req.body;
    const files = req.files || []; // Files uploaded by the lecturer

    // Save lecture details in the database, including the YouTube URL
    const lectureId = await lecturerModel.uploadResource(lecturerId, title, subject, topic, year, semester, files, youtubeUrl);

    res.status(201).json({ message: 'Resource uploaded successfully', lectureId });
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Controller to create a quiz
const createQuiz = async (req, res) => {
  try {
    const { lectureId, title, questions } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'No questions provided' });
    }

    // Call model function to insert quiz data into the database
    const quizId = await lecturerModel.createQuiz(lectureId, title, questions);

    res.status(201).json({ message: 'Quiz created successfully', quizId });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const deleteLecturerResource = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lecturerId } = req.query;

    const deleted = await lecturerModel.deleteLecturerResource(lecturerId, Number(lectureId));
    if (!deleted) {
      return res.status(404).json({ message: 'Lecture not found or not owned by lecturer' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    const { lecturerId } = req.query;
    const submissions = await lecturerModel.getStudentSubmissions(lecturerId);
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const reviewStudentSubmission = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { lecturerId, action, rejectionNote } = req.body;

    if (!['accepted', 'rejected'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await lecturerModel.reviewStudentSubmission(
      lecturerId,
      Number(noteId),
      action,
      rejectionNote
    );

    if (!result) {
      return res.status(404).json({ message: 'Submission not found for this lecturer' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error reviewing student submission:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getBonusMarkRequests = async (req, res) => {
  try {
    const { lecturerId } = req.query;
    const requests = await lecturerModel.getBonusMarkRequests(lecturerId);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching bonus requests:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const reviewBonusMarkRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { lecturerId, action } = req.body;
    if (!['approved', 'rejected'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await lecturerModel.reviewBonusMarkRequest(lecturerId, Number(requestId), action);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error reviewing bonus request:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const markBonusAdded = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { lecturerId } = req.body;
    const updated = await lecturerModel.markBonusAdded(lecturerId, Number(requestId));
    if (!updated) {
      return res.status(404).json({ message: 'Approved request not found' });
    }
    res.status(200).json({ message: 'Marked as added' });
  } catch (error) {
    console.error('Error marking bonus added:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getLecturerProfile,
  getPendingCounts,
  getLecturerStats,
  getLecturerResources,
  uploadResource,
  createQuiz,
  deleteLecturerResource,
  getStudentSubmissions,
  reviewStudentSubmission,
  getBonusMarkRequests,
  reviewBonusMarkRequest,
  markBonusAdded,
};