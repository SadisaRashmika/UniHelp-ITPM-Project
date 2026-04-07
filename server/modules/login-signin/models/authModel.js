const pool = require('../../../config/db');

const buildAccountSelect = () => `
  SELECT
    l.id,
    l.employee_id AS id_number,
    l.name AS full_name,
    l.email,
    'lecturer' AS role,
    l.status,
    l.password_hash,
    l.profile_image_url
  FROM lecturers l
  UNION ALL
  SELECT
    s.id,
    s.student_id AS id_number,
    s.name AS full_name,
    s.email,
    'student' AS role,
    s.status,
    s.password_hash,
    s.profile_image_url
  FROM students s
`;

const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM (${buildAccountSelect()}) AS accounts
    WHERE LOWER(accounts.email) = LOWER($1)
    LIMIT 1
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

const findUserByIdentifier = async (identifier) => {
  const query = `
    SELECT *
    FROM (${buildAccountSelect()}) AS accounts
    WHERE LOWER(accounts.email) = LOWER($1)
       OR UPPER(accounts.id_number) = UPPER($1)
    LIMIT 1
  `;
  const result = await pool.query(query, [identifier]);
  return result.rows[0] || null;
};

const findPendingUserByIdAndEmail = async (idNumber, email) => {
  const query = `
    SELECT *
    FROM (${buildAccountSelect()}) AS accounts
    WHERE accounts.id_number = $1
      AND LOWER(accounts.email) = LOWER($2)
      AND accounts.status = 'Pending'
    LIMIT 1
  `;
  const result = await pool.query(query, [idNumber, email]);
  return result.rows[0] || null;
};

const findUserByRoleAndIdNumber = async ({ role, idNumber }) => {
  const normalizedRole = String(role || '').toLowerCase();

  if (normalizedRole === 'lecturer') {
    const result = await pool.query(
      `
      SELECT
        id,
        employee_id AS id_number,
        name AS full_name,
        email,
        'lecturer' AS role,
        status,
        password_hash,
        profile_image_url
      FROM lecturers
      WHERE employee_id = $1
      LIMIT 1
      `,
      [idNumber]
    );
    return result.rows[0] || null;
  }

  if (normalizedRole === 'student') {
    const result = await pool.query(
      `
      SELECT
        id,
        student_id AS id_number,
        name AS full_name,
        email,
        'student' AS role,
        status,
        password_hash,
        profile_image_url
      FROM students
      WHERE student_id = $1
      LIMIT 1
      `,
      [idNumber]
    );
    return result.rows[0] || null;
  }

  return null;
};

const createOtp = async ({ role, idNumber, purpose, otpHash, expiresAt, maxAttempts }) => {
  const normalizedRole = String(role || '').toLowerCase();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `
      UPDATE auth_otp_codes
      SET used_at = NOW()
      WHERE role = $1
        AND id_number = $2
        AND purpose = $3
        AND used_at IS NULL
      `,
      [normalizedRole, idNumber, purpose]
    );

    const insertResult = await client.query(
      `
      INSERT INTO auth_otp_codes (role, id_number, purpose, otp_hash, expires_at, max_attempts)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, role, id_number, purpose, expires_at, attempt_count, max_attempts
      `,
      [normalizedRole, idNumber, purpose, otpHash, expiresAt, maxAttempts]
    );

    await client.query('COMMIT');
    return insertResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const findLatestActiveOtp = async ({ role, idNumber, purpose }) => {
  const query = `
    SELECT id, role, id_number, purpose, otp_hash, expires_at, used_at, attempt_count, max_attempts
    FROM auth_otp_codes
    WHERE role = $1
      AND id_number = $2
      AND purpose = $3
      AND used_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [String(role).toLowerCase(), idNumber, purpose]);
  return result.rows[0] || null;
};

const increaseOtpAttempt = async (otpId) => {
  const query = `
    UPDATE auth_otp_codes
    SET attempt_count = attempt_count + 1
    WHERE id = $1
    RETURNING id, attempt_count, max_attempts
  `;
  const result = await pool.query(query, [otpId]);
  return result.rows[0] || null;
};

const consumeOtp = async (otpId) => {
  const query = `
    UPDATE auth_otp_codes
    SET used_at = NOW()
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [otpId]);
  return result.rows[0] || null;
};

const validateOtpOnly = async ({ role, idNumber, purpose, otp }) => {
  const activeOtp = await findLatestActiveOtp({
    role,
    idNumber,
    purpose,
  });

  if (!activeOtp) {
    return { ok: false, status: 400, message: 'OTP not found. Please request a new code.' };
  }

  if (activeOtp.attempt_count >= activeOtp.max_attempts) {
    return { ok: false, status: 400, message: 'Too many failed attempts. Request a new OTP.' };
  }

  if (new Date(activeOtp.expires_at).getTime() < Date.now()) {
    return { ok: false, status: 400, message: 'OTP has expired. Request a new OTP.' };
  }

  const hashOtpFn = (otpStr) => {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(String(otpStr)).digest('hex');
  };
  const incomingHash = hashOtpFn(otp);

  if (incomingHash !== activeOtp.otp_hash) {
    await increaseOtpAttempt(activeOtp.id);
    const attemptInfo = await increaseOtpAttempt(activeOtp.id);
    const remaining = Math.max(0, Number(attemptInfo.max_attempts) - Number(attemptInfo.attempt_count));
    return {
      ok: false,
      status: 400,
      message: remaining > 0 ? `Invalid OTP. ${remaining} attempts left.` : 'Too many failed attempts. Request a new OTP.',
    };
  }

  return { ok: true, otpId: activeOtp.id };
};

const activateUserPassword = async ({ role, idNumber, passwordHash }) => {
  if (role === 'lecturer') {
    await pool.query(
      `
      UPDATE lecturers
      SET password_hash = $2,
          status = 'Active',
          updated_at = NOW()
      WHERE employee_id = $1
      `,
      [idNumber, passwordHash]
    );
  } else {
    await pool.query(
      `
      UPDATE students
      SET password_hash = $2,
          status = 'Active',
          updated_at = NOW()
      WHERE student_id = $1
      `,
      [idNumber, passwordHash]
    );
  }

  return findUserByRoleAndIdNumber({ role, idNumber });
};

const updatePasswordByUserId = async ({ role, idNumber, passwordHash }) => {
  if (role === 'lecturer') {
    await pool.query(
      `
      UPDATE lecturers
      SET password_hash = $2,
          updated_at = NOW()
      WHERE employee_id = $1
      `,
      [idNumber, passwordHash]
    );
  } else {
    await pool.query(
      `
      UPDATE students
      SET password_hash = $2,
          updated_at = NOW()
      WHERE student_id = $1
      `,
      [idNumber, passwordHash]
    );
  }

  return { updated: true };
};

const updateProfileByUserId = async ({ role, idNumber, fullName }) => {
  if (role === 'lecturer') {
    await pool.query(
      `
      UPDATE lecturers
      SET
        name = COALESCE($2, name),
        initials = COALESCE(initials, UPPER(SUBSTRING(COALESCE($2, name) FROM 1 FOR 2))),
        updated_at = NOW()
      WHERE employee_id = $1
      `,
      [idNumber, fullName]
    );
  } else {
    await pool.query(
      `
      UPDATE students
      SET
        name = COALESCE($2, name),
        initials = COALESCE(initials, UPPER(SUBSTRING(COALESCE($2, name) FROM 1 FOR 2))),
        updated_at = NOW()
      WHERE student_id = $1
      `,
      [idNumber, fullName]
    );
  }

  return findUserByRoleAndIdNumber({ role, idNumber });
};

const updateProfileImageByUserId = async ({ role, idNumber, profileImageUrl }) => {
  if (role === 'lecturer') {
    await pool.query(
      `
      UPDATE lecturers
      SET
        profile_image_url = $2,
        updated_at = NOW()
      WHERE employee_id = $1
      `,
      [idNumber, profileImageUrl]
    );
  } else {
    await pool.query(
      `
      UPDATE students
      SET
        profile_image_url = $2,
        updated_at = NOW()
      WHERE student_id = $1
      `,
      [idNumber, profileImageUrl]
    );
  }

  return findUserByRoleAndIdNumber({ role, idNumber });
};

const upsertSeedUser = async ({ idNumber, fullName, email, role }) => {
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'NA';

  if (role === 'lecturer') {
    await pool.query(
      `
      INSERT INTO lecturers (name, initials, employee_id, email, password, password_hash, status)
      VALUES ($1, $2, $3, $4, 'LEGACY_DISABLED', NULL, 'Pending')
      ON CONFLICT (employee_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        status = 'Pending',
        password_hash = NULL,
        updated_at = NOW()
      `,
      [fullName, initials, idNumber, email]
    );
  } else {
    await pool.query(
      `
      INSERT INTO students (name, initials, student_id, email, password, password_hash, status)
      VALUES ($1, $2, $3, $4, 'LEGACY_DISABLED', NULL, 'Pending')
      ON CONFLICT (student_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        status = 'Pending',
        password_hash = NULL,
        updated_at = NOW()
      `,
      [fullName, initials, idNumber, email]
    );
  }

  return findUserByRoleAndIdNumber({ role, idNumber });
};

module.exports = {
  findUserByEmail,
  findUserByIdentifier,
  findPendingUserByIdAndEmail,
  findUserByRoleAndIdNumber,
  createOtp,
  findLatestActiveOtp,
  increaseOtpAttempt,
  consumeOtp,
  validateOtpOnly,
  activateUserPassword,
  updatePasswordByUserId,
  updateProfileByUserId,
  updateProfileImageByUserId,
  upsertSeedUser,
};
