const db = require('../../../config/db'); // Import the database module
const path = require('path');

// Fetch student profile data from the database
const getStudentProfile = async (studentId) => {
  const query = `
    SELECT
      s.id,
      s.name,
      s.initials,
      s.student_id,
      s.email,
      s.year,
      s.semester,
      COALESCE(SUM(CASE WHEN sn.status = 'accepted' THEN sn.likes ELSE 0 END), 0)::INT AS full_likes,
      GREATEST(
        COALESCE(SUM(CASE WHEN sn.status = 'accepted' THEN sn.likes ELSE 0 END), 0)
        - (
          100 * COALESCE((
            SELECT COUNT(*)
            FROM bonus_mark_requests bmr
            WHERE bmr.student_id = s.id
              AND bmr.status = 'approved'
          ), 0)
        ),
        0
      )::INT AS points,
      s.rank
    FROM students s
    LEFT JOIN student_notes sn ON sn.student_id = s.id
    WHERE s.student_id = $1
    GROUP BY s.id, s.name, s.initials, s.student_id, s.email, s.year, s.semester, s.rank
  `;
  const result = await db.query(query, [studentId]);  // Query by student_id (string)
  return result.rows[0]; // Return the student data if found
};

const getLectureResources = async () => {
  const query = `
    SELECT
      l.id,
      l.title,
      l.subject,
      l.topic,
      l.year,
      l.semester,
      l.youtube_url,
      l.published_at,
      lec.name AS lecturer_name,
      lec.email AS lecturer_email,
      COALESCE(
        json_agg(
          json_build_object(
            'filename', lf.filename,
            'filepath', lf.filepath,
            'url', '/' || replace(lf.filepath, E'\\\\', '/')
          )
        ) FILTER (WHERE lf.id IS NOT NULL),
        '[]'::json
      ) AS files,
      (
        SELECT q.title
        FROM quizzes q
        WHERE q.lecture_id = l.id
        ORDER BY q.id DESC
        LIMIT 1
      ) AS quiz_title,
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'question', qq.question,
              'options', qq.options,
              'answer', qq.answer_index,
              'orderNum', qq.order_num
            ) ORDER BY qq.order_num
          ),
          '[]'::json
        )
        FROM quiz_questions qq
        WHERE qq.quiz_id = (
          SELECT q2.id
          FROM quizzes q2
          WHERE q2.lecture_id = l.id
          ORDER BY q2.id DESC
          LIMIT 1
        )
      ) AS quiz_questions
    FROM lectures l
    LEFT JOIN lecturers lec ON lec.id = l.lecturer_id
    LEFT JOIN lecture_files lf ON lf.lecture_id = l.id
    GROUP BY l.id, lec.name, lec.email
    ORDER BY l.published_at DESC, l.id DESC
  `;

  const result = await db.query(query);
  return result.rows.map((row) => ({
    ...row,
    quiz: row.quiz_title
      ? {
          title: row.quiz_title,
          questions: row.quiz_questions || [],
        }
      : null,
  }));
};

const uploadStudentNote = async (studentId, lectureId, title, shortNote, file) => {
  const studentQuery = `
    SELECT id
    FROM students
    WHERE student_id = $1
  `;
  const studentResult = await db.query(studentQuery, [studentId]);
  if (!studentResult.rows[0]) return null;

  const studentDbId = studentResult.rows[0].id;
  const filePath = path.join('uploads/notes', file.filename).replace(/\\/g, '/');
  const fileSizeKb = Math.max(1, Math.round(file.size / 1024));

  const query = `
    INSERT INTO student_notes (
      student_id, lecture_id, title, filename, filepath, filesize, status, rejection_note
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
    RETURNING id
  `;

  const result = await db.query(query, [
    studentDbId,
    lectureId,
    title,
    file.originalname,
    filePath,
    `${fileSizeKb} KB`,
    shortNote || null,
  ]);

  return result.rows[0]?.id || null;
};

const getMyUploads = async (studentId) => {
  const query = `
    SELECT
      sn.id,
      sn.title,
      sn.filename,
      sn.filepath,
      sn.filesize,
      sn.status,
      sn.rejection_note,
      sn.uploaded_at,
      l.title AS lecture_title,
      l.subject,
      l.year,
      l.semester,
      lec.name AS lecturer_name
    FROM student_notes sn
    JOIN students s ON s.id = sn.student_id
    JOIN lectures l ON l.id = sn.lecture_id
    LEFT JOIN lecturers lec ON lec.id = l.lecturer_id
    WHERE s.student_id = $1
    ORDER BY sn.uploaded_at DESC, sn.id DESC
  `;

  const result = await db.query(query, [studentId]);
  return result.rows.map((row) => ({
    ...row,
    file_url: `/${String(row.filepath || '').replace(/\\/g, '/')}`,
  }));
};

const getAcceptedStudentNotes = async () => {
  const query = `
    SELECT
      sn.id,
      sn.title,
      sn.lecture_id,
      sn.filename,
      sn.filepath,
      sn.likes,
      sn.uploaded_at,
      s.id AS owner_student_db_id,
      s.student_id AS owner_student_id,
      s.name AS uploader,
      l.subject,
      l.topic,
      l.year,
      l.semester
    FROM student_notes sn
    JOIN students s ON s.id = sn.student_id
    JOIN lectures l ON l.id = sn.lecture_id
    WHERE sn.status = 'accepted'
    ORDER BY sn.likes DESC, sn.uploaded_at DESC
  `;

  const result = await db.query(query);
  return result.rows.map((row) => ({
    ...row,
    file_url: `/${String(row.filepath || '').replace(/\\/g, '/')}`,
  }));
};

const likeStudentNote = async (noteId, likerStudentId) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const likerResult = await client.query(
      'SELECT id FROM students WHERE student_id = $1',
      [likerStudentId]
    );
    if (!likerResult.rows[0]) {
      await client.query('ROLLBACK');
      return { error: 'Student not found' };
    }

    const likerDbId = likerResult.rows[0].id;
    const noteResult = await client.query(
      `
      UPDATE student_notes
      SET likes = likes + 1
      WHERE id = $1
        AND student_id <> $2
        AND status = 'accepted'
      RETURNING id, student_id, likes
      `,
      [noteId, likerDbId]
    );

    if (!noteResult.rows[0]) {
      await client.query('ROLLBACK');
      return { error: 'Note not found or cannot like own note' };
    }

    const ownerDbId = noteResult.rows[0].student_id;
    await client.query(
      'UPDATE students SET likes = likes + 1 WHERE id = $1',
      [ownerDbId]
    );

    await client.query('COMMIT');
    return { likes: noteResult.rows[0].likes };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const createBonusMarkRequest = async (studentId, subject, lecturerEmail) => {
  const studentResult = await db.query(
    `
    SELECT
      s.id,
      GREATEST(
        COALESCE(SUM(CASE WHEN sn.status = 'accepted' THEN sn.likes ELSE 0 END), 0)
        - (
          100 * COALESCE((
            SELECT COUNT(*)
            FROM bonus_mark_requests bmr
            WHERE bmr.student_id = s.id
              AND bmr.status = 'approved'
          ), 0)
        ),
        0
      )::INT AS points
    FROM students s
    LEFT JOIN student_notes sn ON sn.student_id = s.id
    WHERE s.student_id = $1
    GROUP BY s.id
    `,
    [studentId]
  );
  if (!studentResult.rows[0]) return { error: 'Student not found' };

  const student = studentResult.rows[0];
  if (Number(student.points || 0) < 100) return { error: 'You need at least 100 points' };

  const approvedForSubject = await db.query(
    `
    SELECT id
    FROM bonus_mark_requests
    WHERE student_id = $1
      AND subject = $2
      AND status = 'approved'
    LIMIT 1
    `,
    [student.id, subject]
  );
  if (approvedForSubject.rows[0]) {
    return { error: 'Bonus marks already claimed for this subject' };
  }

  const lecturerResult = await db.query(
    'SELECT id FROM lecturers WHERE email = $1',
    [lecturerEmail]
  );
  if (!lecturerResult.rows[0]) return { error: 'Lecturer email not found' };

  const lecturerId = lecturerResult.rows[0].id;

  const pendingCheck = await db.query(
    `
    SELECT id
    FROM bonus_mark_requests
    WHERE student_id = $1
      AND subject = $2
      AND status = 'pending'
    LIMIT 1
    `,
    [student.id, subject]
  );
  if (pendingCheck.rows[0]) return { error: 'A pending request already exists for this subject' };

  const insertResult = await db.query(
    `
    INSERT INTO bonus_mark_requests (student_id, lecturer_id, subject, status)
    VALUES ($1, $2, $3, 'pending')
    RETURNING id
    `,
    [student.id, lecturerId, subject]
  );

  return { id: insertResult.rows[0].id };
};

const deleteAcceptedUpload = async (studentId, noteId) => {
  const query = `
    DELETE FROM student_notes sn
    USING students s
    WHERE sn.id = $1
      AND s.student_id = $2
      AND sn.student_id = s.id
      AND sn.status = 'accepted'
    RETURNING sn.id
  `;

  const result = await db.query(query, [noteId, studentId]);
  return result.rows[0] || null;
};

module.exports = {
  getStudentProfile,
  getLectureResources,
  uploadStudentNote,
  getMyUploads,
  getAcceptedStudentNotes,
  likeStudentNote,
  createBonusMarkRequest,
  deleteAcceptedUpload,
};