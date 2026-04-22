const db = require('../../../config/db');

const submitFeedback = async (student_id, lecturer_id, subject, rating, comment) => {
    const query = `
        WITH resolved_ids AS (
            SELECT
                COALESCE(
                    (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END),
                    (SELECT id FROM students WHERE student_id = $1::text)
                ) AS resolved_student_id,
                COALESCE(
                    (CASE WHEN $2 ~ '^[0-9]+$' THEN $2::integer ELSE NULL END),
                    (SELECT id FROM lecturers WHERE employee_id = $2::text)
                ) AS resolved_lecturer_id
        )
        INSERT INTO feedbacks (student_id, lecturer_id, subject, rating, comment)
        SELECT resolved_student_id, resolved_lecturer_id, $3, $4, $5
        FROM resolved_ids
        WHERE resolved_student_id IS NOT NULL AND resolved_lecturer_id IS NOT NULL
        RETURNING *
    `;
    const result = await db.query(query, [String(student_id), String(lecturer_id), subject, rating, comment]);
    if (!result.rows[0]) {
        const error = new Error('Invalid student or lecturer identifier');
        error.statusCode = 400;
        throw error;
    }
    return result.rows[0];
};

const getStudentFeedback = async (studentId) => {
    const query = `
        SELECT f.*, l.name as lecturer_name, s.name as student_name
        FROM feedbacks f
        JOIN lecturers l ON f.lecturer_id = l.id
        JOIN students s ON f.student_id = s.id
        WHERE s.student_id = $1 OR s.id = (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END)
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
};

const getLecturerFeedback = async (lecturerId) => {
    const query = `
        SELECT f.*, l.name as lecturer_name, s.name as student_name
        FROM feedbacks f
        JOIN lecturers l ON f.lecturer_id = l.id
        JOIN students s ON f.student_id = s.id
        WHERE l.employee_id = $1 OR l.id = (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END)
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query, [lecturerId]);
    return result.rows;
};

const getAllFeedback = async () => {
    const query = `
        SELECT f.*, l.name as lecturer_name, s.name as student_name, s.student_id as student_reg_id
        FROM feedbacks f
        JOIN lecturers l ON f.lecturer_id = l.id
        JOIN students s ON f.student_id = s.id
        ORDER BY f.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getLecturerModules = async (lecturerId) => {
    const query = `
        SELECT DISTINCT lec.subject
        FROM lectures lec
        WHERE lec.subject IS NOT NULL
          AND lec.subject <> ''
          AND (
              lec.lecturer_id = (CASE WHEN $1 ~ '^[0-9]+$' THEN $1::integer ELSE NULL END)
              OR lec.lecturer_id IN (
                  SELECT id FROM lecturers WHERE employee_id = $1::text
              )
          )
        ORDER BY lec.subject
    `;
    const result = await db.query(query, [lecturerId]);
    return result.rows.map((row) => row.subject);
};

const updateFeedback = async (id, rating, comment) => {
    const query = 'UPDATE feedbacks SET rating = $1, comment = $2 WHERE id = $3 RETURNING *';
    const result = await db.query(query, [rating, comment, id]);
    return result.rows[0];
};

const deleteFeedback = async (id) => {
    const query = 'DELETE FROM feedbacks WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    submitFeedback,
    getStudentFeedback,
    getLecturerFeedback,
    getAllFeedback,
    getLecturerModules,
    updateFeedback,
    deleteFeedback
};
