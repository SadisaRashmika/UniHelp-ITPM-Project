// Timetable routes
// This file handles timetable related endpoints

const express = require('express');
const router = express.Router();
const db = require('../db/index');
const authMiddleware = require('../middleware/auth');

// GET /api/timetable/subjects
// Get all subjects
router.get('/subjects', authMiddleware, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM subjects ORDER BY subject_code');
        res.json({
            success: true,
            subjects: result.rows
        });
    } catch (error) {
        console.error('Get subjects error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET /api/timetable/locations
// Get all locations
router.get('/locations', authMiddleware, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM locations ORDER BY room_name');
        res.json({
            success: true,
            locations: result.rows
        });
    } catch (error) {
        console.error('Get locations error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET /api/timetable/timeslots
// Get timeslots by day (optional query param)
router.get('/timeslots', authMiddleware, async (req, res) => {
    try {
        const { day } = req.query;
        let query = `
            SELECT t.*, 
                   s.subject_name, s.subject_code,
                   l.room_name, l.seat_count,
                   u.full_name as lecturer_name
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
        res.json({
            success: true,
            timeslots: result.rows
        });
    } catch (error) {
        console.error('Get timeslots error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET /api/timetable/timeslots/:id
// Get single timeslot by ID
router.get('/timeslots/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
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
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Timeslot not found.'
            });
        }
        
        res.json({
            success: true,
            timeslot: result.rows[0]
        });
    } catch (error) {
        console.error('Get timeslot error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// PUT /api/timetable/timeslots/:id/details
// Update lecture topic and notice (lecturer only)
router.put('/timeslots/:id/details', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { lecture_topic, notice } = req.body;
        const lecturerId = req.user.userId;
        
        // Verify this timeslot belongs to the lecturer
        const checkResult = await db.query(
            'SELECT * FROM timeslots WHERE id = $1 AND lecturer_id = $2',
            [id, lecturerId]
        );
        
        if (checkResult.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own lectures.'
            });
        }
        
        const result = await db.query(
            'UPDATE timeslots SET lecture_topic = $1, notice = $2 WHERE id = $3 RETURNING *',
            [lecture_topic, notice, id]
        );
        
        res.json({
            success: true,
            message: 'Lecture details updated successfully.',
            timeslot: result.rows[0]
        });
    } catch (error) {
        console.error('Update timeslot error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Export the router
module.exports = router;
