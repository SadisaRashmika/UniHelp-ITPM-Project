const express = require('express');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Import routes
const lecturerRoutes = require('./modules/lecture-resource/routes/lecturerRoutes');
const studentRoutes = require('./modules/lecture-resource/routes/studentRoutes');
const userFeedbackRoutes = require('./modules/user-feedback/routes/userRoutes');

// Middleware
app.use(cors()); // Use CORS to enable cross-origin requests
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Use routes
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/user-feedback', userFeedbackRoutes);

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});