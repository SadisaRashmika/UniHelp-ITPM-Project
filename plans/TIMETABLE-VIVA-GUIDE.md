# UniHelp Timetable Module - VIVA Help Guide

## Overview
The Timetable module is a comprehensive seat booking and lecture management system built for UniHelp. It supports three user roles: **Student**, **Lecturer**, and **Admin**, each with distinct features and capabilities.

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@unihelp.com | admin123 |
| Lecturer | sarath.gunasekara@unihelp.com | lecturer123 |
| Student | kavindu.perera@student.unihelp.com | student123 |

---

## Features by Role

### 1. STUDENT FEATURES

#### 1.1 View Weekly Timetable
- **Location**: Student Dashboard → "My Timetable" tab
- **Description**: Students can view all scheduled lectures in a weekly grid format
- **Details Shown**:
  - Subject name and code (e.g., IT2120 - Probability and Statistics)
  - Lecturer name
  - Room/Location
  - Time slot
  - Available seats

#### 1.2 Book a Seat
- **Location**: Click on any lecture in the timetable
- **Process**:
  1. Click on a lecture slot
  2. Booking modal opens showing seat map
  3. Green seats = Available, Red seats = Booked
  4. Select an available seat
  5. Click "Confirm Booking"
- **Validation**:
  - Cannot book the same lecture twice
  - Cannot book an already taken seat
  - Seat number must be valid (1 to room capacity)

#### 1.3 View My Bookings
- **Location**: Below the timetable grid
- **Details Shown**:
  - Subject name
  - Day and time
  - Room name
  - Seat number
  - Attendance status (Booked/Attended/Absent)

#### 1.4 Cancel Booking
- **Location**: "Cancel" button next to each booking
- **Condition**: Only bookings with status "booked" can be cancelled
- **Process**: Click "Cancel" → Booking is removed

#### 1.5 View Lecture Details
- **Information Available**:
  - Lecture topic (if set by lecturer)
  - Special notices (if any)
  - Attendance status

---

### 2. LECTURER FEATURES

#### 2.1 View Assigned Lectures Only
- **Location**: Lecturer Dashboard → "My Timetable" tab
- **Description**: Lecturers see ONLY their assigned lectures (filtered by lecturer_id)
- **Benefit**: No clutter from other lecturers' sessions

#### 2.2 Add/Update Lecture Topics
- **Location**: Click on a lecture → "Edit Topic & Notice" button
- **Process**:
  1. Click on your lecture slot
  2. Click "Edit Topic & Notice"
  3. Enter lecture topic (e.g., "Introduction to Neural Networks")
  4. Enter any special notice (e.g., "Bring laptops for practical session")
  5. Click "Save"
- **Visibility**: Students see these topics when viewing the timetable

#### 2.3 View Student Bookings
- **Location**: Click on any lecture → "View Bookings" button
- **Information Shown**:
  - List of students who booked
  - Seat numbers
  - Attendance status
- **Use Case**: See how many students registered for the lecture

#### 2.4 Mark Attendance
- **Location**: In the bookings view → "Mark Attendance" button
- **Process**:
  1. View bookings for a lecture
  2. Click "Mark Attendance"
  3. For each student, select:
     - ✅ Attended (green)
     - ❌ Absent (red)
     - ⏳ Pending (amber)
  4. Changes are saved immediately
- **Validation**: Can only mark attendance for own lectures

#### 2.5 Statistics Dashboard
- **Visible Stats**:
  - Total lectures assigned
  - Total bookings across all lectures
  - Hours per week

---

### 3. ADMIN FEATURES

#### 3.1 View All Timeslots
- **Location**: Admin Dashboard → "Timetable Management" tab
- **Description**: See all scheduled lectures across all lecturers and rooms

#### 3.2 Add New Timeslot
- **Location**: "Add Timeslot" button
- **Required Fields**:
  - Subject (dropdown)
  - Lecturer (dropdown)
  - Location/Room (dropdown)
  - Day of week (Monday-Friday)
  - Start time
  - End time
- **Validation**:
  - Checks for room conflicts
  - Prevents double-booking a room at the same time

#### 3.3 Edit Timeslot
- **Location**: Click "Edit" on any timeslot
- **Editable Fields**:
  - Subject
  - Lecturer
  - Location
  - Day
  - Time

#### 3.4 Delete Timeslot
- **Location**: Click "Delete" on any timeslot
- **Process**:
  1. Click delete button
  2. Confirmation dialog
  3. Timeslot and associated bookings are removed
- **Warning**: All student bookings for this timeslot will be deleted

#### 3.5 Manage Subjects
- **Location**: Admin routes (API endpoint available)
- **Capabilities**:
  - Add new subjects
  - Subject code and name required

#### 3.6 Manage Locations
- **Location**: Admin routes (API endpoint available)
- **Capabilities**:
  - Add new rooms/locations
  - Specify room name and seat capacity

---

## Technical Architecture

### Backend (Node.js + Express)

#### Key Files:
| File | Purpose |
|------|---------|
| `server/routes/timetable.js` | Timetable CRUD endpoints |
| `server/routes/bookings.js` | Booking and attendance endpoints |
| `server/routes/admin.js` | Admin-only management endpoints |
| `server/db/mock/index.js` | Mock database (no PostgreSQL needed) |
| `server/middleware/auth.js` | JWT authentication |
| `server/middleware/rbac.js` | Role-based access control |

#### API Endpoints:

**Timetable Routes:**
- `GET /api/timetable/timeslots` - Get all timeslots
- `GET /api/timetable/timeslots/:id` - Get single timeslot
- `GET /api/timetable/subjects` - Get all subjects
- `GET /api/timetable/locations` - Get all locations
- `PUT /api/timetable/timeslots/:id/details` - Update topic/notice (lecturer only)

**Booking Routes:**
- `GET /api/bookings/my` - Get student's bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/timeslot/:timeslotId` - Get bookings for a timeslot
- `PUT /api/bookings/:id/attendance` - Mark attendance (lecturer only)

**Admin Routes:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/lecturers` - Get all lecturers
- `POST /api/admin/timeslots` - Create timeslot
- `PUT /api/admin/timeslots/:id` - Update timeslot
- `DELETE /api/admin/timeslots/:id` - Delete timeslot
- `POST /api/admin/subjects` - Create subject
- `POST /api/admin/locations` - Create location

### Frontend (React)

#### Key Components:
| Component | Purpose |
|-----------|---------|
| `LecturerTimetableContent.jsx` | Lecturer timetable view with edit/attendance |
| `StudentTimetableContent.jsx` | Student timetable with booking |
| `AdminTimetableContent.jsx` | Admin management interface |
| `TimetableGrid.jsx` | Weekly grid display component |
| `BookingModal.jsx` | Seat selection modal |

---

## Database Schema (Mock)

### Tables:
1. **users** - User accounts (admin, lecturer, student)
2. **subjects** - Course subjects (IT2120, SE2010, etc.)
3. **locations** - Rooms with seat capacity
4. **timeslots** - Scheduled lectures
5. **bookings** - Student seat bookings
6. **notifications** - User notifications

### Sample Data:
- 3 Lecturers with Sri Lankan names
- 5 Students
- 8 Subjects (UoM module codes)
- 5 Locations
- 15 Timeslots across Monday-Friday
- 6 Sample bookings

---

## How to Run

### Start Backend:
```bash
cd server
npm install
npm start
```
Server runs on: http://localhost:5000

### Start Frontend:
```bash
cd client
npm install
npm run dev
```
Client runs on: http://localhost:5173

---

## Key Points for VIVA Demo

1. **Role-Based Access Control**
   - Students can only book and view their own bookings
   - Lecturers can only edit their own lectures
   - Admin has full CRUD access

2. **Data Filtering**
   - Lecturers see only their assigned lectures
   - Students see all lectures but can only book once per lecture

3. **Real-time Updates**
   - Seat availability updates immediately
   - Attendance status reflects instantly

4. **Conflict Prevention**
   - Cannot double-book a seat
   - Cannot book same lecture twice
   - Room conflicts detected for admin

5. **Mock Database**
   - No PostgreSQL installation required
   - Data persists in memory during session
   - Resets on server restart

---

## UML Diagram Reference

### Use Case Summary:
- **Student**: View Timetable, Book Seat, Cancel Booking, View Attendance
- **Lecturer**: View Own Lectures, Update Topic/Notice, View Bookings, Mark Attendance
- **Admin**: CRUD Timeslots, Manage Subjects, Manage Locations, View Statistics

---

## Questions You Might Be Asked

**Q: How does the lecturer filtering work?**
A: The frontend filters timeslots by `lecturer_id` matching the logged-in user's ID.

**Q: How are seat conflicts prevented?**
A: The backend checks if a seat is already booked before allowing a new booking.

**Q: What happens when a timeslot is deleted?**
A: All associated bookings are cascade deleted first, then the timeslot is removed.

**Q: How is authentication handled?**
A: JWT tokens are used. The token contains userId, email, and role. Middleware verifies each request.

**Q: Can a student book multiple lectures at the same time?**
A: Currently yes, but this can be restricted by adding time conflict detection.

---

Good luck with your VIVA! 🎓
