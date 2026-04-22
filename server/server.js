// Import required npm packages for the server
const express = require('express'); // Express.js web framework
const http = require('http'); // Node.js HTTP module
const { Server } = require('socket.io'); // Socket.IO for real-time communication
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const path = require('path'); // Node.js path module for file system operations

// Create Express app instance
const app = express();

// Create HTTP server and attach Socket.IO for real-time features
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow frontend origin
    methods: ['GET', 'POST'] // Allowed HTTP methods
  }
});

// Make Socket.IO instance accessible from routes for real-time notifications
app.set('io', io);

// Import all route modules from different modules
const lecturerRoutes = require('./modules/lecture-resource/routes/lecturerRoutes'); // Lecturer-specific routes
const studentRoutes = require('./modules/lecture-resource/routes/studentRoutes'); // Student-specific routes
const userFeedbackRoutes = require('./modules/user-feedback/routes/userRoutes'); // User feedback routes
const authRoutes = require('./modules/login-signin/routes/authRoutes'); // Authentication routes
const timetableRoutes = require('./modules/timetable/routes/timetableRoutes'); // Timetable management routes
const academicTicketRoutes = require('./modules/academic-ticket/routes/index'); // Academic ticket routes (includes quiz structure)
const internshipApplicationsRoutes = require('./modules/academic-ticket/routes/internshipRoutes'); // Internship application routes
const internshipModel = require('./modules/academic-ticket/models/internshipModel'); // Internship model for table initialization

// Database middleware - attach database connection to all requests
// This makes the database available as req.db in all route handlers
app.use((req, res, next) => {
  req.db = require('./config/db'); // Import database connection
  next(); // Continue to next middleware
});

// Global middleware configuration
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files from server/uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploaded files from project/uploads

// ─── Dev-only test login (queries real PostgreSQL) ────────────────────────
// MUST be defined BEFORE app.use('/api/auth', authRoutes) to avoid Express 5
// routing conflict where the auth router intercepts the request.
// REMOVE IN PRODUCTION. This bypasses real auth for testing.
if (process.env.NODE_ENV !== 'production') {
  const jwt = require('jsonwebtoken');
  const pool = require('./config/db');

  const sanitizeUser = (u) => ({
    id: u.id,
    idNumber: u.id_number,
    fullName: u.full_name,
    email: u.email,
    role: u.role,
    status: u.status,
    profileImageUrl: u.profile_image_url || null,
  });

  app.post('/api/auth/dev-login', async (req, res) => {
    try {
      const { role } = req.body;
      // Query the real PostgreSQL database for a user with the requested role
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE role = $1 AND status = $2 LIMIT 1',
        [role || 'student', 'Active']
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: `No ${role} user found in database` });
      }

      const user = rows[0];
      const token = jwt.sign(
        { userId: `${user.role}:${user.id_number}`, role: user.role, idNumber: user.id_number },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
      );
      res.json({ token, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Dev login error:', err.message);
      res.status(500).json({ error: 'Dev login failed' });
    }
  });

  console.log('⚠️  Dev login endpoint active: POST /api/auth/dev-login { "role": "student"|"lecturer"|"admin" }');
}

// Register all API routes with their respective endpoints
// Auth routes come AFTER dev-login to avoid routing conflicts
app.use('/api/lecturer', lecturerRoutes); // Lecturer management endpoints
app.use('/api/student', studentRoutes); // Student management endpoints
app.use('/api/user-feedback', userFeedbackRoutes); // User feedback endpoints
app.use('/api/auth', authRoutes); // Authentication endpoints
app.use('/api/timetable', timetableRoutes); // Timetable management endpoints
app.use('/api/academic-ticket', academicTicketRoutes); // Academic ticket endpoints (includes quiz structure)
app.use('/api/internship-applications', internshipApplicationsRoutes); // Internship application endpoints

// Health check endpoint for monitoring server status
app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'UniHelp API is running' });
});

// Test route for debugging
app.get('/test', (req, res) => {
  res.send('API working');
});

// Test POST route for debugging
app.post('/test-post', (req, res) => {
  console.log('POST /test-post called with body:', req.body);
  res.json({
    success: true,
    message: 'POST test working',
    data: req.body
  });
});

// Working POST submissions route
app.post('/api/academic-ticket/submissions', (req, res) => {
  console.log('POST /api/academic-ticket/submissions called with body:', req.body);
  
  const { quiz_id, student_id, answer } = req.body;
  
  // Validate required fields
  if (!quiz_id || !student_id || !answer) {
    return res.status(400).json({
      success: false,
      message: 'quiz_id, student_id, and answer are required'
    });
  }

  // Return success response (in production, save to database)
  res.status(201).json({
    success: true,
    message: 'Submission created successfully',
    data: {
      id: Date.now(),
      quiz_id: parseInt(quiz_id),
      student_id,
      answer,
      submitted_at: new Date().toISOString(),
      status: 'submitted'
    }
  });
});

// Socket.IO connection handling for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id); // Log when user connects

  // Join a room for a specific user so we can send targeted notifications
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`); // Join user-specific room
    console.log(`User ${userId} joined their notification room`);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); // Log when user disconnects
  });
});

// Start server (using the http server, not app.listen, for Socket.IO compatibility)
const port = Number(process.env.PORT) || 5000; // Get port from environment or default to 5000
server.listen(port, () => {
  console.log(`Server running on port ${port}`); // Log server start
  console.log(`Socket.IO server ready for connections`); // Log Socket.IO ready
  
  // Initialize internship applications table
  internshipModel.initializeInternshipTable().catch(err => {
    console.error('Failed to initialize internship table:', err);
  });
});

// Export app and io instances for use in other modules and route handlers
module.exports = { app, io };
