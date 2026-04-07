const db = require('../../../config/db'); // Import the database module
const path = require('path');

// Fetch lecturer profile data from the database
const getLecturerProfile = async (employeeId) => {
  const query = `
    SELECT id, name, initials, title, department, points, employee_id, email 
    FROM lecturers 
    WHERE employee_id = $1
  `;
  const result = await db.query(query, [employeeId]);
  return result.rows[0]; // Return the lecturer data if found
};

// Fetch pending submissions and bonus mark requests for the lecturer
const getPendingCounts = async (employeeId) => {
  const submissionsQuery = `
    SELECT COUNT(*) AS submissions 
    FROM student_notes 
    WHERE status = 'pending' AND lecture_id IN 
      (SELECT id FROM lectures WHERE lecturer_id = 
        (SELECT id FROM lecturers WHERE employee_id = $1))
  `;
  const bonusMarksQuery = `
    SELECT COUNT(*) AS bonusMarks 
    FROM bonus_mark_requests 
    WHERE status = 'pending' AND lecturer_id = 
      (SELECT id FROM lecturers WHERE employee_id = $1)
  `;

  const submissionsResult = await db.query(submissionsQuery, [employeeId]);
  const bonusMarksResult = await db.query(bonusMarksQuery, [employeeId]);

  return {
    submissions: parseInt(submissionsResult.rows[0].submissions, 10),
    bonusMarks: parseInt(bonusMarksResult.rows[0].bonusMarks, 10),
  };
};

const getLecturerStats = async (employeeId) => {
  const uploadedQuery = `
    SELECT COUNT(*) AS uploaded_resources
    FROM lectures l
    JOIN lecturers lec ON lec.id = l.lecturer_id
    WHERE lec.employee_id = $1
  `;

  const downloadsQuery = `
    SELECT COALESCE(SUM(sn.likes), 0) AS downloads
    FROM student_notes sn
    JOIN lectures l ON l.id = sn.lecture_id
    JOIN lecturers lec ON lec.id = l.lecturer_id
    WHERE lec.employee_id = $1 AND sn.status = 'accepted'
  `;

  const [uploadedResult, downloadsResult] = await Promise.all([
    db.query(uploadedQuery, [employeeId]),
    db.query(downloadsQuery, [employeeId]),
  ]);

  return {
    uploadedResources: parseInt(uploadedResult.rows[0].uploaded_resources, 10),
    downloads: parseInt(downloadsResult.rows[0].downloads, 10),
  };
};

const getLecturerResources = async (employeeId) => {
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
            )
            ORDER BY qq.order_num
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
      ) AS quiz_questions,
      COALESCE(
        json_agg(
          json_build_object('filename', lf.filename, 'filepath', lf.filepath)
        ) FILTER (WHERE lf.id IS NOT NULL),
        '[]'
      ) AS files
    FROM lectures l
    JOIN lecturers lec ON lec.id = l.lecturer_id
    LEFT JOIN lecture_files lf ON lf.lecture_id = l.id
    WHERE lec.employee_id = $1
    GROUP BY l.id
    ORDER BY l.published_at DESC, l.id DESC
  `;

  const result = await db.query(query, [employeeId]);
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
//---------------------------------------------------------------------------------------------------------------------------------------------

const uploadResource = async (lecturerId, title, subject, topic, year, semester, files, youtubeUrl) => {
  // Insert lecture details into the database, including YouTube URL
  const query = `
    INSERT INTO lectures (lecturer_id, title, subject, topic, year, semester, youtube_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  const result = await db.query(query, [lecturerId, title, subject, topic, year, semester, youtubeUrl]);

  // Insert file details (if provided) into lecture_files
  const lectureId = result.rows[0].id;
  if (Array.isArray(files) && files.length > 0) {
    const fileQuery = `
      INSERT INTO lecture_files (lecture_id, filename, filepath)
      VALUES ($1, $2, $3)
    `;

    for (const file of files) {
      const filePath = path.join('uploads/notes', file.filename);
      await db.query(fileQuery, [lectureId, file.originalname, filePath]);
    }
  }

  return lectureId; // Return the ID of the newly created lecture
};


// Create a quiz for a specific lecture
const createQuiz = async (lectureId, title, questions) => {
  const quizQuery = `
    INSERT INTO quizzes (lecture_id, title)
    VALUES ($1, $2)
    RETURNING id
  `;
  const quizResult = await db.query(quizQuery, [lectureId, title]);
  const quizId = quizResult.rows[0].id;

  // Insert the quiz questions into the database
  for (const question of questions) {
    const { questionText, options, answerIndex, orderNum } = question;
    const questionQuery = `
      INSERT INTO quiz_questions (quiz_id, question, options, answer_index, order_num)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(questionQuery, [quizId, questionText, JSON.stringify(options), answerIndex, orderNum]);
  }

  return quizId; // Return the quiz ID
};

const getStudentSubmissions = async (employeeId) => {
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
      s.name AS student_name,
      s.initials AS student_initials,
      s.student_id,
      s.profile_image_url AS student_profile_image_url,
      s.rank AS student_rank,
      COALESCE(SUM(CASE WHEN sn2.status = 'accepted' THEN sn2.likes ELSE 0 END), 0)::INT AS student_likes,
      l.subject
    FROM student_notes sn
    JOIN lectures l ON l.id = sn.lecture_id
    JOIN lecturers lec ON lec.id = l.lecturer_id
    JOIN students s ON s.id = sn.student_id
    LEFT JOIN student_notes sn2 ON sn2.student_id = s.id AND sn2.status = 'accepted'
    WHERE lec.employee_id = $1
    GROUP BY sn.id, sn.title, sn.filename, sn.filepath, sn.filesize, sn.status, sn.rejection_note, sn.uploaded_at, s.name, s.initials, s.student_id, s.profile_image_url, s.rank, l.subject
    ORDER BY sn.uploaded_at DESC, sn.id DESC
  `;

  const result = await db.query(query, [employeeId]);
  return result.rows.map((row) => ({
    ...row,
    file_url: `/${String(row.filepath || '').replace(/\\/g, '/')}`,
  }));
};

const reviewStudentSubmission = async (employeeId, noteId, action, rejectionNote) => {
  const normalizedAction = action === 'accepted' ? 'accepted' : 'rejected';
  const pointsToAdd = normalizedAction === 'accepted' ? 10 : 5;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const noteResult = await client.query(
      `
      UPDATE student_notes sn
      SET
        status = $1,
        rejection_note = $2
      FROM lectures l, lecturers lec
      WHERE sn.id = $3
        AND sn.lecture_id = l.id
        AND l.lecturer_id = lec.id
        AND lec.employee_id = $4
      RETURNING sn.id, sn.status
      `,
      [normalizedAction, normalizedAction === 'rejected' ? (rejectionNote || null) : null, noteId, employeeId]
    );

    if (!noteResult.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    const pointsResult = await client.query(
      `
      UPDATE lecturers
      SET points = points + $1
      WHERE employee_id = $2
      RETURNING points
      `,
      [pointsToAdd, employeeId]
    );

    await client.query('COMMIT');
    return {
      status: noteResult.rows[0].status,
      addedPoints: pointsToAdd,
      lecturerPoints: pointsResult.rows[0]?.points ?? null,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteLecturerResource = async (employeeId, lectureId) => {
  const query = `
    DELETE FROM lectures
    WHERE id = $1
      AND lecturer_id = (
        SELECT id FROM lecturers WHERE employee_id = $2
      )
    RETURNING id
  `;

  const result = await db.query(query, [lectureId, employeeId]);
  return result.rows[0] || null;
};

const updateLecturerResource = async (employeeId, lectureId, payload) => {
  const {
    title,
    subject,
    topic,
    year,
    semester,
    youtubeUrl,
    files = [],
    addQuiz = false,
    quizTitle = '',
    questions = [],
  } = payload;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const updateLectureResult = await client.query(
      `
      UPDATE lectures
      SET
        title = $1,
        subject = $2,
        topic = $3,
        year = $4,
        semester = $5,
        youtube_url = $6
      WHERE id = $7
        AND lecturer_id = (
          SELECT id FROM lecturers WHERE employee_id = $8
        )
      RETURNING id
      `,
      [title, subject, topic, year, semester, youtubeUrl, lectureId, employeeId]
    );

    if (!updateLectureResult.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    if (Array.isArray(files) && files.length > 0) {
      const fileQuery = `
        INSERT INTO lecture_files (lecture_id, filename, filepath)
        VALUES ($1, $2, $3)
      `;

      for (const file of files) {
        const filePath = path.join('uploads/notes', file.filename);
        await client.query(fileQuery, [lectureId, file.originalname, filePath]);
      }
    }

    // Replace quiz configuration based on toggle state from frontend.
    await client.query(
      `
      DELETE FROM quizzes
      WHERE lecture_id = $1
      `,
      [lectureId]
    );

    if (addQuiz) {
      const quizInsertResult = await client.query(
        `
        INSERT INTO quizzes (lecture_id, title)
        VALUES ($1, $2)
        RETURNING id
        `,
        [lectureId, quizTitle]
      );

      const quizId = quizInsertResult.rows[0].id;
      for (const question of questions) {
        const { questionText, options, answerIndex, orderNum } = question;
        await client.query(
          `
          INSERT INTO quiz_questions (quiz_id, question, options, answer_index, order_num)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [quizId, questionText, JSON.stringify(options), answerIndex, orderNum]
        );
      }
    }

    await client.query('COMMIT');
    return updateLectureResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getBonusMarkRequests = async (employeeId) => {
  const query = `
    SELECT
      bmr.id,
      bmr.subject,
      bmr.status,
      bmr.unique_code,
      bmr.marks_added,
      bmr.requested_at,
      bmr.approved_at,
      s.name AS student_name,
      s.initials AS student_initials,
      s.student_id,
      s.profile_image_url AS student_profile_image_url,
      COALESCE((
        SELECT SUM(sn.likes)
        FROM student_notes sn
        WHERE sn.student_id = s.id
          AND sn.status = 'accepted'
      ), 0)::INT AS total_likes
    FROM bonus_mark_requests bmr
    JOIN lecturers lec ON lec.id = bmr.lecturer_id
    JOIN students s ON s.id = bmr.student_id
    WHERE lec.employee_id = $1
    ORDER BY bmr.requested_at DESC, bmr.id DESC
  `;

  const result = await db.query(query, [employeeId]);
  return result.rows;
};

const reviewBonusMarkRequest = async (employeeId, requestId, action) => {
  const normalizedAction = action === 'approved' ? 'approved' : 'rejected';

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const reqResult = await client.query(
      `
      SELECT
        bmr.id,
        bmr.status,
        bmr.subject,
        bmr.student_id,
        s.name AS student_name,
        s.email AS student_email,
        s.student_id AS student_code,
        GREATEST(
          COALESCE((
            SELECT SUM(sn.likes)
            FROM student_notes sn
            WHERE sn.student_id = s.id
              AND sn.status = 'accepted'
          ), 0) - (
            100 * COALESCE((
              SELECT COUNT(*)
              FROM bonus_mark_requests b2
              WHERE b2.student_id = s.id
                AND b2.status = 'approved'
            ), 0)
          ),
          0
        )::INT AS points
      FROM bonus_mark_requests bmr
      JOIN lecturers lec ON lec.id = bmr.lecturer_id
      JOIN students s ON s.id = bmr.student_id
      WHERE bmr.id = $1
        AND lec.employee_id = $2
      FOR UPDATE
      `,
      [requestId, employeeId]
    );

    if (!reqResult.rows[0]) {
      await client.query('ROLLBACK');
      return { error: 'Request not found' };
    }

    const req = reqResult.rows[0];
    if (req.status !== 'pending') {
      await client.query('ROLLBACK');
      return { error: 'Request already reviewed' };
    }

    if (normalizedAction === 'approved') {
      if (Number(req.points || 0) < 100) {
        await client.query('ROLLBACK');
        return { error: 'Student does not have enough points' };
      }

      const alreadyClaimedResult = await client.query(
        `
        SELECT id
        FROM bonus_mark_requests
        WHERE student_id = $1
          AND subject = $2
          AND status = 'approved'
          AND id <> $3
        LIMIT 1
        `,
        [req.student_id, req.subject, requestId]
      );

      if (alreadyClaimedResult.rows[0]) {
        await client.query('ROLLBACK');
        return { error: 'Bonus marks already claimed for this subject' };
      }

      const subCode = String(req.subject || '').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 4) || 'SUBJ';
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      const studentSuffix = String(req.student_code || '').slice(-4) || '0001';
      const uniqueCode = `BONUS-2026-${studentSuffix}-${subCode}-${rand}`;

      await client.query(
        `
        UPDATE bonus_mark_requests
        SET status = 'approved', unique_code = $1, approved_at = NOW()
        WHERE id = $2
        `,
        [uniqueCode, requestId]
      );

      await client.query('COMMIT');
      return {
        status: 'approved',
        uniqueCode,
        subject: req.subject,
        studentName: req.student_name,
        studentEmail: req.student_email,
      };
    }

    await client.query(
      `
      UPDATE bonus_mark_requests
      SET status = 'rejected'
      WHERE id = $1
      `,
      [requestId]
    );

    await client.query('COMMIT');
    return {
      status: 'rejected',
      subject: req.subject,
      studentName: req.student_name,
      studentEmail: req.student_email,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const markBonusAdded = async (employeeId, requestId) => {
  const query = `
    UPDATE bonus_mark_requests bmr
    SET marks_added = TRUE
    FROM lecturers lec
    WHERE bmr.id = $1
      AND bmr.lecturer_id = lec.id
      AND lec.employee_id = $2
      AND bmr.status = 'approved'
    RETURNING bmr.id
  `;

  const result = await db.query(query, [requestId, employeeId]);
  return result.rows[0] || null;
};


module.exports = {
  getLecturerProfile,
  getPendingCounts,
  getLecturerStats,
  getLecturerResources,
  uploadResource,
  createQuiz,
  deleteLecturerResource,
  updateLecturerResource,
  getStudentSubmissions,
  reviewStudentSubmission,
  getBonusMarkRequests,
  reviewBonusMarkRequest,
  markBonusAdded,
};