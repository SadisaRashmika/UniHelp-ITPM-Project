const express = require('express');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');

const app = express();

// Import routes
const lecturerRoutes = require('./modules/lecture-resource/routes/lecturerRoutes');
const studentRoutes = require('./modules/lecture-resource/routes/studentRoutes');

// Middleware
app.use(cors()); // Use CORS to enable cross-origin requests
app.use(bodyParser.json());

// Use routes
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});