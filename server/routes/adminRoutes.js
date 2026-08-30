const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  requestAdminPasswordReset,
  approveAdminPasswordReset,
  resetAdminPassword
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Password Reset Routes (Public / Custom Auth handled in controller)
router.post('/request-password-reset', requestAdminPasswordReset);
router.post('/approve-password-reset', approveAdminPasswordReset);

// Protected Admin Routes
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/reset-password', resetAdminPassword);
router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
