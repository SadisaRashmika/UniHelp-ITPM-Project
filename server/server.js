const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Make io accessible from routes
app.set('io', io);

// Import routes
const lecturerRoutes = require('./modules/lecture-resource/routes/lecturerRoutes');
const studentRoutes = require('./modules/lecture-resource/routes/studentRoutes');
const userFeedbackRoutes = require('./modules/user-feedback/routes/userRoutes');
const authRoutes = require('./modules/login-signin/routes/authRoutes');
const timetableRoutes = require('./modules/timetable/routes/timetableRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
      let user = null;

      if (role === 'lecturer') {
        const { rows } = await pool.query(
          `
            SELECT id, employee_id AS id_number, name AS full_name, email, 'lecturer' AS role, status, profile_image_url
            FROM lecturers
            WHERE status = 'Active'
            ORDER BY id
            LIMIT 1
          `
        );
        user = rows[0] || null;
      } else {
        const { rows } = await pool.query(
          `
            SELECT id, student_id AS id_number, name AS full_name, email, 'student' AS role, status, profile_image_url
            FROM students
            WHERE status = 'Active'
            ORDER BY id
            LIMIT 1
          `
        );
        user = rows[0] || null;
      }

      if (!user) {
        return res.status(404).json({ error: `No ${role || 'student'} user found in database` });
      }

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

  console.log('⚠️  Dev login endpoint active: POST /api/auth/dev-login { "role": "student"|"lecturer" }');
}

// Use routes (auth routes come AFTER dev-login to avoid routing conflict)
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/user-feedback', userFeedbackRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'UniHelp API is running' });
});

// ─── Socket.IO connection handling ─────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join a room for a specific user so we can send targeted notifications
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined their notification room`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Start server (using the http server, not app.listen, for Socket.IO)
const port = Number(process.env.PORT) || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Socket.IO server ready for connections`);
});

// Export io for use in route handlers
module.exports = { app, io };
