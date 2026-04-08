// Timetable routes
// Combines admin, timetable, booking, notification, and lecturer stats endpoints
// Uses the auth middleware (requireAuth/requireRole) and real PostgreSQL timetable DB
// JWT provides idNumber (e.g., "STU001"); timetable tables use numeric users.id as FK
// so we resolve the numeric ID via resolveNumericUserId() helper

const express = require('express');
const router = express.Router();
const db = require('../../../db/timetableDb');
const { requireAuth, requireRole } = require('../../../middleware/auth');

/**
 * Resolve the numeric users.id from req.auth.idNumber.
 * Timetable tables store users.id (numeric) as FK, but JWT provides idNumber (e.g., "STU001").
 */
async function resolveNumericUserId(idNumber) {
  const result = await db.query(
    'SELECT id FROM users WHERE id_number = $1',
    [idNumber]
  );
  if (result.rows.length === 0) {
    throw new Error(`User not found with id_number: ${idNumber}`);
  }
  return result.rows[0].id;
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
             u.full_name as lecturer_name,
             u.id_number as lecturer_id_number
      FROM timeslots t
      JOIN subjects s ON t.subject_id = s.id
      JOIN locations l ON t.location_id = l.id
      JOIN users u ON t.lecturer_id = u.id
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
             u.full_name as lecturer_name,
             u.id_number as lecturer_id_number
      FROM timeslots t
      JOIN subjects s ON t.subject_id = s.id
      JOIN locations l ON t.location_id = l.id
      JOIN users u ON t.lecturer_id = u.id
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
    const lecturerId = await resolveNumericUserId(req.auth.idNumber);

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
      SELECT b.student_id, u.id_number
      FROM bookings b
      JOIN users u ON b.student_id = u.id
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
          'INSERT INTO notifications (user_id, timeslot_id, message, is_read) VALUES ($1, $2, $3, $4)',
          [booking.student_id, id, notificationMessage, false]
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

    const studentId = await resolveNumericUserId(req.auth.idNumber);

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

    const studentId = await resolveNumericUserId(req.auth.idNumber);
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

    const studentId = await resolveNumericUserId(req.auth.idNumber);
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
      SELECT b.*, u.full_name as student_name
      FROM bookings b
      JOIN users u ON b.student_id = u.id
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
    if (req.auth.role !== 'lecturer' && req.auth.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only lecturers can mark attendance.' });
    }

    const bookingId = req.params.id;
    const { status } = req.body;
    const lecturerId = await resolveNumericUserId(req.auth.idNumber);

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

    if (req.auth.role !== 'admin' && booking.lecturer_id !== lecturerId) {
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
    const userId = await resolveNumericUserId(req.auth.idNumber);

    const result = await db.query(`
      SELECT n.*, t.day_of_week, t.start_time, t.end_time,
             s.subject_name, s.subject_code
      FROM notifications n
      JOIN timeslots t ON n.timeslot_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
    `, [userId]);

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
    const userId = await resolveNumericUserId(req.auth.idNumber);

    const result = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
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
    const userId = await resolveNumericUserId(req.auth.idNumber);

    // Check the notification belongs to this user
    const checkResult = await db.query(
      'SELECT * FROM notifications WHERE id = $1 AND user_id = $2',
      [id, userId]
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
    const userId = await resolveNumericUserId(req.auth.idNumber);

    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
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
    if (req.auth.role !== 'lecturer' && req.auth.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only lecturers can view stats.' });
    }

    const lecturerId = await resolveNumericUserId(req.auth.idNumber);

    // Get total lectures assigned
    const lecturesResult = await db.query(
      'SELECT COUNT(*) as total FROM timeslots WHERE lecturer_id = $1',
      [lecturerId]
    );

    // Get total bookings across all lectures
    const bookingsResult = await db.query(`
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN timeslots t ON b.timeslot_id = t.id
      WHERE t.lecturer_id = $1
    `, [lecturerId]);

    // Calculate total hours per week
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
    if (req.auth.role !== 'lecturer' && req.auth.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only lecturers can download attendance.' });
    }

    const { timeslotId } = req.params;
    const lecturerId = await resolveNumericUserId(req.auth.idNumber);

    // Verify this timeslot belongs to the lecturer
    const timeslotCheck = await db.query(
      'SELECT * FROM timeslots WHERE id = $1 AND lecturer_id = $2',
      [timeslotId, lecturerId]
    );

    if (timeslotCheck.rows.length === 0 && req.auth.role !== 'admin') {
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
      SELECT b.seat_number, b.attendance_status, u.full_name as student_name, u.email
      FROM bookings b
      JOIN users u ON b.student_id = u.id
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

// ─── Admin routes ──────────────────────────────────────────────────────────

// GET /api/timetable/admin/users
router.get('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, id_number, full_name, email, role FROM users ORDER BY role, full_name'
    );
    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/timetable/admin/lecturers
router.get('/admin/lecturers', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, id_number, full_name, email FROM users WHERE role = $1 ORDER BY full_name',
      ['lecturer']
    );
    res.json({ success: true, lecturers: result.rows });
  } catch (error) {
    console.error('Get lecturers error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// POST /api/timetable/admin/timeslots
router.post('/admin/timeslots', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { subject_id, lecturer_id, location_id, day_of_week, start_time, end_time } = req.body;

    if (!subject_id || !lecturer_id || !location_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    // Check for conflicts
    const existingSlots = await db.query(
      'SELECT * FROM timeslots WHERE location_id = $1 AND day_of_week = $2',
      [location_id, day_of_week]
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
    `, [subject_id, lecturer_id, location_id, day_of_week, start_time, end_time]);

    const fullResult = await db.query(`
      SELECT t.*,
             s.subject_name, s.subject_code,
             l.room_name, l.seat_count,
             u.full_name as lecturer_name,
             u.id_number as lecturer_id_number
      FROM timeslots t
      JOIN subjects s ON t.subject_id = s.id
      JOIN locations l ON t.location_id = l.id
      JOIN users u ON t.lecturer_id = u.id
      WHERE t.id = $1
    `, [result.rows[0].id]);

    res.status(201).json({ success: true, message: 'Timeslot created successfully.', timeslot: fullResult.rows[0] });
  } catch (error) {
    console.error('Create timeslot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// PUT /api/timetable/admin/timeslots/:id
router.put('/admin/timeslots/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, lecturer_id, location_id, day_of_week, start_time, end_time } = req.body;

    const checkResult = await db.query('SELECT * FROM timeslots WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Timeslot not found.' });
    }

    await db.query(`
      UPDATE timeslots
      SET subject_id = $1, lecturer_id = $2, location_id = $3, day_of_week = $4, start_time = $5, end_time = $6
      WHERE id = $7
      RETURNING *
    `, [subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, id]);

    const fullResult = await db.query(`
      SELECT t.*,
             s.subject_name, s.subject_code,
             l.room_name, l.seat_count,
             u.full_name as lecturer_name,
             u.id_number as lecturer_id_number
      FROM timeslots t
      JOIN subjects s ON t.subject_id = s.id
      JOIN locations l ON t.location_id = l.id
      JOIN users u ON t.lecturer_id = u.id
      WHERE t.id = $1
    `, [id]);

    res.json({ success: true, message: 'Timeslot updated successfully.', timeslot: fullResult.rows[0] });
  } catch (error) {
    console.error('Update timeslot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// DELETE /api/timetable/admin/timeslots/:id
router.delete('/admin/timeslots/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

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

// POST /api/timetable/admin/subjects
router.post('/admin/subjects', requireAuth, requireRole('admin'), async (req, res) => {
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

// POST /api/timetable/admin/locations
router.post('/admin/locations', requireAuth, requireRole('admin'), async (req, res) => {
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
