const app = require("./app");
const db = require("./db/index");
const PORT = process.env.PORT || 5000;

// Initialize database connection before starting server
async function startServer() {
    try {
        // Initialize database (will fallback to mock if PostgreSQL unavailable)
        await db.initializeDatabase();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
