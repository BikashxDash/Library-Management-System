// Ye file reservations se related URLs define karti hai

const express = require('express');
const router = express.Router();

const { createReservation, cancelReservation, getAllReservations } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllReservations);              // Dekhna open
router.post('/', protect, createReservation);      // Protected
router.put('/cancel/:id', protect, cancelReservation);  // Protected

module.exports = router;