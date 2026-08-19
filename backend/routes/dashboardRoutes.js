const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDashboardStats);   // Sirf logged-in admin dekh sakta hai

module.exports = router;