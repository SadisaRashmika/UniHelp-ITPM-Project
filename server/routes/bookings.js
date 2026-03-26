// Booking routes
// This file handles booking related endpoints

const express = require('express');
const router = express.Router();
const db = require('../db/index');
const authMiddleware = require('../middleware/auth');

// GET /api/bookings/my
// Get all bookings for the logged-in student
router.get('/my', authMiddleware, async (req, res) => {
    try {
        // Only students can view their bookings
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can view their bookings.'
            });
        }
        
        const studentId = req.user.userId;
        
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
        
        res.json({
            success: true,
            bookings: result.rows
        });
    } catch (error) {
        console.error('Get bookings error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// POST /api/bookings
// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Only students can create bookings
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can create bookings.'
            });
        }
        
        const studentId = req.user.userId;
        const { timeslot_id, seat_number } = req.body;
        
        // Validate input
        if (!timeslot_id || !seat_number) {
            return res.status(400).json({
                success: false,
                message: 'Please provide timeslot_id and seat_number.'
            });
        }
        
        // Check if timeslot exists
        const timeslotResult = await db.query(
            'SELECT t.*, l.seat_count FROM timeslots t JOIN locations l ON t.location_id = l.id WHERE t.id = $1',
            [timeslot_id]
        );
        
        if (timeslotResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Timeslot not found.'
            });
        }
        
        const timeslot = timeslotResult.rows[0];
        
        // Check if seat number is valid
        if (seat_number < 1 || seat_number > timeslot.seat_count) {
            return res.status(400).json({
                success: false,
                message: `Seat number must be between 1 and ${timeslot.seat_count}.`
            });
        }
        
        // Check if student already booked this timeslot
        const existingBooking = await db.query(
            'SELECT * FROM bookings WHERE student_id = $1 AND timeslot_id = $2',
            [studentId, timeslot_id]
        );
        
        if (existingBooking.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already booked this lecture.'
            });
        }
        
        // Check if seat is already taken
        const seatTaken = await db.query(
            'SELECT * FROM bookings WHERE timeslot_id = $1 AND seat_number = $2',
            [timeslot_id, seat_number]
        );
        
        if (seatTaken.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'This seat is already taken.'
            });
        }
        
        // Create the booking
        const result = await db.query(
            'INSERT INTO bookings (student_id, timeslot_id, seat_number) VALUES ($1, $2, $3) RETURNING *',
            [studentId, timeslot_id, seat_number]
        );
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully.',
            booking: result.rows[0]
        });
    } catch (error) {
        console.error('Create booking error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// DELETE /api/bookings/:id
// Cancel a booking
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Only students can cancel their bookings
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can cancel bookings.'
            });
        }
        
        const studentId = req.user.userId;
        const bookingId = req.params.id;
        
        // Check if booking exists and belongs to the student
        const bookingResult = await db.query(
            'SELECT * FROM bookings WHERE id = $1 AND student_id = $2',
            [bookingId, studentId]
        );
        
        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or you do not have permission to cancel it.'
            });
        }
        
        // Delete the booking
        await db.query('DELETE FROM bookings WHERE id = $1', [bookingId]);
        
        res.json({
            success: true,
            message: 'Booking cancelled successfully.'
        });
    } catch (error) {
        console.error('Cancel booking error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET /api/bookings/timeslot/:timeslotId
// Get all bookings for a specific timeslot (for seat map)
router.get('/timeslot/:timeslotId', authMiddleware, async (req, res) => {
    try {
        const { timeslotId } = req.params;
        
        const result = await db.query(`
            SELECT b.*, u.full_name as student_name
            FROM bookings b
            JOIN users u ON b.student_id = u.id
            WHERE b.timeslot_id = $1
            ORDER BY b.seat_number
        `, [timeslotId]);
        
        res.json({
            success: true,
            bookings: result.rows
        });
    } catch (error) {
        console.error('Get timeslot bookings error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// PUT /api/bookings/:id/attendance
// Mark attendance for a booking (lecturer only)
router.put('/:id/attendance', authMiddleware, async (req, res) => {
    try {
        // Only lecturers can mark attendance
        if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only lecturers can mark attendance.'
            });
        }
        
        const bookingId = req.params.id;
        const { status } = req.body;
        const lecturerId = req.user.userId;
        
        // Validate status
        if (!['attended', 'absent', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be attended, absent, or pending.'
            });
        }
        
        // Verify this booking belongs to a timeslot taught by this lecturer
        const bookingResult = await db.query(`
            SELECT b.*, t.lecturer_id 
            FROM bookings b 
            JOIN timeslots t ON b.timeslot_id = t.id 
            WHERE b.id = $1
        `, [bookingId]);
        
        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.'
            });
        }
        
        const booking = bookingResult.rows[0];
        
        // Check if lecturer owns this timeslot (or is admin)
        if (req.user.role !== 'admin' && booking.lecturer_id !== lecturerId) {
            return res.status(403).json({
                success: false,
                message: 'You can only mark attendance for your own lectures.'
            });
        }
        
        // Update attendance status
        const result = await db.query(
            'UPDATE bookings SET attendance_status = $1 WHERE id = $2 RETURNING *',
            [status, bookingId]
        );
        
        res.json({
            success: true,
            message: 'Attendance updated successfully.',
            booking: result.rows[0]
        });
    } catch (error) {
        console.error('Mark attendance error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Export the router
module.exports = router;
