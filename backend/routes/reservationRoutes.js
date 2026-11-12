// Ye file reservations se related URLs define karti hai

const express = require('express');
const router = express.Router();

const { createReservation, cancelReservation, getAllReservations } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllReservations);             // Protected: Admin sees all, member sees own
router.post('/', protect, createReservation);             // Protected: Reserve an unavailable book
router.put('/cancel/:id', protect, cancelReservation);     // Protected: Admin or own reservation

module.exports = router;
