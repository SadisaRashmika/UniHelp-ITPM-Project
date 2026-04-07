const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const authModel = require('../models/authModel');

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const signAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Set JWT_SECRET in server/.env');
  }

  return jwt.sign(
    {
      userId: `${user.role}:${user.id_number}`,
      role: user.role,
      idNumber: user.id_number,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
};

const sendOtpEmail = async ({ to, fullName, otp, purpose }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email transport is not configured. Set EMAIL_USER and EMAIL_PASS.');
  }

  const subject = purpose === 'ACTIVATE' ? 'UniHelp Account Activation OTP' : 'UniHelp Password Reset OTP';
  const intro =
    purpose === 'ACTIVATE'
      ? 'Use the OTP below to activate your UniHelp account.'
      : 'Use the OTP below to reset your UniHelp password.';

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `
      <p>Hi ${fullName || 'User'},</p>
      <p>${intro}</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:3px;">${otp}</p>
      <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
};

const issueOtpForUser = async ({ user, purpose }) => {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await authModel.createOtp({
    role: user.role,
    idNumber: user.id_number,
    purpose,
    otpHash,
    expiresAt,
    maxAttempts: OTP_MAX_ATTEMPTS,
  });

  await sendOtpEmail({
    to: user.email,
    fullName: user.full_name,
    otp,
    purpose,
  });
};

const sanitizeUser = (user) => ({
  id: user.id,
  idNumber: user.id_number,
  fullName: user.full_name,
  email: user.email,
  role: user.role,
  status: user.status,
  profileImageUrl: user.profile_image_url || null,
});

const deleteStoredProfileImage = (profileImageUrl) => {
  if (!profileImageUrl || !String(profileImageUrl).startsWith('/uploads/profile-images/')) {
    return;
  }

  const relativePath = String(profileImageUrl).replace(/^\//, '');
  const absolutePath = path.join(__dirname, '../../../', relativePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const requestActivationOtp = async (req, res) => {
  try {
    const { idNumber, email } = req.body;

    if (!idNumber || !email) {
      return res.status(400).json({ message: 'idNumber and email are required' });
    }

    const user = await authModel.findPendingUserByIdAndEmail(idNumber.trim(), email.trim());
    if (!user) {
      return res.status(404).json({ message: 'Matching pending account not found' });
    }

    await issueOtpForUser({ user, purpose: 'ACTIVATE' });
    return res.status(200).json({ message: 'OTP sent to your university email' });
  } catch (error) {
    console.error('requestActivationOtp error:', error);
    return res.status(500).json({
      message: 'Failed to send activation OTP',
      detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
};

const verifyActivationOtpAndSetPassword = async (req, res) => {
  try {
    const { idNumber, email, otp, password } = req.body;

    if (!idNumber || !email || !otp || !password) {
      return res.status(400).json({ message: 'idNumber, email, otp and password are required' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await authModel.findPendingUserByIdAndEmail(idNumber.trim(), email.trim());
    if (!user) {
      return res.status(404).json({ message: 'Matching pending account not found' });
    }

    const otpCheck = await authModel.validateOtpOnly({
      role: user.role,
      idNumber: user.id_number,
      purpose: 'ACTIVATE',
      otp: String(otp).trim(),
    });
    if (!otpCheck.ok) {
      return res.status(otpCheck.status).json({ message: otpCheck.message });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    // Generate token BEFORE updating database so DB is only changed on full success
    const token = signAccessToken({ ...user, role: user.role, id_number: user.id_number });

    // Only update DB and consume OTP after token generation succeeds
    const activatedUser = await authModel.activateUserPassword({
      role: user.role,
      idNumber: user.id_number,
      passwordHash,
    });
    await authModel.consumeOtp(otpCheck.otpId);
    return res.status(200).json({
      message: 'Account activated successfully',
      token,
      user: sanitizeUser(activatedUser),
    });
  } catch (error) {
    console.error('verifyActivationOtpAndSetPassword error:', error);
    return res.status(500).json({
      message: 'Activation failed',
      detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, email, idNumber, password } = req.body;
    const loginIdentifier = String(identifier || email || idNumber || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'identifier and password are required' });
    }

    const user = await authModel.findUserByIdentifier(loginIdentifier);
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (String(user.status).toLowerCase() !== 'active') {
      return res.status(403).json({ message: 'Account is not active. Complete activation first.' });
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signAccessToken(user);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

const requestForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }

    const user = await authModel.findUserByEmail(email.trim());
    if (user && String(user.status).toLowerCase() === 'active') {
      await issueOtpForUser({ user, purpose: 'RESET' });
    }

    return res.status(200).json({ message: 'If the account exists, an OTP has been sent' });
  } catch (error) {
    console.error('requestForgotPasswordOtp error:', error);
    return res.status(500).json({ message: 'Failed to process forgot password request' });
  }
};

const verifyForgotPasswordOtpAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'email, otp and newPassword are required' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await authModel.findUserByEmail(email.trim());
    if (!user || String(user.status).toLowerCase() !== 'active') {
      return res.status(404).json({ message: 'Active account not found' });
    }

    const otpCheck = await authModel.validateOtpOnly({
      role: user.role,
      idNumber: user.id_number,
      purpose: 'RESET',
      otp: String(otp).trim(),
    });
    if (!otpCheck.ok) {
      return res.status(otpCheck.status).json({ message: otpCheck.message });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await authModel.updatePasswordByUserId({
      role: user.role,
      idNumber: user.id_number,
      passwordHash,
    });
    // Consume OTP only after password update succeeds
    await authModel.consumeOtp(otpCheck.otpId);

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('verifyForgotPasswordOtpAndReset error:', error);
    return res.status(500).json({
      message: 'Password reset failed',
      detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await authModel.findUserByRoleAndIdNumber({
      role: req.auth.role,
      idNumber: req.auth.idNumber,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const updateCurrentUserProfile = async (req, res) => {
  try {
    const { fullName, currentPassword, newPassword } = req.body;

    const user = await authModel.findUserByRoleAndIdNumber({
      role: req.auth.role,
      idNumber: req.auth.idNumber,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'currentPassword is required to set a new password' });
      }
      const currentOk = await bcrypt.compare(currentPassword, user.password_hash || '');
      if (!currentOk) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      if (String(newPassword).length < 8) {
        return res.status(400).json({ message: 'newPassword must be at least 8 characters' });
      }
      const passwordHash = await bcrypt.hash(newPassword, 12);
      await authModel.updatePasswordByUserId({
        role: req.auth.role,
        idNumber: req.auth.idNumber,
        passwordHash,
      });
    }

    const updated = await authModel.updateProfileByUserId({
      role: req.auth.role,
      idNumber: req.auth.idNumber,
      fullName: fullName ? String(fullName).trim() : null,
    });

    return res.status(200).json({
      message: 'Profile updated',
      user: sanitizeUser(updated),
    });
  } catch (error) {
    console.error('updateCurrentUserProfile error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

const uploadCurrentUserProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Profile image file is required' });
    }

    const existing = await authModel.findUserByRoleAndIdNumber({
      role: req.auth.role,
      idNumber: req.auth.idNumber,
    });
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profileImageUrl = `/uploads/profile-images/${req.file.filename}`;
    const updated = await authModel.updateProfileImageByUserId({
      role: req.auth.role,
      idNumber: req.auth.idNumber,
      profileImageUrl,
    });

    // Best effort cleanup of previous image.
    try {
      deleteStoredProfileImage(existing.profile_image_url);
    } catch (_cleanupError) {
      // ignore cleanup failures
    }

    return res.status(200).json({
      message: 'Profile image updated',
      user: sanitizeUser(updated),
    });
  } catch (error) {
    console.error('uploadCurrentUserProfileImage error:', error);
    return res.status(500).json({ message: 'Failed to upload profile image' });
  }
};

const removeCurrentUserProfileImage = async (req, res) => {
  try {
    const existing = await authModel.findUserByRoleAndIdNumber({
      role: req.auth.role,
      idNumber: req.auth.idNumber,
    });
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await authModel.updateProfileImageByUserId({
      role: req.auth.role,
      idNumber: req.auth.idNumber,
      profileImageUrl: null,
    });

    try {
      deleteStoredProfileImage(existing.profile_image_url);
    } catch (_cleanupError) {
      // ignore cleanup failures
    }

    return res.status(200).json({
      message: 'Profile image removed',
      user: sanitizeUser(updated),
    });
  } catch (error) {
    console.error('removeCurrentUserProfileImage error:', error);
    return res.status(500).json({ message: 'Failed to remove profile image' });
  }
};

module.exports = {
  requestActivationOtp,
  verifyActivationOtpAndSetPassword,
  login,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtpAndReset,
  getCurrentUser,
  updateCurrentUserProfile,
  uploadCurrentUserProfileImage,
  removeCurrentUserProfileImage,
};
