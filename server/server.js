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
const authRoutes = require('./modules/login-signin/routes/authRoutes');
const timetableRoutes = require('./modules/timetable/routes/timetableRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Dev-only test login (works without PostgreSQL) ────────────────────────
// MUST be defined BEFORE app.use('/api/auth', authRoutes) to avoid Express 5
// routing conflict where the auth router intercepts the request.
// REMOVE IN PRODUCTION. This bypasses real auth for testing when DB is down.
if (process.env.NODE_ENV !== 'production') {
  const jwt = require('jsonwebtoken');

  const DEV_USERS = {
    student:   { id: 5, id_number: 'STU001', full_name: 'Kavindu Perera',   email: 'kavindu.perera@student.unihelp.com',  role: 'student',   status: 'active', profile_image_url: null },
    lecturer:  { id: 2, id_number: 'LEC001', full_name: 'Dr. Sarath Gunasekara',    email: 'sarath.gunasekara@unihelp.com',    role: 'lecturer',  status: 'active', profile_image_url: null },
    admin:     { id: 1, id_number: 'ADM001', full_name: 'Bandula Jayawardena',     email: 'admin@unihelp.com',  role: 'admin',     status: 'active', profile_image_url: null },
  };

  const sanitizeUser = (u) => ({
    id: u.id,
    idNumber: u.id_number,
    fullName: u.full_name,
    email: u.email,
    role: u.role,
    status: u.status,
    profileImageUrl: u.profile_image_url || null,
  });

  app.post('/api/auth/dev-login', (req, res) => {
    const { role } = req.body;
    const user = DEV_USERS[role] || DEV_USERS.student;
    const token = jwt.sign(
      { userId: user.id, role: user.role, idNumber: user.id_number },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );
    res.json({ token, user: sanitizeUser(user) });
  });

  console.log('⚠️  Dev login endpoint active: POST /api/auth/dev-login { "role": "student"|"lecturer"|"admin" }');
}

// Use routes (auth routes come AFTER dev-login to avoid routing conflict)
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);
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
