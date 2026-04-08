// Quick cleanup script to remove duplicate data from the database
// Run: cd server && node cleanup-db.js

const pool = require('./config/db');

async function cleanup() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Delete duplicate locations (keep only the first 5)
    console.log('Cleaning up duplicate locations...');
    await client.query(`
      DELETE FROM locations a USING locations b
      WHERE a.id > b.id AND a.room_name = b.room_name AND a.seat_count = b.seat_count
    `);
    const locResult = await client.query('SELECT id, room_name, seat_count FROM locations ORDER BY id');
    console.log('Locations after cleanup:');
    locResult.rows.forEach(l => console.log(`   id=${l.id} ${l.room_name} (${l.seat_count} seats)`));

    // Delete duplicate timeslots (keep only the first 10)
    console.log('Cleaning up duplicate timeslots...');
    // First, delete bookings that reference duplicate timeslots
    await client.query(`
      DELETE FROM bookings WHERE timeslot_id IN (
        SELECT a.id FROM timeslots a
        JOIN timeslots b ON a.id > b.id
          AND a.subject_id = b.subject_id
          AND a.lecturer_id = b.lecturer_id
          AND a.location_id = b.location_id
          AND a.day_of_week = b.day_of_week
          AND a.start_time = b.start_time
          AND a.end_time = b.end_time
      )
    `);
    await client.query(`
      DELETE FROM timeslots a USING timeslots b
      WHERE a.id > b.id
        AND a.subject_id = b.subject_id
        AND a.lecturer_id = b.lecturer_id
        AND a.location_id = b.location_id
        AND a.day_of_week = b.day_of_week
        AND a.start_time = b.start_time
        AND a.end_time = b.end_time
    `);
    const tsResult = await client.query('SELECT COUNT(*) as c FROM timeslots');
    console.log(`Timeslots after cleanup: ${tsResult.rows[0].c}`);

    // Delete duplicate notifications
    console.log('Cleaning up duplicate notifications...');
    await client.query(`
      DELETE FROM notifications a USING notifications b
      WHERE a.id > b.id
        AND a.user_id = b.user_id
        AND a.timeslot_id = b.timeslot_id
        AND a.message = b.message
    `);
    const notifResult = await client.query('SELECT COUNT(*) as c FROM notifications');
    console.log(`Notifications after cleanup: ${notifResult.rows[0].c}`);

    // Re-seed bookings (delete all and re-insert)
    console.log('Re-seeding bookings...');
    await client.query('DELETE FROM bookings');
    
    // Get student user IDs
    const stu1 = await client.query("SELECT id FROM users WHERE id_number = 'STU001'");
    const stu2 = await client.query("SELECT id FROM users WHERE id_number = 'STU002'");
    const stu3 = await client.query("SELECT id FROM users WHERE id_number = 'STU003'");
    const stu4 = await client.query("SELECT id FROM users WHERE id_number = 'STU004'");
    const stu5 = await client.query("SELECT id FROM users WHERE id_number = 'STU005'");

    // Get timeslot IDs (ordered by id)
    const tsIdsResult = await client.query('SELECT id FROM timeslots ORDER BY id');
    const tsIds = tsIdsResult.rows.map(r => r.id);

    if (tsIds.length >= 3) {
      await client.query(`
        INSERT INTO bookings (student_id, timeslot_id, seat_number, attendance_status) VALUES
          ($1, $2, 1, 'booked'),
          ($3, $4, 2, 'booked'),
          ($5, $6, 3, 'booked'),
          ($7, $8, 5, 'booked'),
          ($9, $10, 6, 'booked'),
          ($11, $12, 1, 'attended')
      `, [
        stu1.rows[0].id, tsIds[0],
        stu2.rows[0].id, tsIds[0],
        stu3.rows[0].id, tsIds[0],
        stu1.rows[0].id, tsIds[1],
        stu4.rows[0].id, tsIds[1],
        stu5.rows[0].id, tsIds[2],
      ]);
    }

    const bookingsResult = await client.query('SELECT COUNT(*) as c FROM bookings');
    console.log(`✅ Bookings re-seeded: ${bookingsResult.rows[0].c} bookings`);

    // Re-seed notifications
    console.log('Re-seeding notifications...');
    await client.query('DELETE FROM notifications');
    
    if (tsIds.length >= 1) {
      await client.query(`
        INSERT INTO notifications (user_id, timeslot_id, message, is_read) VALUES
          ($1, $2, 'Lecture topic updated: Introduction to Variables and Data Types', false),
          ($3, $4, 'Room changed to Lecture Hall B', false)
      `, [
        stu1.rows[0].id, tsIds[0],
        stu2.rows[0].id, tsIds[0],
      ]);
    }

    const notifResult2 = await client.query('SELECT COUNT(*) as c FROM notifications');
    console.log(`✅ Notifications re-seeded: ${notifResult2.rows[0].c} notifications`);

    await client.query('COMMIT');
    console.log('\n🎉 Cleanup completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Cleanup failed:', error.message);
    console.error(error);
  } finally {
    client.release();
    pool.end();
  }
}

cleanup();
