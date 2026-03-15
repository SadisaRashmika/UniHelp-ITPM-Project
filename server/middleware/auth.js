// Authentication middleware
// This file checks if a user is logged in by verifying their JWT token

const { verifyToken } = require('../utils/jwt');

// Middleware function to check authentication
// This runs before protected routes
function authMiddleware(req, res, next) {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    // Check if the header exists
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Please log in.'
        });
    }
    
    // Check if the header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token format. Use Bearer <token>.'
        });
    }
    
    // Extract the token from the header
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = verifyToken(token);
    
    // Check if the token is valid
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please log in again.'
        });
    }
    
    // Attach the user data to the request object
    // Now other routes can access req.user
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
}

// Export the middleware
module.exports = authMiddleware;
