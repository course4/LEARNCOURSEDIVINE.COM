const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const { requestAdminPasswordReset, approveAdminPasswordReset, ownerInstantPasswordReset } = require('../controllers/adminController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestAdminPasswordReset);
router.post('/approve-password-reset', approveAdminPasswordReset);
router.post('/owner-reset-password', ownerInstantPasswordReset);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
