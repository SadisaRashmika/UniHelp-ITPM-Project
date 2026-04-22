const db = require('../../../config/db');
const path = require('path');
const fs = require('fs');

/**
 * Get all internship applications
 */
const getInternshipApplications = async (req, res) => {
    try {
        const query = 'SELECT * FROM internship_applications ORDER BY created_at DESC';
        const { rows } = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching internship applications:', error);
        res.status(500).json({ success: false, message: 'Error fetching applications' });
    }
};

/**
 * Submit new internship application
 */
const submitInternshipApplication = async (req, res) => {
    try {
        const {
            fullName, email, phone, university, major,
            graduationYear, gpa, internshipType, company,
            position, startDate, endDate, coverLetter, skills,
            studentId // In production, get from auth middleware
        } = req.body;

        const resumePath = req.file ? req.file.path : null;

        const query = `
            INSERT INTO internship_applications (
                student_id, full_name, email, phone, university, major, 
                graduation_year, gpa, internship_type, company, position, 
                start_date, end_date, cover_letter, skills, resume_path
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `;

        const values = [
            studentId || 'STU001',
            fullName, email, phone, university, major,
            graduationYear, gpa, internshipType, company,
            position, startDate, endDate, coverLetter, skills,
            resumePath
        ];

        const { rows } = await db.query(query, values);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error submitting internship application:', error);
        res.status(500).json({ success: false, message: 'Error submitting application' });
    }
};

/**
 * Get applications for a specific student
 */
const getStudentInternshipApplications = async (req, res) => {
    try {
        const { studentId } = req.params;
        const query = 'SELECT * FROM internship_applications WHERE student_id = $1 ORDER BY created_at DESC';
        const { rows } = await db.query(query, [studentId]);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching student applications:', error);
        res.status(500).json({ success: false, message: 'Error fetching applications' });
    }
};

/**
 * Update application status
 */
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const query = 'UPDATE internship_applications SET status = $1 WHERE id = $2 RETURNING *';
        const { rows } = await db.query(query, [status, id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        res.json({ success: true, message: 'Status updated', data: rows[0] });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
};

module.exports = {
    getInternshipApplications,
    submitInternshipApplication,
    getStudentInternshipApplications,
    updateApplicationStatus
};
