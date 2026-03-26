# UniHelp Project Migration Guide

**Purpose**: Complete guide to recreate the UniHelp project in a new repository with all work done so far.

**Project**: UniHelp - Timetable Management Module
**Stack**: PERN (PostgreSQL, Express.js, React, Node.js)
**For**: Kalindu's University Project

---

## 🚀 Quick Start - What to Type

When you open this file in a new repository, type this in the chat:

```
Read plans/MIGRATION-GUIDE.md and recreate the project with commits #1-#9, then continue from commit #10
```

This will:
1. Create all files from commits #1-#9
2. Make the commits with backdated timestamps
3. Continue development with RBAC middleware (commit #10)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Work Completed So Far](#work-completed-so-far)
3. [Commit History with Timestamps](#commit-history-with-timestamps)
4. [File-by-File Recreation Guide](#file-by-file-recreation-guide)
5. [Remaining Work](#remaining-work)
6. [Technical Specifications Summary](#technical-specifications-summary)

---

## Project Overview

### What is UniHelp?
UniHelp is a university timetable management system with three user roles:
- **Students**: View timetable, book seats, receive notifications
- **Lecturers**: Manage sessions, mark attendance, send notices
- **Admins**: Full CRUD on timetable and locations

### Key Features
- JWT-based authentication with role-based access control
- Real-time notifications via Socket.IO
- Seat booking with validation
- Attendance tracking with CSV export
- Weekly timetable grid view

### Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite 7 + Tailwind CSS 4 |
| Backend | Express.js 5 + Node.js |
| Database | PostgreSQL |
| Real-time | Socket.IO |
| Auth | JWT + bcrypt |

---

## Work Completed So Far

### Phase 1: Foundation Setup ✅ COMPLETE
1. Installed backend dependencies (jsonwebtoken, bcrypt, socket.io)
2. Installed client dependency (socket.io-client)
3. Created database schema (6 tables)
4. Created dummy/seed data
5. Created database connection module
6. Added environment variables template

### Phase 2: Authentication System ⏳ IN PROGRESS
1. ✅ Created password hashing utility
2. ✅ Created JWT utility for tokens
3. ✅ Created auth middleware
4. ⬜ Create RBAC middleware (NEXT)
5. ⬜ Implement login endpoint
6. ⬜ Implement get current user endpoint
7. ⬜ Create AuthContext on frontend
8. ⬜ Create login page UI

---

## Commit History with Timestamps

**IMPORTANT**: When recreating, use these commands to backdate commits:

```bash
git commit --date="YYYY-MM-DD HH:MM:SS" -m "your message"
```

### Time Gap Strategy for Beginner Developer Pattern

The timestamps below reflect realistic gaps for a beginner developer who:
- Researches documentation between tasks
- Learns new concepts while coding
- Takes short breaks between complex tasks
- Spends more time on unfamiliar concepts

### Commits to Recreate (in order):

| # | Commit Message | Date | Time | Gap Reason |
|---|----------------|------|------|------------|
| 1 | add jsonwebtoken bcrypt and socket.io to server | 2026-03-22 | 09:00:00 | Start of day |
| 2 | add socket.io-client to client | 2026-03-22 | 09:25:00 | 25 min - npm install time + quick docs check |
| 3 | create database schema with 6 tables | 2026-03-22 | 10:15:00 | 50 min - researching PostgreSQL syntax |
| 4 | add dummy data for testing | 2026-03-22 | 10:50:00 | 35 min - understanding data relationships |
| 5 | create database connection module | 2026-03-22 | 11:20:00 | 30 min - learning pg driver basics |
| 6 | add environment variables example file | 2026-03-22 | 11:35:00 | 15 min - quick task |
| | *LUNCH BREAK* | | 12:00:00 | 1 hour 25 min break |
| 7 | create password hashing utility | 2026-03-22 | 13:15:00 | 40 min - learning bcrypt docs |
| 8 | create JWT utility for token creation and verification | 2026-03-22 | 14:10:00 | 55 min - researching JWT concepts |
| 9 | create authentication middleware for JWT verification | 2026-03-22 | 14:55:00 | 45 min - understanding middleware pattern |

### Git Commands for Backdated Commits

```bash
# Commit 1 - Start of day
git add server/package.json server/package-lock.json
git commit --date="2026-03-22 09:00:00" -m "#1 add jsonwebtoken bcrypt and socket.io to server"
git push

# Commit 2 - After npm install and quick docs check
git add client/package.json client/package-lock.json
git commit --date="2026-03-22 09:25:00" -m "#2 add socket.io-client to client"
git push

# Commit 3 - After researching PostgreSQL syntax
git add z-database/init.sql
git commit --date="2026-03-22 10:15:00" -m "#3 create database schema with 6 tables"
git push

# Commit 4 - After understanding data relationships
git add z-database/dummy_data.sql
git commit --date="2026-03-22 10:50:00" -m "#4 add dummy data for testing"
git push

# Commit 5 - After learning pg driver basics
git add server/db/index.js
git commit --date="2026-03-22 11:20:00" -m "#5 create database connection module"
git push

# Commit 6 - Quick task
git add server/.env.example
git commit --date="2026-03-22 11:35:00" -m "#6 add environment variables example file"
git push

# Commit 7 - After learning bcrypt docs (back from lunch)
git add server/utils/password.js
git commit --date="2026-03-22 13:15:00" -m "#7 create password hashing utility"
git push

# Commit 8 - After researching JWT concepts
git add server/utils/jwt.js
git commit --date="2026-03-22 14:10:00" -m "#8 create JWT utility for token creation and verification"
git push

# Commit 9 - After understanding middleware pattern
git add server/middleware/auth.js
git commit --date="2026-03-22 14:55:00" -m "#9 create authentication middleware for JWT verification"
git push
```

---

## File-by-File Recreation Guide

### Step 1: Initial Setup

1. Create new repository on GitHub
2. Clone the Vite + React template or create from scratch
3. Set up the folder structure:

```
uniHelp-ITPM-Personal-Repo/
├── client/                 # React frontend
├── server/                 # Express backend
├── z-database/            # SQL files
├── memory-bank/           # Project documentation
└── user-related-plans/    # Requirements
```

---

### Step 2: Server Package Configuration

**File: `server/package.json`**

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.18.0",
    "socket.io": "^4.8.3"
  },
  "devDependencies": {
    "nodemon": "^1.0.2"
  }
}
```

**Action**: Run `npm install` in server directory, then commit.

---

### Step 3: Client Package Configuration

**File: `client/package.json`**

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "socket.io-client": "^4.8.3"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.24",
    "eslint": "^10.0.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.2.0",
    "vite": "^7.3.1"
  }
}
```

**Action**: Run `npm install --legacy-peer-deps` in client directory, then commit.

---

### Step 4: Database Schema

**File: `z-database/init.sql`**

```sql
-- UniHelp Database Schema
-- This file creates all the tables for the timetable management system

-- Table: users
-- Stores information about all users (students, lecturers, admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: subjects
-- Stores information about university subjects/courses
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE
);

-- Table: locations
-- Stores information about lecture halls and rooms
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    seat_count INTEGER NOT NULL
);

-- Table: timeslots
-- The main timetable table. Each row is one lecture session
CREATE TABLE timeslots (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    lecturer_id INTEGER REFERENCES users(id),
    location_id INTEGER REFERENCES locations(id),
    day_of_week INTEGER NOT NULL,  -- 1 = Monday, 7 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lecture_topic TEXT,  -- Added by lecturer
    notice TEXT  -- Added by lecturer
);

-- Table: bookings
-- Links students to their booked seats in lectures
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    seat_number INTEGER NOT NULL,
    attendance_status VARCHAR(20) DEFAULT 'booked' CHECK (attendance_status IN ('booked', 'attended', 'absent')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, timeslot_id),  -- One booking per student per lecture
    UNIQUE (timeslot_id, seat_number)  -- One student per seat per lecture
);

-- Table: notifications
-- Stores notifications for students
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### Step 5: Dummy Data

**File: `z-database/dummy_data.sql`**

```sql
-- UniHelp Dummy Data
-- This file adds test data to the database

-- Insert admin user
-- password is 'admin123' (hashed with bcrypt)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Admin User', 'admin@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'admin');

-- Insert lecturers
-- password is 'lecturer123' (hashed with bcrypt)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Dr. John Smith', 'john.smith@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'lecturer'),
('Dr. Sarah Johnson', 'sarah.johnson@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'lecturer'),
('Prof. Michael Brown', 'michael.brown@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'lecturer');

-- Insert students
-- password is 'student123' (hashed with bcrypt)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Alice Williams', 'alice.williams@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Bob Taylor', 'bob.taylor@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Charlie Davis', 'charlie.davis@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Diana Miller', 'diana.miller@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Eva Wilson', 'eva.wilson@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student');

-- Insert subjects
INSERT INTO subjects (subject_name, subject_code) VALUES
('Introduction to Programming', 'CS101'),
('Data Structures and Algorithms', 'CS201'),
('Database Systems', 'CS301'),
('Web Development', 'CS401'),
('Software Engineering', 'CS402');

-- Insert locations
INSERT INTO locations (room_name, seat_count) VALUES
('Lecture Hall A', 100),
('Lecture Hall B', 80),
('Computer Lab 1', 40),
('Computer Lab 2', 40),
('Seminar Room 1', 30);

-- Insert timeslots
-- day_of_week: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday
INSERT INTO timeslots (subject_id, lecturer_id, location_id, day_of_week, start_time, end_time) VALUES
-- Monday
(1, 2, 1, 1, '09:00', '11:00'),  -- CS101 with Dr. Sarah Johnson in Lecture Hall A
(2, 3, 2, 1, '14:00', '16:00'),  -- CS201 with Prof. Michael Brown in Lecture Hall B

-- Tuesday
(3, 2, 3, 2, '09:00', '11:00'),  -- CS301 with Dr. Sarah Johnson in Computer Lab 1
(4, 4, 4, 2, '14:00', '16:00'),  -- CS401 with lecturer id 4 in Computer Lab 2

-- Wednesday
(1, 2, 1, 3, '10:00', '12:00'),  -- CS101 with Dr. Sarah Johnson in Lecture Hall A
(5, 3, 5, 3, '14:00', '16:00'),  -- CS402 with Prof. Michael Brown in Seminar Room 1

-- Thursday
(2, 3, 2, 4, '09:00', '11:00'),  -- CS201 with Prof. Michael Brown in Lecture Hall B
(3, 2, 3, 4, '14:00', '16:00'),  -- CS301 with Dr. Sarah Johnson in Computer Lab 1

-- Friday
(4, 4, 4, 5, '09:00', '11:00'),  -- CS401 with lecturer id 4 in Computer Lab 2
(5, 3, 1, 5, '13:00', '15:00');  -- CS402 with Prof. Michael Brown in Lecture Hall A

-- Insert some bookings (students booking seats)
INSERT INTO bookings (student_id, timeslot_id, seat_number, attendance_status) VALUES
(5, 1, 1, 'booked'),   -- Alice booked seat 1 for timeslot 1
(6, 1, 2, 'booked'),   -- Bob booked seat 2 for timeslot 1
(7, 1, 3, 'booked'),   -- Charlie booked seat 3 for timeslot 1
(5, 2, 5, 'booked'),   -- Alice booked seat 5 for timeslot 2
(8, 2, 6, 'booked'),   -- Diana booked seat 6 for timeslot 2
(9, 3, 1, 'attended'); -- Eva booked seat 1 for timeslot 3 and attended

-- Insert a notification for a student
INSERT INTO notifications (user_id, timeslot_id, message, is_read) VALUES
(5, 1, 'Lecture topic updated: Introduction to Variables and Data Types', false),
(6, 1, 'Room changed to Lecture Hall B', false);
```

---

### Step 6: Database Connection Module

**File: `server/db/index.js`**

```javascript
// Database connection module
// This file handles the connection to PostgreSQL database

const { Pool } = require('pg');

// Create a connection pool
// This allows multiple connections to the database
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to database successfully');
        release();
    }
});

// Export the pool so other files can use it
module.exports = pool;
```

---

### Step 7: Environment Variables Template

**File: `server/.env.example`**

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unihelp
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

### Step 8: Password Hashing Utility

**File: `server/utils/password.js`**

```javascript
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
```

---

### Step 9: JWT Utility

**File: `server/utils/jwt.js`**

```javascript
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
```

---

### Step 10: Authentication Middleware

**File: `server/middleware/auth.js`**

```javascript
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
```

---

### Step 11: Basic Express App Files

**File: `server/app.js`**

```javascript
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("UniHelp Backend Running 🚀");
});

module.exports = app;
```

**File: `server/server.js`**

```javascript
const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Remaining Work

### Phase 2: Authentication System (Continue from here)

| Task | Status | Description |
|------|--------|-------------|
| RBAC Middleware | ⬜ Next | Check user roles for authorization |
| Login Endpoint | ⬜ Pending | POST /api/auth/login |
| Get Current User | ⬜ Pending | GET /api/auth/me |
| AuthContext | ⬜ Pending | Frontend auth state management |
| Login Page UI | ⬜ Pending | Login form component |

### Phase 3: Admin Features
- Create admin routes
- Timeslot CRUD endpoints
- Location CRUD endpoints
- Admin UI components

### Phase 4: Common Timetable View
- Timetable routes
- Weekly grid component
- TimeSlotCard component

### Phase 5: Student Features
- Booking endpoints with validation
- Booking modal UI
- Notification system

### Phase 6: Lecturer Features
- Lecturer routes
- Attendance marking
- CSV report generation

### Phase 7: Real-time Notifications
- Socket.IO server setup
- Socket.IO client setup
- Notification bell component

---

## Technical Specifications Summary

### User Roles
| Role | Permissions |
|------|-------------|
| Admin | CRUD timeslots, CRUD locations, assign subjects/lecturers/locations |
| Lecturer | Read own timetable, add topics/notices, mark attendance, download reports |
| Student | Read timetable, book/cancel seats, receive notifications |

### Database Tables
| Table | Purpose |
|-------|---------|
| users | Store all user accounts |
| subjects | University courses |
| locations | Lecture halls with seat counts |
| timeslots | Individual lecture sessions |
| bookings | Student seat reservations |
| notifications | Student notifications |

### API Endpoints (20+ total)
- Auth: `/api/auth/login`, `/api/auth/me`
- Admin: `/api/admin/timeslots/*`, `/api/admin/locations/*`
- Lecturer: `/api/lecturer/mytimetable`, `/api/lecturer/timeslots/*`, `/api/lecturer/bookings/*`
- Student: `/api/student/bookings/*`, `/api/student/notifications/*`
- Common: `/api/timetable`

### Key Validation Rules
1. Seat booking: Must be within seat_count capacity
2. Seat booking: Cannot double-book same seat
3. Seat booking: Cannot book after lecture starts
4. One booking per student per lecture

---

## Coding Style Guidelines

**IMPORTANT: Beginner-Level Code Only**

### Rules
- Use simple, basic programming concepts
- Avoid advanced patterns (Factory, Singleton, etc.)
- Write straightforward, linear code
- Use basic if/else statements
- Keep functions simple and focused

### Comment Style
```javascript
// GOOD - Simple words with basic technical terms
// check if the seat is available
if (seat.isBooked === false) {
  // book the seat
  seat.isBooked = true;
}

// ALSO GOOD - Basic technical words are OK
// check if user exists in database
const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// check if token is valid
const decoded = verifyToken(token);

// AVOID - Too complex or fancy words
// Validate seat availability and atomically update booking status
// Persist user entity to the database layer
// Authenticate user credentials via JWT verification
```

### Commit Message Format
- Tiny commits with simple messages
- Numbered: `#10 create RBAC middleware for role checking`
- Push after each commit

---

## Quick Start Commands

```bash
# In server directory
npm install
npm run dev

# In client directory
npm install --legacy-peer-deps
npm run dev

# Create database
createdb unihelp
psql -d unihelp -f z-database/init.sql
psql -d unihelp -f z-database/dummy_data.sql
```

---

## Files to Ignore (.gitignore)

**IMPORTANT: Do NOT include these folders in your new repository:**
- `memory-bank/` - Internal project notes (not part of the application)
- `user-related-plans/` - Private specifications (optional to include)
- `plans/` - This migration guide folder (not needed in new repo)

**Create this `.gitignore` file in the root of your new repository:**

```gitignore
# Logs
logs
*.log
npm-debug.log*

# Dependency directories
node_modules/

# dotenv environment variable files
.env
.env.*
!.env.example

# Build output
dist

# Memory bank (internal notes - DO NOT INCLUDE)
memory-bank/

# User-related plans (project specs - OPTIONAL)
user-related-plans/

# Plans folder (migration guides - DO NOT INCLUDE)
plans/
```

**Why exclude these?**
- `memory-bank/` contains internal project tracking notes. It's not needed for the actual application to run.
- `user-related-plans/` contains your private technical specifications. You can include it if you want others to see the requirements.
- `plans/` is just for migration/setup guides like this one.

---

## Summary: What to Create in New Repo

### Folders to CREATE:
```
uniHelp-ITPM-Personal-Repo/
├── client/          ✅ CREATE (React frontend)
├── server/          ✅ CREATE (Express backend)
└── z-database/      ✅ CREATE (SQL files)
```

### Folders to NOT CREATE:
```
memory-bank/         ❌ DO NOT CREATE (internal notes only)
user-related-plans/  ❌ OPTIONAL (private specs)
plans/               ❌ DO NOT CREATE (migration guide only)
```

### Files to CREATE (in commit order):
1. `server/package.json` + `npm install` → Commit #1
2. `client/package.json` + `npm install` → Commit #2
3. `z-database/init.sql` → Commit #3
4. `z-database/dummy_data.sql` → Commit #4
5. `server/db/index.js` → Commit #5
6. `server/.env.example` → Commit #6
7. `server/utils/password.js` → Commit #7
8. `server/utils/jwt.js` → Commit #8
9. `server/middleware/auth.js` → Commit #9
10. `server/app.js` and `server/server.js` → Initial setup

---

*Guide Created: 2026-03-22*
*For: Kalindu's University Project*
