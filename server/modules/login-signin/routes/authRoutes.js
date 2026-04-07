const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const authController = require('../controllers/authController');
const { requireAuth } = require('../../../middleware/auth');

const router = express.Router();

const profileImageDir = path.join(__dirname, '../../../uploads/profile-images');
fs.mkdirSync(profileImageDir, { recursive: true });

const profileImageStorage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, profileImageDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
		const safeRole = String(req.auth?.role || 'user').replace(/[^a-z0-9_-]/gi, '');
		const safeId = String(req.auth?.idNumber || 'unknown').replace(/[^a-z0-9_-]/gi, '');
		cb(null, `${safeRole}-${safeId}-${Date.now()}${ext}`);
	},
});

const profileImageUpload = multer({
	storage: profileImageStorage,
	limits: { fileSize: 2 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (!String(file.mimetype || '').startsWith('image/')) {
			cb(new Error('Only image files are allowed'));
			return;
		}
		cb(null, true);
	},
});

router.post('/activate/request', authController.requestActivationOtp);
router.post('/activate/verify', authController.verifyActivationOtpAndSetPassword);
router.post('/login', authController.login);
router.post('/forgot/request', authController.requestForgotPasswordOtp);
router.post('/forgot/verify', authController.verifyForgotPasswordOtpAndReset);

router.get('/me', requireAuth, authController.getCurrentUser);
router.patch('/me', requireAuth, authController.updateCurrentUserProfile);
router.post('/me/profile-image', requireAuth, profileImageUpload.single('image'), authController.uploadCurrentUserProfileImage);
router.delete('/me/profile-image', requireAuth, authController.removeCurrentUserProfileImage);

module.exports = router;
