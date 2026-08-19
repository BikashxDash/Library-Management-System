// Ye file fines se related URLs define karti hai

const express = require('express');
const router = express.Router();

const { getAllFines, payFine } = require('../controllers/fineController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllFines);       // Sirf logged-in admin dekh sakta hai
router.put('/pay/:id', protect, payFine);    // Sirf logged-in admin fine paid mark kar sakta hai

module.exports = router;