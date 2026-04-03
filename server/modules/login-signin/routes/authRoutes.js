const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../../../middleware/auth');

const router = express.Router();

router.post('/activate/request', authController.requestActivationOtp);
router.post('/activate/verify', authController.verifyActivationOtpAndSetPassword);
router.post('/login', authController.login);
router.post('/forgot/request', authController.requestForgotPasswordOtp);
router.post('/forgot/verify', authController.verifyForgotPasswordOtpAndReset);

router.get('/me', requireAuth, authController.getCurrentUser);
router.patch('/me', requireAuth, authController.updateCurrentUserProfile);

module.exports = router;
