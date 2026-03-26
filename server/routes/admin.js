// Admin routes
// This file handles admin-only endpoints for timetable management

const express = require('express');
const router = express.Router();
const db = require('../db/index');
const authMiddleware = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(checkRole(['admin']));

// GET /api/admin/users
// Get all users (for admin to assign lecturers)
router.get('/users', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, full_name, email, role FROM users ORDER BY role, full_name'
        );
        res.json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error('Get users error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET /api/admin/lecturers
// Get all lecturers
router.get('/lecturers', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, full_name, email FROM users WHERE role = $1 ORDER BY full_name',
            ['lecturer']
        );
        res.json({
            success: true,
            lecturers: result.rows
        });
    } catch (error) {
        console.error('Get lecturers error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// POST /api/admin/timeslots
// Create a new timeslot
router.post('/timeslots', async (req, res) => {
    try {
        const { subject_id, lecturer_id, location_id, day_of_week, start_time, end_time } = req.body;
        
        // Validate input
        if (!subject_id || !lecturer_id || !location_id || !day_of_week || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields.'
            });
        }
        
        // Check for conflicts - get all timeslots for this location and day
        const existingSlots = await db.query(`
            SELECT * FROM timeslots 
            WHERE location_id = $1 
            AND day_of_week = $2
        `, [location_id, day_of_week]);
        
        // Check time overlap in JavaScript
        const hasConflict = existingSlots.rows.some(slot => {
            const existingStart = slot.start_time;
            const existingEnd = slot.end_time;
            // Check if times overlap
            return (start_time < existingEnd && end_time > existingStart);
        });
        
        if (hasConflict) {
            return res.status(400).json({
                success: false,
                message: 'Room is already booked at this time.'
            });
        }
        
        // Create timeslot
        const result = await db.query(`
            INSERT INTO timeslots (subject_id, lecturer_id, location_id, day_of_week, start_time, end_time)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [subject_id, lecturer_id, location_id, day_of_week, start_time, end_time]);
        
        // Get the full timeslot with joins
        const fullResult = await db.query(`
            SELECT t.*, 
                   s.subject_name, s.subject_code,
                   l.room_name, l.seat_count,
                   u.full_name as lecturer_name
            FROM timeslots t
            JOIN subjects s ON t.subject_id = s.id
            JOIN locations l ON t.location_id = l.id
            JOIN users u ON t.lecturer_id = u.id
            WHERE t.id = $1
        `, [result.rows[0].id]);
        
        res.status(201).json({
            success: true,
            message: 'Timeslot created successfully.',
            timeslot: fullResult.rows[0]
        });
    } catch (error) {
        console.error('Create timeslot error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// PUT /api/admin/timeslots/:id
// Update a timeslot
router.put('/timeslots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { subject_id, lecturer_id, location_id, day_of_week, start_time, end_time } = req.body;
        
        // Check if timeslot exists
        const checkResult = await db.query('SELECT * FROM timeslots WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Timeslot not found.'
            });
        }
        
        // Update timeslot
        const result = await db.query(`
            UPDATE timeslots 
            SET subject_id = $1, lecturer_id = $2, location_id = $3, day_of_week = $4, start_time = $5, end_time = $6
            WHERE id = $7
            RETURNING *
        `, [subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, id]);
        
        // Get the full timeslot with joins
        const fullResult = await db.query(`
            SELECT t.*, 
                   s.subject_name, s.subject_code,
                   l.room_name, l.seat_count,
                   u.full_name as lecturer_name
            FROM timeslots t
            JOIN subjects s ON t.subject_id = s.id
            JOIN locations l ON t.location_id = l.id
            JOIN users u ON t.lecturer_id = u.id
            WHERE t.id = $1
        `, [id]);
        
        res.json({
            success: true,
            message: 'Timeslot updated successfully.',
            timeslot: fullResult.rows[0]
        });
    } catch (error) {
        console.error('Update timeslot error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// DELETE /api/admin/timeslots/:id
// Delete a timeslot
router.delete('/timeslots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if timeslot has bookings
        const bookingsCheck = await db.query('SELECT * FROM bookings WHERE timeslot_id = $1', [id]);
        if (bookingsCheck.rows.length > 0) {
            // Delete bookings first
            await db.query('DELETE FROM bookings WHERE timeslot_id = $1', [id]);
        }
        
        // Delete timeslot
        const result = await db.query('DELETE FROM timeslots WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Timeslot not found.'
            });
        }
        
        res.json({
            success: true,
            message: 'Timeslot deleted successfully.'
        });
    } catch (error) {
        console.error('Delete timeslot error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// POST /api/admin/subjects
// Create a new subject
router.post('/subjects', async (req, res) => {
    try {
        const { subject_name, subject_code } = req.body;
        
        if (!subject_name || !subject_code) {
            return res.status(400).json({
                success: false,
                message: 'Please provide subject name and code.'
            });
        }
        
        const result = await db.query(
            'INSERT INTO subjects (subject_name, subject_code) VALUES ($1, $2) RETURNING *',
            [subject_name, subject_code]
        );
        
        res.status(201).json({
            success: true,
            message: 'Subject created successfully.',
            subject: result.rows[0]
        });
    } catch (error) {
        console.error('Create subject error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// POST /api/admin/locations
// Create a new location
router.post('/locations', async (req, res) => {
    try {
        const { room_name, seat_count } = req.body;
        
        if (!room_name || !seat_count) {
            return res.status(400).json({
                success: false,
                message: 'Please provide room name and seat count.'
            });
        }
        
        const result = await db.query(
            'INSERT INTO locations (room_name, seat_count) VALUES ($1, $2) RETURNING *',
            [room_name, seat_count]
        );
        
        res.status(201).json({
            success: true,
            message: 'Location created successfully.',
            location: result.rows[0]
        });
    } catch (error) {
        console.error('Create location error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Export the router
module.exports = router;
