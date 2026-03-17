// Authentication routes
// This file handles login and user authentication endpoints

const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { comparePassword } = require('../utils/password');
const { createToken } = require('../utils/jwt');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login
// Login endpoint - authenticates user and returns JWT token
router.post('/login', async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password.'
            });
        }
        
        // Find the user in the database
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }
        
        // Get the user data
        const user = result.rows[0];
        
        // Compare the provided password with the stored hash
        const isMatch = await comparePassword(password, user.password_hash);
        
        // Check if password matches
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }
        
        // Create a JWT token for the user
        const token = createToken(user);
        
        // Return success with token and user info
        res.json({
            success: true,
            message: 'Login successful.',
            token: token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET /api/auth/me
// Get current user endpoint - returns the logged-in user's info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Get the user ID from the token (set by authMiddleware)
        const userId = req.user.userId;
        
        // Find the user in the database
        const result = await db.query(
            'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1',
            [userId]
        );
        
        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        
        // Return the user data
        res.json({
            success: true,
            user: result.rows[0]
        });
        
    } catch (error) {
        console.error('Get user error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Export the router
module.exports = router;
