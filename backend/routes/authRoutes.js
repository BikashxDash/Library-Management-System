const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getPendingUsers, approveUser, rejectUser } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only routes
router.get('/pending-users', protect, isAdmin, getPendingUsers);
router.put('/approve/:id', protect, isAdmin, approveUser);
router.put('/reject/:id', protect, isAdmin, rejectUser);

module.exports = router;