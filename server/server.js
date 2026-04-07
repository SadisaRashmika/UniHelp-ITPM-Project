const express = require('express');
require('dotenv').config();
const cors = require('cors'); // Import CORS
const path = require('path');

const app = express();

// Import routes
const lecturerRoutes = require('./modules/lecture-resource/routes/lecturerRoutes');
const studentRoutes = require('./modules/lecture-resource/routes/studentRoutes');
const authRoutes = require('./modules/login-signin/routes/authRoutes');

// Middleware
app.use(cors()); // Use CORS to enable cross-origin requests
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Use routes
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'UniHelp API is running' });
});

// Start server
const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});