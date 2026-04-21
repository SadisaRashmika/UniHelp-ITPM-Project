// Mock database query parser
// Parses SQL queries and executes them against in-memory data

const { data, idCounters, insertUser, insertSubject, insertLocation, insertTimeslot, insertBooking, insertNotification } = require('./data');

// Simple SQL parser
function parseQuery(sql) {
    const normalizedSql = sql.trim();
    const queryType = normalizedSql.split(/\s+/)[0].toUpperCase();
    return {
        type: queryType,
        sql: normalizedSql
    };
}

// Execute SELECT query with JOIN support
function executeSelect(sql, params) {
    const parsed = parseQuery(sql);
    
    // Check for aggregate functions (COUNT, SUM, AVG, MIN, MAX)
    const aggregateMatch = sql.match(/SELECT\s+(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(?:\w+\.)?(\*|\w+)\s*\)\s*(?:as\s+(\w+))?\s+FROM/i);
    if (aggregateMatch) {
        return executeAggregate(sql, params, aggregateMatch);
    }
    
    // Check for JOIN
    const hasJoin = /JOIN/i.test(sql);
    
    if (hasJoin) {
        return executeSelectWithJoin(sql, params);
    }
    
    // Simple SELECT without JOIN
    const fromMatch = sql.match(/FROM\s+(\w+)/i);
    if (!fromMatch) {
        throw new Error('Invalid SELECT: no table specified');
    }
    const tableName = fromMatch[1].toLowerCase();
    
    if (!data[tableName]) {
        throw new Error(`Table "${tableName}" does not exist`);
    }
    
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
        rows = selectColumns(rows, selectMatch[1]);
    }
    
    return { rows, rowCount: rows.length };
}

// Execute aggregate queries (COUNT, SUM, AVG, MIN, MAX)
// Supports both simple aggregates and aggregates with JOINs
function executeAggregate(sql, params, aggregateMatch) {
    const funcName = aggregateMatch[1].toUpperCase();
    const columnName = aggregateMatch[2];
    const alias = aggregateMatch[3] || funcName.toLowerCase();
    
    const fromMatch = sql.match(/FROM\s+(\w+)\s+(\w+)?/i);
    if (!fromMatch) {
        throw new Error('Invalid aggregate SELECT: no table specified');
    }
    const tableName = fromMatch[1].toLowerCase();
    const mainAlias = fromMatch[2] ? fromMatch[2].toLowerCase() : tableName;
    
    if (!data[tableName]) {
        throw new Error(`Table "${tableName}" does not exist`);
    }
    
    // Start with main table rows
    let rows = data[tableName].map(row => ({ ...row }));
    
    // Handle JOINs if present
    const hasJoin = /JOIN/i.test(sql);
    if (hasJoin) {
        const joinRegex = /JOIN\s+(\w+)\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/gi;
        let joinMatch;
        
        while ((joinMatch = joinRegex.exec(sql)) !== null) {
            const joinTable = joinMatch[1].toLowerCase();
            const joinAlias = joinMatch[2].toLowerCase();
            const leftTable = joinMatch[3].toLowerCase();
            const leftCol = joinMatch[4];
            const rightTable = joinMatch[5].toLowerCase();
            const rightCol = joinMatch[6];
            
            if (!data[joinTable]) {
                throw new Error(`Table "${joinTable}" does not exist`);
            }
            
            rows = rows.map(row => {
                const leftValue = row[leftCol];
                const matchingRow = data[joinTable].find(jRow => {
                    const rightValue = jRow[rightCol];
                    return leftValue === rightValue;
                });
                
                if (matchingRow) {
                    Object.keys(matchingRow).forEach(key => {
                        row[`${joinAlias}_${key}`] = matchingRow[key];
                    });
                }
                
                return row;
            });
        }
    }
    
    // Handle WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+GROUP|\s+ORDER|\s+LIMIT|\s*$)/i);
    if (whereMatch) {
        rows = applyWhereClause(rows, whereMatch[1], params, tableName);
    }
    
    let resultValue;
    switch (funcName) {
        case 'COUNT':
            resultValue = rows.length;
            break;
        case 'SUM':
            resultValue = rows.reduce((sum, row) => sum + (parseFloat(row[columnName]) || 0), 0);
            break;
        case 'AVG':
            resultValue = rows.length > 0 ? rows.reduce((sum, row) => sum + (parseFloat(row[columnName]) || 0), 0) / rows.length : 0;
            break;
        case 'MIN':
            resultValue = rows.length > 0 ? Math.min(...rows.map(row => row[columnName])) : null;
            break;
        case 'MAX':
            resultValue = rows.length > 0 ? Math.max(...rows.map(row => row[columnName])) : null;
            break;
        default:
            resultValue = rows.length;
    }
    
    return { rows: [{ [alias]: resultValue }], rowCount: 1 };
}

// Execute SELECT with JOIN
function executeSelectWithJoin(sql, params) {
    // Parse the main table
    const fromMatch = sql.match(/FROM\s+(\w+)\s+(\w+)?/i);
    if (!fromMatch) {
        throw new Error('Invalid SELECT: no table specified');
    }
    const mainTable = fromMatch[1].toLowerCase();
    const mainAlias = fromMatch[2] ? fromMatch[2].toLowerCase() : mainTable;
    
    if (!data[mainTable]) {
        throw new Error(`Table "${mainTable}" does not exist`);
    }
    
    // Start with main table rows
    let rows = data[mainTable].map(row => ({ ...row }));
    
    // Parse JOIN clauses
    const joinRegex = /JOIN\s+(\w+)\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/gi;
    let joinMatch;
    
    while ((joinMatch = joinRegex.exec(sql)) !== null) {
        const joinTable = joinMatch[1].toLowerCase();
        const joinAlias = joinMatch[2].toLowerCase();
        const leftTable = joinMatch[3].toLowerCase();
        const leftCol = joinMatch[4];
        const rightTable = joinMatch[5].toLowerCase();
        const rightCol = joinMatch[6];
        
        if (!data[joinTable]) {
            throw new Error(`Table "${joinTable}" does not exist`);
        }
        
        // Perform the join
        rows = rows.map(row => {
            // Determine which column to match
            const leftValue = row[leftCol];
            
            // Find matching row in join table
            const matchingRow = data[joinTable].find(jRow => {
                const rightValue = jRow[rightCol];
                return leftValue === rightValue;
            });
            
            if (matchingRow) {
                // Add joined columns with prefix
                Object.keys(matchingRow).forEach(key => {
                    row[`${joinAlias}_${key}`] = matchingRow[key];
                });
            }
            
            return row;
        });
    }
    
    // Handle WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|\s*$)/i);
    if (whereMatch) {
        rows = applyWhereClause(rows, whereMatch[1], params, mainTable);
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
    
    // Handle column selection with proper alias support
    const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
    if (selectMatch && selectMatch[1].trim() !== '*') {
        rows = selectColumnsWithAliases(rows, selectMatch[1], mainAlias);
    }
    
    return { rows, rowCount: rows.length };
}

// Select columns with proper alias handling
function selectColumnsWithAliases(rows, columnsStr, mainAlias) {
    const columns = columnsStr.split(',').map(c => c.trim());
    
    return rows.map(row => {
        const newRow = {};
        columns.forEach(col => {
            // Handle table.* (select all from that table)
            if (col.match(/^\w+\.\*$/)) {
                const tablePrefix = col.split('.')[0].toLowerCase();
                // Add all columns that start with this prefix
                Object.keys(row).forEach(key => {
                    if (key.startsWith(`${tablePrefix}_`)) {
                        const colName = key.substring(tablePrefix.length + 1);
                        newRow[colName] = row[key];
                    } else if (tablePrefix === mainAlias && !key.includes('_')) {
                        // Main table columns without prefix
                        newRow[key] = row[key];
                    }
                });
                return;
            }
            
            // Handle table.column format
            const parts = col.split('.');
            let sourceCol, targetCol;
            
            if (parts.length === 2) {
                const tablePrefix = parts[0].toLowerCase();
                const colPart = parts[1];
                
                // Handle alias (e.g., "u.full_name as lecturer_name")
                const aliasMatch = colPart.match(/(\w+)\s+(?:AS|as)\s+(\w+)/);
                if (aliasMatch) {
                    sourceCol = `${tablePrefix}_${aliasMatch[1]}`;
                    targetCol = aliasMatch[2];
                } else {
                    sourceCol = `${tablePrefix}_${colPart}`;
                    targetCol = colPart;
                }
            } else {
                // Simple column format
                const aliasMatch = col.match(/(\w+)(?:\s+(?:AS|as)\s+(\w+))?/i);
                if (aliasMatch) {
                    sourceCol = aliasMatch[1];
                    targetCol = aliasMatch[2] || sourceCol;
                } else {
                    sourceCol = col;
                    targetCol = col;
                }
            }
            
            newRow[targetCol] = row[sourceCol];
        });
        return newRow;
    });
}

// Select specific columns
function selectColumns(rows, columnsStr) {
    const columns = columnsStr.split(',').map(c => c.trim());
    
    return rows.map(row => {
        const newRow = {};
        columns.forEach(col => {
            // Handle table.column format
            const parts = col.split('.');
            let sourceCol, targetCol;
            
            if (parts.length === 2) {
                // t.column_name format
                const tablePrefix = parts[0];
                const colName = parts[1];
                sourceCol = `${tablePrefix}_${colName}`;
                
                // Handle alias (e.g., "t.column AS alias")
                const aliasMatch = colName.match(/(\w+)(?:\s+AS\s+(\w+))?/i);
                if (aliasMatch) {
                    sourceCol = `${tablePrefix}_${aliasMatch[1]}`;
                    targetCol = aliasMatch[2] || aliasMatch[1];
                } else {
                    targetCol = colName;
                }
            } else {
                // Simple column format
                const aliasMatch = col.match(/(\w+)(?:\s+AS\s+(\w+))?/i);
                if (aliasMatch) {
                    sourceCol = aliasMatch[1];
                    targetCol = aliasMatch[2] || sourceCol;
                } else {
                    sourceCol = col;
                    targetCol = col;
                }
            }
            
            newRow[targetCol] = row[sourceCol];
        });
        return newRow;
    });
}

// Apply WHERE clause conditions
function applyWhereClause(rows, whereClause, params, tableName) {
    let filteredRows = rows;
    
    // Handle AND conditions
    const conditions = whereClause.split(/\s+AND\s+/i);
    
    conditions.forEach(condition => {
        // Handle alias.column = $N (e.g., t.lecturer_id = $1)
        const aliasEqMatch = condition.match(/(\w+)\.(\w+)\s*=\s*\$(\d+)/i);
        if (aliasEqMatch) {
            const tableAlias = aliasEqMatch[1].toLowerCase();
            const column = aliasEqMatch[2];
            const paramIndex = parseInt(aliasEqMatch[3]) - 1;
            const value = params[paramIndex];
            const prefixedColumn = `${tableAlias}_${column}`;
            filteredRows = filteredRows.filter(row => {
                // Try both prefixed and non-prefixed column names
                const rowValue = row[prefixedColumn] !== undefined ? row[prefixedColumn] : row[column];
                // Handle type coercion for comparisons
                if (typeof rowValue === 'number' && typeof value === 'string') {
                    return rowValue === parseInt(value);
                }
                if (typeof rowValue === 'string' && typeof value === 'number') {
                    return rowValue === String(value);
                }
                return rowValue === value;
            });
        }
        // Handle column = $N (simple column, no alias)
        else if (!aliasEqMatch) {
        const eqMatch = condition.match(/(\w+)\s*=\s*\$(\d+)/i);
        if (eqMatch) {
            const column = eqMatch[1];
            const paramIndex = parseInt(eqMatch[2]) - 1;
            const value = params[paramIndex];
            filteredRows = filteredRows.filter(row => {
                const rowValue = row[column];
                // Handle type coercion for comparisons
                if (typeof rowValue === 'number' && typeof value === 'string') {
                    return rowValue === parseInt(value);
                }
                if (typeof rowValue === 'string' && typeof value === 'number') {
                    return rowValue === String(value);
                }
                return rowValue === value;
            });
        }
        }
        
        // Handle column = literal (true/false/null/number)
        const literalMatch = condition.match(/(\w+)\s*=\s*(true|false|null|\d+)(?:\s|$)/i);
        if (literalMatch && !eqMatch) {
            const column = literalMatch[1];
            const literalValue = literalMatch[2].toLowerCase();
            let value;
            if (literalValue === 'true') value = true;
            else if (literalValue === 'false') value = false;
            else if (literalValue === 'null') value = null;
            else value = parseInt(literalValue);
            
            filteredRows = filteredRows.filter(row => {
                return row[column] === value;
            });
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
            filteredRows = filteredRows.filter(row => {
                const rowValue = row[column];
                return values.some(v => {
                    if (typeof rowValue === 'number' && typeof v === 'string') {
                        return rowValue === parseInt(v);
                    }
                    if (typeof rowValue === 'string' && typeof v === 'number') {
                        return rowValue === String(v);
                    }
                    return rowValue === v;
                });
            });
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
                // Convert to numbers for comparison
                const numRowValue = typeof rowValue === 'number' ? rowValue : parseFloat(rowValue);
                const numValue = typeof value === 'number' ? value : parseFloat(value);
                
                switch (operator) {
                    case '>': return numRowValue > numValue;
                    case '<': return numRowValue < numValue;
                    case '>=': return numRowValue >= numValue;
                    case '<=': return numRowValue <= numValue;
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
            const regex = new RegExp('^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
            filteredRows = filteredRows.filter(row => regex.test(row[column]));
        }
    });
    
    return filteredRows;
}

// Execute INSERT query
function executeInsert(sql, params) {
    const intoMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
    if (!intoMatch) {
        throw new Error('Invalid INSERT: no table specified');
    }
    const tableName = intoMatch[1].toLowerCase();
    
    const columnsMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
    if (!columnsMatch) {
        throw new Error('Invalid INSERT: no columns specified');
    }
    const columns = columnsMatch[1].split(',').map(c => c.trim());
    
    const returningMatch = sql.match(/RETURNING\s+(.+)/i);
    
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
    
    const newRow = data[tableName].find(row => row.id === newId);
    
    if (returningMatch) {
        return { rows: [newRow], rowCount: 1 };
    }
    
    return { rows: [], rowCount: 1 };
}

// Execute UPDATE query
function executeUpdate(sql, params) {
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (!tableMatch) {
        throw new Error('Invalid UPDATE: no table specified');
    }
    const tableName = tableMatch[1].toLowerCase();
    
    if (!data[tableName]) {
        throw new Error(`Table "${tableName}" does not exist`);
    }
    
    const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
    if (!setMatch) {
        throw new Error('Invalid UPDATE: no SET clause');
    }
    
    const setClause = setMatch[1];
    const setPairs = [];
    const setRegex = /(\w+)\s*=\s*\$(\d+)/g;
    let match;
    while ((match = setRegex.exec(setClause)) !== null) {
        setPairs.push({
            column: match[1],
            paramIndex: parseInt(match[2]) - 1,
            literal: null
        });
    }
    
    // Also handle SET column = literal (true/false/null)
    const literalSetRegex = /(\w+)\s*=\s*(true|false|null)(?:\s|,|$)/gi;
    while ((match = literalSetRegex.exec(setClause)) !== null) {
        // Skip if this column was already captured as a parameterized value
        if (!setPairs.some(p => p.column === match[1])) {
            const literalVal = match[2].toLowerCase();
            let value;
            if (literalVal === 'true') value = true;
            else if (literalVal === 'false') value = false;
            else value = null;
            setPairs.push({
                column: match[1],
                paramIndex: -1,
                literal: value
            });
        }
    }
    
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+RETURNING|\s*$)/i);
    if (!whereMatch) {
        throw new Error('Invalid UPDATE: no WHERE clause');
    }
    
    let rowsToUpdate = applyWhereClause([...data[tableName]], whereMatch[1], params, tableName);
    
    const returningMatch = sql.match(/RETURNING\s+(.+)/i);
    
    rowsToUpdate.forEach(row => {
        setPairs.forEach(pair => {
            if (pair.literal !== null && pair.literal !== undefined) {
                row[pair.column] = pair.literal;
            } else {
                row[pair.column] = params[pair.paramIndex];
            }
        });
    });
    
    if (returningMatch) {
        return { rows: rowsToUpdate, rowCount: rowsToUpdate.length };
    }
    
    return { rows: [], rowCount: rowsToUpdate.length };
}

// Execute DELETE query
function executeDelete(sql, params) {
    const fromMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
    if (!fromMatch) {
        throw new Error('Invalid DELETE: no table specified');
    }
    const tableName = fromMatch[1].toLowerCase();
    
    if (!data[tableName]) {
        throw new Error(`Table "${tableName}" does not exist`);
    }
    
    // Check for RETURNING clause
    const returningMatch = sql.match(/RETURNING\s+(.+)/i);
    
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+RETURNING|\s*$)/i);
    if (!whereMatch) {
        throw new Error('DELETE without WHERE is not allowed');
    }
    
    const rowsToDelete = applyWhereClause([...data[tableName]], whereMatch[1], params, tableName);
    const idsToDelete = rowsToDelete.map(row => row.id);
    
    data[tableName] = data[tableName].filter(row => !idsToDelete.includes(row.id));
    
    // Return deleted rows if RETURNING clause is present
    if (returningMatch) {
        return { rows: rowsToDelete, rowCount: rowsToDelete.length };
    }
    
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
