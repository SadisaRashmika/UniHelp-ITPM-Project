// JWT utility functions
// This file handles creating and verifying JWT tokens

const jwt = require('jsonwebtoken');

// Get the secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Create a JWT token for a user
// The token contains the user's id, email, and role
function createToken(user) {
    // Create the payload (data inside the token)
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
    };
    
    // Sign the token with the secret key
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
    
    return token;
}

// Verify a JWT token
// Returns the decoded data if valid, or null if invalid
function verifyToken(token) {
    try {
        // Verify the token and get the data
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        // Token is invalid or expired
        return null;
    }
}

// Export the functions so other files can use them
module.exports = {
    createToken,
    verifyToken
};
