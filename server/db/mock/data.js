// In-memory data store with dummy data
// This mimics the PostgreSQL database tables

const bcrypt = require('bcrypt');

// We'll generate real hashes at runtime
let passwordHashes = {};

// Initialize data store - use a single object that gets mutated
const data = {
    users: [],
    subjects: [],
    locations: [],
    timeslots: [],
    bookings: [],
    notifications: []
};

// ID counters for auto-increment
const idCounters = {
    users: 0,
    subjects: 0,
    locations: 0,
    timeslots: 0,
    bookings: 0,
    notifications: 0
};

// Initialize with dummy data
async function initializeData() {
    // Generate real password hashes
    passwordHashes.admin = await bcrypt.hash('admin123', 10);
    passwordHashes.lecturer = await bcrypt.hash('lecturer123', 10);
    passwordHashes.student = await bcrypt.hash('student123', 10);

    // Clear existing data (mutate instead of replacing)
    data.users.length = 0;
    data.subjects.length = 0;
    data.locations.length = 0;
    data.timeslots.length = 0;
    data.bookings.length = 0;
    data.notifications.length = 0;

    // Reset counters
    idCounters.users = 0;
    idCounters.subjects = 0;
    idCounters.locations = 0;
    idCounters.timeslots = 0;
    idCounters.bookings = 0;
    idCounters.notifications = 0;

    // Insert admin user
    insertUser('Bandula Jayawardena', 'admin@unihelp.com', passwordHashes.admin, 'admin');

    // Insert lecturers
    insertUser('Dr. Sarath Gunasekara', 'sarath.gunasekara@unihelp.com', passwordHashes.lecturer, 'lecturer');
    insertUser('Prof. Chaminda Wijesinghe', 'chaminda.wijesinghe@unihelp.com', passwordHashes.lecturer, 'lecturer');
    insertUser('Lakmi Siriwardena', 'lakmi.siriwardena@unihelp.com', passwordHashes.lecturer, 'lecturer');

    // Insert students
    insertUser('Kavindu Perera', 'kavindu.perera@student.unihelp.com', passwordHashes.student, 'student');
    insertUser('Dilini Senanayake', 'dilini.senanayake@student.unihelp.com', passwordHashes.student, 'student');
    insertUser('Pathum Dhananjaya', 'pathum.dhananjaya@student.unihelp.com', passwordHashes.student, 'student');
    insertUser('Tharushi Fernando', 'tharushi.fernando@student.unihelp.com', passwordHashes.student, 'student');
    insertUser('Isuru Herath', 'isuru.herath@student.unihelp.com', passwordHashes.student, 'student');

    // Insert subjects with real module codes
    insertSubject('Probability and Statistics', 'IT2120');
    insertSubject('Object Oriented Programming', 'SE2010');
    insertSubject('Operating Systems & System Administration', 'IT2130');
    insertSubject('Database Design and Development', 'IT2140');
    insertSubject('Artificial Intelligence & Machine Learning', 'IT2011');
    insertSubject('IT Project', 'IT2150');
    insertSubject('Web and Mobile Technologies', 'SE2020');
    insertSubject('Professional Skills', 'IT2160');

    // Insert locations
    insertLocation('Lecture Hall A', 100);
    insertLocation('Lecture Hall B', 80);
    insertLocation('Computer Lab 1', 40);
    insertLocation('Computer Lab 2', 40);
    insertLocation('Seminar Room 1', 30);

    // Insert timeslots
    // day_of_week: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday
    // Subject IDs: 1=IT2120, 2=SE2010, 3=IT2130, 4=IT2140, 5=IT2011, 6=IT2150, 7=SE2020, 8=IT2160
    // Lecturer IDs: 2=Dr. Sarath Gunasekara, 3=Prof. Chaminda Wijesinghe, 4=Lakmi Siriwardena
    // Location IDs: 1=Lecture Hall A (100), 2=Lecture Hall B (80), 3=Computer Lab 1 (40), 4=Computer Lab 2 (40), 5=Seminar Room 1 (30)
    
    // Monday
    insertTimeslot(1, 2, 1, 1, '08:00', '10:00', 'Probability and Statistics - Introduction');  // IT2120 with Dr. Sarath in Lecture Hall A
    insertTimeslot(2, 3, 3, 1, '10:00', '12:00', 'OOP - Inheritance and Polymorphism');  // SE2010 with Prof. Chaminda in Computer Lab 1
    insertTimeslot(7, 4, 4, 1, '14:00', '16:00', 'Web Technologies - React Basics');  // SE2020 with Lakmi in Computer Lab 2

    // Tuesday
    insertTimeslot(3, 2, 2, 2, '09:00', '11:00', 'Operating Systems - Process Management');  // IT2130 with Dr. Sarath in Lecture Hall B
    insertTimeslot(4, 3, 3, 2, '11:00', '13:00', 'Database Design - Normalization');  // IT2140 with Prof. Chaminda in Computer Lab 1
    insertTimeslot(8, 4, 5, 2, '14:00', '16:00', 'Professional Skills - Report Writing');  // IT2160 with Lakmi in Seminar Room 1

    // Wednesday
    insertTimeslot(1, 2, 1, 3, '08:00', '10:00', 'Probability - Conditional Probability');  // IT2120 with Dr. Sarath in Lecture Hall A
    insertTimeslot(5, 3, 2, 3, '10:00', '12:00', 'AI/ML - Neural Networks Introduction');  // IT2011 with Prof. Chaminda in Lecture Hall B
    insertTimeslot(6, 4, 3, 3, '14:00', '16:00', 'IT Project - Sprint Planning');  // IT2150 with Lakmi in Computer Lab 1

    // Thursday
    insertTimeslot(2, 2, 3, 4, '09:00', '11:00', 'OOP - Design Patterns');  // SE2010 with Dr. Sarath in Computer Lab 1
    insertTimeslot(3, 3, 2, 4, '11:00', '13:00', 'Operating Systems - Memory Management');  // IT2130 with Prof. Chaminda in Lecture Hall B
    insertTimeslot(7, 4, 4, 4, '14:00', '16:00', 'Web Technologies - Backend Development');  // SE2020 with Lakmi in Computer Lab 2

    // Friday
    insertTimeslot(4, 2, 1, 5, '08:00', '10:00', 'Database Design - SQL Queries');  // IT2140 with Dr. Sarath in Lecture Hall A
    insertTimeslot(5, 3, 5, 5, '10:00', '12:00', 'AI/ML - Supervised Learning');  // IT2011 with Prof. Chaminda in Seminar Room 1
    insertTimeslot(6, 4, 1, 5, '13:00', '15:00', 'IT Project - Final Presentation Prep');  // IT2150 with Lakmi in Lecture Hall A

    // Insert bookings (students booking seats)
    // Student IDs: 5=Alice, 6=Bob, 7=Charlie, 8=Diana, 9=Eva
    insertBooking(5, 1, 1, 'booked');   // Alice booked seat 1 for timeslot 1
    insertBooking(6, 1, 2, 'booked');   // Bob booked seat 2 for timeslot 1
    insertBooking(7, 1, 3, 'booked');   // Charlie booked seat 3 for timeslot 1
    insertBooking(5, 2, 5, 'booked');   // Alice booked seat 5 for timeslot 2
    insertBooking(8, 2, 6, 'booked');   // Diana booked seat 6 for timeslot 2
    insertBooking(9, 3, 1, 'attended'); // Eva booked seat 1 for timeslot 3 and attended

    // Insert notifications
    insertNotification(5, 1, 'Lecture topic updated: Introduction to Variables and Data Types', false);
    insertNotification(6, 1, 'Room changed to Lecture Hall B', false);

    return getDataStats();
}

// Helper functions for inserting data
function insertUser(full_name, email, password_hash, role) {
    idCounters.users++;
    const user = {
        id: idCounters.users,
        full_name,
        email,
        password_hash,
        role,
        created_at: new Date()
    };
    data.users.push(user);
    return idCounters.users;
}

function insertSubject(subject_name, subject_code) {
    idCounters.subjects++;
    const subject = {
        id: idCounters.subjects,
        subject_name,
        subject_code
    };
    data.subjects.push(subject);
    return idCounters.subjects;
}

function insertLocation(room_name, seat_count) {
    idCounters.locations++;
    const location = {
        id: idCounters.locations,
        room_name,
        seat_count
    };
    data.locations.push(location);
    return idCounters.locations;
}

function insertTimeslot(subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic = null, notice = null) {
    idCounters.timeslots++;
    const timeslot = {
        id: idCounters.timeslots,
        subject_id,
        lecturer_id,
        location_id,
        day_of_week,
        start_time,
        end_time,
        lecture_topic,
        notice
    };
    data.timeslots.push(timeslot);
    return idCounters.timeslots;
}

function insertBooking(student_id, timeslot_id, seat_number, attendance_status = 'booked') {
    idCounters.bookings++;
    const booking = {
        id: idCounters.bookings,
        student_id,
        timeslot_id,
        seat_number,
        attendance_status,
        created_at: new Date()
    };
    data.bookings.push(booking);
    return idCounters.bookings;
}

function insertNotification(user_id, timeslot_id, message, is_read = false) {
    idCounters.notifications++;
    const notification = {
        id: idCounters.notifications,
        user_id,
        timeslot_id,
        message,
        is_read,
        created_at: new Date()
    };
    data.notifications.push(notification);
    return idCounters.notifications;
}

// Get data statistics
function getDataStats() {
    return {
        users: data.users.length,
        admins: data.users.filter(u => u.role === 'admin').length,
        lecturers: data.users.filter(u => u.role === 'lecturer').length,
        students: data.users.filter(u => u.role === 'student').length,
        subjects: data.subjects.length,
        locations: data.locations.length,
        timeslots: data.timeslots.length,
        bookings: data.bookings.length,
        notifications: data.notifications.length
    };
}

// Export data and functions
module.exports = {
    data,
    idCounters,
    initializeData,
    getDataStats,
    insertUser,
    insertSubject,
    insertLocation,
    insertTimeslot,
    insertBooking,
    insertNotification
};
