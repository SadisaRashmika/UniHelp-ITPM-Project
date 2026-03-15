// RBAC (Role-Based Access Control) middleware
// This file checks if a user has the required role to access a route

// Function to create a middleware that checks for specific roles
// Usage: router.get('/admin-only', authMiddleware, checkRole(['admin']), handler)
function checkRole(allowedRoles) {
    // Return a middleware function
    return (req, res, next) => {
        // Check if user exists on request (set by authMiddleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated. Please log in.'
            });
        }
        
        // Get the user's role
        const userRole = req.user.role;
        
        // Check if the user's role is in the allowed roles list
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You do not have permission to perform this action.'
            });
        }
        
        // User has the required role, continue to the next middleware
        next();
    };
}

// Pre-defined middleware for common role checks
const requireAdmin = checkRole(['admin']);
const requireLecturer = checkRole(['lecturer', 'admin']); // Admin can also access lecturer routes
const requireStudent = checkRole(['student', 'lecturer', 'admin']); // All roles can access student routes

// Export the middleware functions
module.exports = {
    checkRole,
    requireAdmin,
    requireLecturer,
    requireStudent
};
