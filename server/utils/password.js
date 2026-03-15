// Password utility functions
// This file handles hashing and comparing passwords

const bcrypt = require('bcrypt');

// Number of salt rounds for bcrypt
// Higher is more secure but slower
const SALT_ROUNDS = 10;

// Hash a plain text password
// This is used when creating a new user or updating password
async function hashPassword(plainPassword) {
    // Generate a hash from the plain password
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hash;
}

// Compare a plain password with a hashed password
// This is used when logging in
// Returns true if the password matches, false otherwise
async function comparePassword(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}

// Export the functions so other files can use them
module.exports = {
    hashPassword,
    comparePassword
};
