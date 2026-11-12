// Ye file fines se related URLs define karti hai

const express = require('express');
const router = express.Router();

const { getAllFines, payFine } = require('../controllers/fineController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, getAllFines);             // Protected: Admin sees all, member sees own fines
router.put('/pay/:id', protect, isAdmin, payFine);  // Admin only: fine ko paid mark karna

module.exports = router;
