// Mock Database Pool
// Implements the same interface as pg.Pool for in-memory database operations

const { initializeData, getDataStats } = require('./data');
const { executeQuery } = require('./queries');
const EventEmitter = require('events');

class MockPool extends EventEmitter {
    constructor() {
        super();
        this.isConnected = false;
        this.dataStats = null;
    }

    // Initialize the mock database with dummy data
    async init() {
        this.dataStats = await initializeData();
        this.isConnected = true;
        return this;
    }

    // Main query method - mimics pg.Pool.query()
    async query(text, params = []) {
        if (!this.isConnected) {
            await this.init();
        }

        try {
            const result = await executeQuery(text, params);
            return {
                rows: result.rows,
                rowCount: result.rowCount,
                fields: [] // Mock fields array
            };
        } catch (error) {
            // Emit error event for listeners
            this.emit('error', error);
            throw error;
        }
    }

    // Connect method - returns a mock client for transactions
    async connect() {
        if (!this.isConnected) {
            await this.init();
        }
        return new MockClient(this);
    }

    // End method - cleanup (no-op for mock)
    async end() {
        this.isConnected = false;
        return Promise.resolve();
    }

    // Get data statistics
    getStats() {
        return this.dataStats;
    }
}

// Mock Client for transactions
class MockClient {
    constructor(pool) {
        this.pool = pool;
        this.inTransaction = false;
    }

    async query(text, params = []) {
        return this.pool.query(text, params);
    }

    async begin() {
        this.inTransaction = true;
        return { rows: [], rowCount: 0 };
    }

    async commit() {
        this.inTransaction = false;
        return { rows: [], rowCount: 0 };
    }

    async rollback() {
        this.inTransaction = false;
        return { rows: [], rowCount: 0 };
    }

    release() {
        // Release client back to pool (no-op for mock)
    }
}

// Export singleton instance
let mockPoolInstance = null;

async function getMockPool() {
    if (!mockPoolInstance) {
        mockPoolInstance = new MockPool();
        await mockPoolInstance.init();
    }
    return mockPoolInstance;
}

module.exports = {
    MockPool,
    MockClient,
    getMockPool
};
