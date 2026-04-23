// Timetable routes
// Combines timetable, booking, notification, and lecturer stats endpoints
// Uses the auth middleware (requireAuth/requireRole) and the fresh PostgreSQL schema
// JWT provides idNumber (e.g., "STU001" or "LEC001"); timetable tables use the
// role-specific lecturer/student tables instead of a shared users table.

const express = require('express');
const router = express.Router();
const db = require('../../../db/timetableDb');
const { requireAuth, requireRole } = require('../../../middleware/auth');

async function resolveAccountByIdNumber(idNumber) {
  const lecturerResult = await db.query(
    `
      SELECT id, employee_id AS id_number, name AS full_name, email, 'lecturer' AS role
      FROM lecturers
      WHERE employee_id = $1
      LIMIT 1
    `,
    [idNumber]
  );

  if (lecturerResult.rows.length > 0) {
    return lecturerResult.rows[0];
  }

  const studentResult = await db.query(
    `
      SELECT id, student_id AS id_number, name AS full_name, email, 'student' AS role
      FROM students
      WHERE student_id = $1
      LIMIT 1
    `,
    [idNumber]
  );

  if (studentResult.rows.length > 0) {
    return studentResult.rows[0];
  }

  return null;
}

async function resolveLecturerId(idNumber) {
  const account = await resolveAccountByIdNumber(idNumber);
  if (!account || account.role !== 'lecturer') {
    throw new Error(`Lecturer not found with id_number: ${idNumber}`);
  }

  return account.id;
}

async function resolveStudentId(idNumber) {
  const account = await resolveAccountByIdNumber(idNumber);
  if (!account || account.role !== 'student') {
    throw new Error(`Student not found with id_number: ${idNumber}`);
  }

  return account.id;
}

// ─── Timetable routes (authenticated users) ────────────────────────────────

// GET /api/timetable/subjects
router.get('/subjects', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM subjects ORDER BY subject_code');
    res.json({ success: true, subjects: result.rows });
  } catch (error) {
    console.error('Get subjects error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/timetable/locations
router.get('/locations', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM locations ORDER BY room_name');
    res.json({ success: true, locations: result.rows });
  } catch (error) {
    console.error('Get locations error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/timetable/timeslots
router.get('/timeslots', requireAuth, async (req, res) => {
  try {
    const { day } = req.query;
    let query = `
            SELECT t.*,
              s.subject_name, s.subject_code,
              l.room_name, l.seat_count,
              lec.name as lecturer_name,
              lec.employee_id as lecturer_id_number
            FROM timeslots t
            JOIN subjects s ON t.subject_id = s.id
            JOIN locations l ON t.location_id = l.id
            JOIN lecturers lec ON t.lecturer_id = lec.id
    `;
    const params = [];

    if (day) {
      query += ' WHERE t.day_of_week = $1';
      params.push(parseInt(day));
    }

    query += ' ORDER BY t.day_of_week, t.start_time';

    const result = await db.query(query, params);
    res.json({ success: true, timeslots: result.rows });
  } catch (error) {
    console.error('Get timeslots error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/timetable/timeslots/:id
router.get('/timeslots/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
            SELECT t.*,
              s.subject_name, s.subject_code,
              l.room_name, l.seat_count,
              lec.name as lecturer_name,
              lec.employee_id as lecturer_id_number
            FROM timeslots t
            JOIN subjects s ON t.subject_id = s.id
            JOIN locations l ON t.location_id = l.id
            JOIN lecturers lec ON t.lecturer_id = lec.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Timeslot not found.' });
    }

    res.json({ success: true, timeslot: result.rows[0] });
  } catch (error) {
    console.error('Get timeslot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// PUT /api/timetable/timeslots/:id/details
// Lecturer updates topic/notice for their lecture. Also sends real-time notification to students.
router.put('/timeslots/:id/details', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { lecture_topic, notice } = req.body;
    const lecturerId = await resolveLecturerId(req.auth.idNumber);

    // Verify this timeslot belongs to the lecturer
    const checkResult = await db.query(
      'SELECT * FROM timeslots WHERE id = $1 AND lecturer_id = $2',
      [id, lecturerId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'You can only edit your own lectures.' });
    }

    const result = await db.query(
      'UPDATE timeslots SET lecture_topic = $1, notice = $2 WHERE id = $3 RETURNING *',
      [lecture_topic, notice, id]
    );

    // Send real-time notification to students who booked this timeslot
    // Get all students who booked this timeslot, including their id_number for Socket.IO room targeting
    const bookedStudents = await db.query(`
      SELECT b.student_id, stu.student_id AS id_number
      FROM bookings b
      JOIN students stu ON b.student_id = stu.id
      WHERE b.timeslot_id = $1
    `, [id]);

    // Get the timeslot details for the notification message
    const timeslotDetails = await db.query(`
      SELECT t.*, s.subject_name, s.subject_code
      FROM timeslots t
      JOIN subjects s ON t.subject_id = s.id
      WHERE t.id = $1
    `, [id]);

    const ts = timeslotDetails.rows[0];
    let notificationMessage = '';
    if (lecture_topic) {
      notificationMessage = `Lecture topic updated for ${ts.subject_code}: ${lecture_topic}`;
    }
    if (notice) {
      notificationMessage += (notificationMessage ? ' | ' : '') + `Notice: ${notice}`;
    }

    // Create notification in database and emit via Socket.IO
    if (notificationMessage && bookedStudents.rows.length > 0) {
      const io = req.app.get('io');

      for (const booking of bookedStudents.rows) {
        // Save notification to database (uses numeric student_id)
        await db.query(
          'INSERT INTO notifications (recipient_role, recipient_id, timeslot_id, message, is_read) VALUES ($1, $2, $3, $4, $5)',
          ['student', booking.student_id, id, notificationMessage, false]
        );

        // Emit real-time notification via Socket.IO using id_number for room name
        // Frontend joins room with user.idNumber (e.g., "STU001"), so room = "user_STU001"
        if (io) {
          io.to(`user_${booking.id_number}`).emit('notification', {
            message: notificationMessage,
            timeslotId: id,
            subjectCode: ts.subject_code,
            timestamp: new Date()
          });
        }
      }
    }

    res.json({ success: true, message: 'Lecture details updated successfully.', timeslot: result.rows[0] });
  } catch (error) {
    console.error('Update timeslot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ─── Booking routes ────────────────────────────────────────────────────────

// GET /api/timetable/bookings/my
router.get('/bookings/my', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can view their bookings.' });
    }

    const studentId = await resolveStudentId(req.auth.idNumber);

    const result = await db.query(`
      SELECT b.*,
             t.day_of_week, t.start_time, t.end_time,
             s.subject_name, s.subject_code,
             l.room_name
      FROM bookings b
      JOIN timeslots t ON b.timeslot_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      JOIN locations l ON t.location_id = l.id
      WHERE b.student_id = $1
      ORDER BY t.day_of_week, t.start_time
    `, [studentId]);

    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// POST /api/timetable/bookings
router.post('/bookings', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can create bookings.' });
    }

    const studentId = await resolveStudentId(req.auth.idNumber);
    const { timeslot_id, seat_number } = req.body;

    if (!timeslot_id || !seat_number) {
      return res.status(400).json({ success: false, message: 'Please provide timeslot_id and seat_number.' });
    }

    const timeslotResult = await db.query(
      'SELECT t.*, l.seat_count FROM timeslots t JOIN locations l ON t.location_id = l.id WHERE t.id = $1',
      [timeslot_id]
    );

    if (timeslotResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Timeslot not found.' });
    }

    const timeslot = timeslotResult.rows[0];

    if (seat_number < 1 || seat_number > timeslot.seat_count) {
      return res.status(400).json({ success: false, message: `Seat number must be between 1 and ${timeslot.seat_count}.` });
    }

    const existingBooking = await db.query(
      'SELECT * FROM bookings WHERE student_id = $1 AND timeslot_id = $2',
      [studentId, timeslot_id]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already booked this lecture.' });
    }

    const seatTaken = await db.query(
      'SELECT * FROM bookings WHERE timeslot_id = $1 AND seat_number = $2',
      [timeslot_id, seat_number]
    );

    if (seatTaken.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'This seat is already taken.' });
    }

    const result = await db.query(
      'INSERT INTO bookings (student_id, timeslot_id, seat_number) VALUES ($1, $2, $3) RETURNING *',
      [studentId, timeslot_id, seat_number]
    );

    res.status(201).json({ success: true, message: 'Booking created successfully.', booking: result.rows[0] });
  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// DELETE /api/timetable/bookings/:id
router.delete('/bookings/:id', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can cancel bookings.' });
    }

    const studentId = await resolveStudentId(req.auth.idNumber);
    const bookingId = req.params.id;

    const bookingResult = await db.query(
      'SELECT * FROM bookings WHERE id = $1 AND student_id = $2',
      [bookingId, studentId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found or you do not have permission to cancel it.' });
    }

    await db.query('DELETE FROM bookings WHERE id = $1', [bookingId]);

    res.json({ success: true, message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/timetable/bookings/timeslot/:timeslotId
router.get('/bookings/timeslot/:timeslotId', requireAuth, async (req, res) => {
  try {
    const { timeslotId } = req.params;

    const result = await db.query(`
      SELECT b.*, stu.name as student_name, stu.student_id as student_id_number
      FROM bookings b
      JOIN students stu ON b.student_id = stu.id
      WHERE b.timeslot_id = $1
      ORDER BY b.seat_number
    `, [timeslotId]);

    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error('Get timeslot bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// PUT /api/timetable/bookings/:id/attendance
router.put('/bookings/:id/attendance', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'lecturer') {
      return res.status(403).json({ success: false, message: 'Only lecturers can mark attendance.' });
    }

    const bookingId = req.params.id;
    const { status } = req.body;
    const lecturerId = await resolveLecturerId(req.auth.idNumber);

    if (!['attended', 'absent', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be attended, absent, or pending.' });
    }

    const bookingResult = await db.query(`
      SELECT b.*, t.lecturer_id
      FROM bookings b
      JOIN timeslots t ON b.timeslot_id = t.id
      WHERE b.id = $1
    `, [bookingId]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const booking = bookingResult.rows[0];

    if (booking.lecturer_id !== lecturerId) {
      return res.status(403).json({ success: false, message: 'You can only mark attendance for your own lectures.' });
    }

    const result = await db.query(
      'UPDATE bookings SET attendance_status = $1 WHERE id = $2 RETURNING *',
      [status, bookingId]
    );

    res.json({ success: true, message: 'Attendance updated successfully.', booking: result.rows[0] });
  } catch (error) {
    console.error('Mark attendance error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ─── Notification routes ──────────────────────────────────────────────────

// GET /api/timetable/notifications
// Get all notifications for the logged-in user
router.get('/notifications', requireAuth, async (req, res) => {
  try {
    const account = await resolveAccountByIdNumber(req.auth.idNumber);
    if (!account) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const result = await db.query(`
      SELECT n.*, t.day_of_week, t.start_time, t.end_time,
             s.subject_name, s.subject_code
      FROM notifications n
      JOIN timeslots t ON n.timeslot_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE n.recipient_role = $1 AND n.recipient_id = $2
      ORDER BY n.created_at DESC
    `, [account.role, account.id]);

    res.json({ success: true, notifications: result.rows });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/timetable/notifications/unread-count
// Get count of unread notifications for the logged-in user
router.get('/notifications/unread-count', requireAuth, async (req, res) => {
  try {
    const account = await resolveAccountByIdNumber(req.auth.idNumber);
    if (!account) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const result = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE recipient_role = $1 AND recipient_id = $2 AND is_read = false',
      [account.role, account.id]
    );

    res.json({ success: true, count: parseInt(result.rows[0].count) || 0 });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// PUT /api/timetable/notifications/:id/read
// Mark a notification as read
router.put('/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const account = await resolveAccountByIdNumber(req.auth.idNumber);
    if (!account) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check the notification belongs to this user
    const checkResult = await db.query(
      'SELECT * FROM notifications WHERE id = $1 AND recipient_role = $2 AND recipient_id = $3',
      [id, account.role, account.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1',
      [id]
    );

    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark notification read error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// PUT /api/timetable/notifications/read-all
// Mark all notifications as read for the logged-in user
router.put('/notifications/read-all', requireAuth, async (req, res) => {
  try {
    const account = await resolveAccountByIdNumber(req.auth.idNumber);
    if (!account) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await db.query(
      'UPDATE notifications SET is_read = true WHERE recipient_role = $1 AND recipient_id = $2 AND is_read = false',
      [account.role, account.id]
    );

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all read error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ─── Lecturer stats routes ────────────────────────────────────────────────

// GET /api/timetable/lecturer/stats
// Get statistics for the logged-in lecturer
router.get('/lecturer/stats', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'lecturer') {
      return res.status(403).json({ success: false, message: 'Only lecturers can view stats.' });
    }

    const lecturerId = await resolveLecturerId(req.auth.idNumber);

    const lecturesResult = await db.query(
      'SELECT COUNT(*) as total FROM timeslots WHERE lecturer_id = $1',
      [lecturerId]
    );

    const bookingsResult = await db.query(`
          SELECT COUNT(*) as total
          FROM bookings b
          JOIN timeslots t ON b.timeslot_id = t.id
          WHERE t.lecturer_id = $1
        `, [lecturerId]);

    const timeslotsResult = await db.query(
          'SELECT start_time, end_time FROM timeslots WHERE lecturer_id = $1',
          [lecturerId]
        );

    let totalMinutes = 0;
    for (const slot of timeslotsResult.rows) {
      const [startH, startM] = slot.start_time.split(':').map(Number);
      const [endH, endM] = slot.end_time.split(':').map(Number);
      totalMinutes += (endH * 60 + endM) - (startH * 60 + startM);
    }

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    res.json({
      success: true,
      stats: {
        totalLectures: parseInt(lecturesResult.rows[0].total) || 0,
        totalBookings: parseInt(bookingsResult.rows[0].total) || 0,
        hoursPerWeek: totalHours
      }
    });
  } catch (error) {
    console.error('Get lecturer stats error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/timetable/lecturer/attendance-csv/:timeslotId
// Download attendance as CSV for a specific timeslot
router.get('/lecturer/attendance-csv/:timeslotId', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'lecturer') {
      return res.status(403).json({ success: false, message: 'Only lecturers can download attendance.' });
    }

    const { timeslotId } = req.params;
    const lecturerId = await resolveLecturerId(req.auth.idNumber);

    // Verify this timeslot belongs to the lecturer
    const timeslotCheck = await db.query(
      'SELECT * FROM timeslots WHERE id = $1 AND lecturer_id = $2',
      [timeslotId, lecturerId]
    );

    if (timeslotCheck.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'You can only download attendance for your own lectures.' });
    }

    // Get timeslot details
    const timeslotDetails = await db.query(`
      SELECT t.*, s.subject_name, s.subject_code, l.room_name
      FROM timeslots t
      JOIN subjects s ON t.subject_id = s.id
      JOIN locations l ON t.location_id = l.id
      WHERE t.id = $1
    `, [timeslotId]);

    if (timeslotDetails.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Timeslot not found.' });
    }

    // Get bookings with student names
    const bookingsResult = await db.query(`
      SELECT b.seat_number, b.attendance_status, stu.name as student_name, stu.email
      FROM bookings b
      JOIN students stu ON b.student_id = stu.id
      WHERE b.timeslot_id = $1
      ORDER BY b.seat_number
    `, [timeslotId]);

    const ts = timeslotDetails.rows[0];
    const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Build CSV content
    let csvContent = 'Attendance Report\n';
    csvContent += `Subject,${ts.subject_name} (${ts.subject_code})\n`;
    csvContent += `Day,${DAYS[ts.day_of_week] || 'Unknown'}\n`;
    csvContent += `Time,${ts.start_time} - ${ts.end_time}\n`;
    csvContent += `Room,${ts.room_name}\n\n`;
    csvContent += 'Seat Number,Student Name,Email,Attendance Status\n';

    for (const booking of bookingsResult.rows) {
      csvContent += `${booking.seat_number},${booking.student_name},${booking.email},${booking.attendance_status}\n`;
    }

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_${ts.subject_code}_${DAYS[ts.day_of_week] || 'day'}.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Download attendance CSV error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ─── Lecturer management routes ───────────────────────────────────────────

// GET /api/timetable/lecturer/lecturers
router.get('/lecturer/lecturers', requireAuth, requireRole('lecturer'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, employee_id AS id_number, name AS full_name, email FROM lecturers ORDER BY full_name'
    );
    res.json({ success: true, lecturers: result.rows });
  } catch (error) {
    console.error('Get lecturers error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// POST /api/timetable/lecturer/timeslots
router.post('/lecturer/timeslots', requireAuth, requireRole('lecturer'), async (req, res) => {
  try {
    const { subject_id, location_id, day_of_week, start_time, end_time } = req.body;
    const lecturerId = await resolveLecturerId(req.auth.idNumber);
    const parsedSubjectId = Number(subject_id);
    const parsedLocationId = Number(location_id);
    const parsedDay = Number(day_of_week);

    if (!parsedSubjectId || !parsedLocationId || !parsedDay || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (parsedDay < 1 || parsedDay > 5) {
      return res.status(400).json({ success: false, message: 'Invalid day selected.' });
    }

    if (start_time >= end_time) {
      return res.status(400).json({ success: false, message: 'End time must be later than start time.' });
    }

    // Check for conflicts
    const existingSlots = await db.query(
      'SELECT * FROM timeslots WHERE location_id = $1 AND day_of_week = $2',
      [parsedLocationId, parsedDay]
    );

    const hasConflict = existingSlots.rows.some(slot => {
      return (start_time < slot.end_time && end_time > slot.start_time);
    });

    if (hasConflict) {
      return res.status(400).json({ success: false, message: 'Room is already booked at this time.' });
    }

    const result = await db.query(`
      INSERT INTO timeslots (subject_id, lecturer_id, location_id, day_of_week, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [parsedSubjectId, lecturerId, parsedLocationId, parsedDay, start_time, end_time]);

    const fullResult = await db.query(`
            SELECT t.*,
              s.subject_name, s.subject_code,
              l.room_name, l.seat_count,
              lec.name as lecturer_name,
              lec.employee_id as lecturer_id_number
            FROM timeslots t
            JOIN subjects s ON t.subject_id = s.id
            JOIN locations l ON t.location_id = l.id
            JOIN lecturers lec ON t.lecturer_id = lec.id
      WHERE t.id = $1
    `, [result.rows[0].id]);

    res.status(201).json({ success: true, message: 'Timeslot created successfully.', timeslot: fullResult.rows[0] });
  } catch (error) {
    console.error('Create timeslot error:', error.message);
    if (error.code === '23503') {
      return res.status(400).json({ success: false, message: 'Invalid subject or location selected.' });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// PUT /api/timetable/lecturer/timeslots/:id
router.put('/lecturer/timeslots/:id', requireAuth, requireRole('lecturer'), async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, location_id, day_of_week, start_time, end_time } = req.body;
    const lecturerId = await resolveLecturerId(req.auth.idNumber);

    const checkResult = await db.query('SELECT * FROM timeslots WHERE id = $1 AND lecturer_id = $2', [id, lecturerId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Timeslot not found or you do not have permission to edit it.' });
    }

    await db.query(`
      UPDATE timeslots
      SET subject_id = $1, lecturer_id = $2, location_id = $3, day_of_week = $4, start_time = $5, end_time = $6
      WHERE id = $7 AND lecturer_id = $8
      RETURNING *
    `, [subject_id, lecturerId, location_id, day_of_week, start_time, end_time, id, lecturerId]);

    const fullResult = await db.query(`
            SELECT t.*,
              s.subject_name, s.subject_code,
              l.room_name, l.seat_count,
              lec.name as lecturer_name,
              lec.employee_id as lecturer_id_number
            FROM timeslots t
            JOIN subjects s ON t.subject_id = s.id
            JOIN locations l ON t.location_id = l.id
            JOIN lecturers lec ON t.lecturer_id = lec.id
      WHERE t.id = $1
    `, [id]);

    res.json({ success: true, message: 'Timeslot updated successfully.', timeslot: fullResult.rows[0] });
  } catch (error) {
    console.error('Update timeslot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// DELETE /api/timetable/lecturer/timeslots/:id
router.delete('/lecturer/timeslots/:id', requireAuth, requireRole('lecturer'), async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = await resolveLecturerId(req.auth.idNumber);

    const ownershipCheck = await db.query('SELECT id FROM timeslots WHERE id = $1 AND lecturer_id = $2', [id, lecturerId]);
    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Timeslot not found or you do not have permission to delete it.' });
    }

    // Delete related notifications first (FK constraint: notifications_timeslot_id_fkey)
    await db.query('DELETE FROM notifications WHERE timeslot_id = $1', [id]);

    // Delete related bookings (FK constraint: bookings_timeslot_id_fkey)
    const bookingsCheck = await db.query('SELECT * FROM bookings WHERE timeslot_id = $1', [id]);
    if (bookingsCheck.rows.length > 0) {
      await db.query('DELETE FROM bookings WHERE timeslot_id = $1', [id]);
    }

    const result = await db.query('DELETE FROM timeslots WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Timeslot not found.' });
    }

    res.json({ success: true, message: 'Timeslot deleted successfully.' });
  } catch (error) {
    console.error('Delete timeslot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// POST /api/timetable/lecturer/subjects
router.post('/lecturer/subjects', requireAuth, requireRole('lecturer'), async (req, res) => {
  try {
    const { subject_name, subject_code } = req.body;

    if (!subject_name || !subject_code) {
      return res.status(400).json({ success: false, message: 'Please provide subject name and code.' });
    }

    const result = await db.query(
      'INSERT INTO subjects (subject_name, subject_code) VALUES ($1, $2) RETURNING *',
      [subject_name, subject_code]
    );

    res.status(201).json({ success: true, message: 'Subject created successfully.', subject: result.rows[0] });
  } catch (error) {
    console.error('Create subject error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// POST /api/timetable/lecturer/locations
router.post('/lecturer/locations', requireAuth, requireRole('lecturer'), async (req, res) => {
  try {
    const { room_name, seat_count } = req.body;

    if (!room_name || !seat_count) {
      return res.status(400).json({ success: false, message: 'Please provide room name and seat count.' });
    }

    const result = await db.query(
      'INSERT INTO locations (room_name, seat_count) VALUES ($1, $2) RETURNING *',
      [room_name, seat_count]
    );

    res.status(201).json({ success: true, message: 'Location created successfully.', location: result.rows[0] });
  } catch (error) {
    console.error('Create location error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
