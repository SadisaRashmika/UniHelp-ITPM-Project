// Mock database query parser
// Parses SQL queries and executes them against in-memory data

const { data, idCounters, insertUser, insertSubject, insertLocation, insertTimeslot, insertBooking, insertNotification } = require('./data');

// Simple SQL parser
function parseQuery(sql) {
    // Normalize SQL - convert to uppercase for keywords but preserve original case for identifiers
    const normalizedSql = sql.trim();
    
    // Detect query type
    const queryType = normalizedSql.split(/\s+/)[0].toUpperCase();
    
    return {
        type: queryType,
        sql: normalizedSql
    };
}

// Execute SELECT query
function executeSelect(sql, params) {
    const parsed = parseQuery(sql);
    
    // Extract table name from FROM clause
    const fromMatch = sql.match(/FROM\s+(\w+)/i);
    if (!fromMatch) {
        throw new Error('Invalid SELECT: no table specified');
    }
    const tableName = fromMatch[1].toLowerCase();
    
    // Check if table exists
    if (!data[tableName]) {
        throw new Error(`Table "${tableName}" does not exist`);
    }
    
    // Get all rows from table
    let rows = [...data[tableName]];
    
    // Handle WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|\s*$)/i);
    if (whereMatch) {
        rows = applyWhereClause(rows, whereMatch[1], params, tableName);
    }
    
    // Handle ORDER BY
    const orderMatch = sql.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
        const field = orderMatch[1];
        const direction = (orderMatch[2] || 'ASC').toUpperCase();
        rows.sort((a, b) => {
            if (a[field] < b[field]) return direction === 'ASC' ? -1 : 1;
            if (a[field] > b[field]) return direction === 'ASC' ? 1 : -1;
            return 0;
        });
    }
    
    // Handle LIMIT
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
        rows = rows.slice(0, parseInt(limitMatch[1]));
    }
    
    // Handle SELECT * vs specific columns
    const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
    if (selectMatch && selectMatch[1].trim() !== '*') {
        const columns = selectMatch[1].split(',').map(c => c.trim());
        rows = rows.map(row => {
            const newRow = {};
            columns.forEach(col => {
                // Handle column aliases (e.g., "id AS user_id")
                const aliasMatch = col.match(/(\w+)(?:\s+AS\s+(\w+))?/i);
                if (aliasMatch) {
                    const sourceCol = aliasMatch[1];
                    const targetCol = aliasMatch[2] || sourceCol;
                    newRow[targetCol] = row[sourceCol];
                }
            });
            return newRow;
        });
    }
    
    return { rows, rowCount: rows.length };
}

// Apply WHERE clause conditions
function applyWhereClause(rows, whereClause, params, tableName) {
    // Simple parameterized WHERE clause parser
    // Supports: column = $1, column IN ($1, $2), etc.
    
    let filteredRows = rows;
    
    // Handle AND conditions
    const conditions = whereClause.split(/\s+AND\s+/i);
    
    conditions.forEach(condition => {
        // Handle column = $N
        const eqMatch = condition.match(/(\w+)\s*=\s*\$(\d+)/i);
        if (eqMatch) {
            const column = eqMatch[1];
            const paramIndex = parseInt(eqMatch[2]) - 1;
            const value = params[paramIndex];
            filteredRows = filteredRows.filter(row => row[column] === value);
        }
        
        // Handle column IN ($1, $2, ...)
        const inMatch = condition.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);
        if (inMatch) {
            const column = inMatch[1];
            const paramRefs = inMatch[2].match(/\$(\d+)/g);
            const values = paramRefs.map(ref => {
                const paramIndex = parseInt(ref.substring(1)) - 1;
                return params[paramIndex];
            });
            filteredRows = filteredRows.filter(row => values.includes(row[column]));
        }
        
        // Handle column > $N, column < $N, etc.
        const compMatch = condition.match(/(\w+)\s*(>|<|>=|<=)\s*\$(\d+)/i);
        if (compMatch) {
            const column = compMatch[1];
            const operator = compMatch[2];
            const paramIndex = parseInt(compMatch[3]) - 1;
            const value = params[paramIndex];
            
            filteredRows = filteredRows.filter(row => {
                const rowValue = row[column];
                switch (operator) {
                    case '>': return rowValue > value;
                    case '<': return rowValue < value;
                    case '>=': return rowValue >= value;
                    case '<=': return rowValue <= value;
                    default: return true;
                }
            });
        }
        
        // Handle column LIKE $N
        const likeMatch = condition.match(/(\w+)\s+LIKE\s*\$(\d+)/i);
        if (likeMatch) {
            const column = likeMatch[1];
            const paramIndex = parseInt(likeMatch[2]) - 1;
            const pattern = params[paramIndex];
            // Convert SQL LIKE pattern to regex
            const regex = new RegExp('^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
            filteredRows = filteredRows.filter(row => regex.test(row[column]));
        }
    });
    
    return filteredRows;
}

// Execute INSERT query
function executeInsert(sql, params) {
    // Extract table name
    const intoMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
    if (!intoMatch) {
        throw new Error('Invalid INSERT: no table specified');
    }
    const tableName = intoMatch[1].toLowerCase();
    
    // Extract columns
    const columnsMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
    if (!columnsMatch) {
        throw new Error('Invalid INSERT: no columns specified');
    }
    const columns = columnsMatch[1].split(',').map(c => c.trim());
    
    // Check for RETURNING clause
    const returningMatch = sql.match(/RETURNING\s+(.+)/i);
    
    // Insert based on table
    let newId;
    switch (tableName) {
        case 'users':
            newId = insertUser(...params);
            break;
        case 'subjects':
            newId = insertSubject(...params);
            break;
        case 'locations':
            newId = insertLocation(...params);
            break;
        case 'timeslots':
            newId = insertTimeslot(...params);
            break;
        case 'bookings':
            newId = insertBooking(...params);
            break;
        case 'notifications':
            newId = insertNotification(...params);
            break;
        default:
            throw new Error(`Unknown table: ${tableName}`);
    }
    
    // Get the newly inserted row
    const newRow = data[tableName].find(row => row.id === newId);
    
    if (returningMatch) {
        return { rows: [newRow], rowCount: 1 };
    }
    
    return { rows: [], rowCount: 1 };
}

// Execute UPDATE query
function executeUpdate(sql, params) {
    // Extract table name
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (!tableMatch) {
        throw new Error('Invalid UPDATE: no table specified');
    }
    const tableName = tableMatch[1].toLowerCase();
    
    if (!data[tableName]) {
        throw new Error(`Table "${tableName}" does not exist`);
    }
    
    // Extract SET clause
    const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
    if (!setMatch) {
        throw new Error('Invalid UPDATE: no SET clause');
    }
    
    // Parse SET column = value pairs
    const setClause = setMatch[1];
    const setPairs = [];
    const setRegex = /(\w+)\s*=\s*\$(\d+)/g;
    let match;
    while ((match = setRegex.exec(setClause)) !== null) {
        setPairs.push({
            column: match[1],
            paramIndex: parseInt(match[2]) - 1
        });
    }
    
    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+RETURNING|\s*$)/i);
    if (!whereMatch) {
        throw new Error('Invalid UPDATE: no WHERE clause');
    }
    
    // Find rows to update
    let rowsToUpdate = applyWhereClause([...data[tableName]], whereMatch[1], params, tableName);
    
    // Check for RETURNING clause
    const returningMatch = sql.match(/RETURNING\s+(.+)/i);
    
    // Update rows
    rowsToUpdate.forEach(row => {
        setPairs.forEach(pair => {
            row[pair.column] = params[pair.paramIndex];
        });
    });
    
    if (returningMatch) {
        return { rows: rowsToUpdate, rowCount: rowsToUpdate.length };
    }
    
    return { rows: [], rowCount: rowsToUpdate.length };
}

// Execute DELETE query
function executeDelete(sql, params) {
    // Extract table name
    const fromMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
    if (!fromMatch) {
        throw new Error('Invalid DELETE: no table specified');
    }
    const tableName = fromMatch[1].toLowerCase();
    
    if (!data[tableName]) {
        throw new Error(`Table "${tableName}" does not exist`);
    }
    
    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+)/i);
    if (!whereMatch) {
        throw new Error('DELETE without WHERE is not allowed');
    }
    
    // Find rows to delete
    const rowsToDelete = applyWhereClause([...data[tableName]], whereMatch[1], params, tableName);
    const idsToDelete = rowsToDelete.map(row => row.id);
    
    // Remove rows
    data[tableName] = data[tableName].filter(row => !idsToDelete.includes(row.id));
    
    return { rows: [], rowCount: rowsToDelete.length };
}

// Main query executor
async function executeQuery(text, params = []) {
    const parsed = parseQuery(text);
    
    try {
        switch (parsed.type) {
            case 'SELECT':
                return executeSelect(text, params);
            case 'INSERT':
                return executeInsert(text, params);
            case 'UPDATE':
                return executeUpdate(text, params);
            case 'DELETE':
                return executeDelete(text, params);
            default:
                throw new Error(`Unsupported query type: ${parsed.type}`);
        }
    } catch (error) {
        throw new Error(`Query error: ${error.message}`);
    }
}

module.exports = {
    executeQuery,
    parseQuery,
    executeSelect,
    executeInsert,
    executeUpdate,
    executeDelete
};
