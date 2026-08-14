// Ye file reservations se related logic rakhti hai

const pool = require('../config/db');

// Function 1: Book reserve karo
const createReservation = async (req, res) => {
  try {
    const { book_id, member_id } = req.body;

    // Step A: Check karo book exist karti hai
    const bookCheck = await pool.query('SELECT * FROM books WHERE id = $1', [book_id]);

    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Step B: Sirf tab reserve karne do jab book fully unavailable ho
    // (Agar copies available hain, seedha issue kar sakte ho, reserve karne ki zarurat nahi)
    if (bookCheck.rows[0].available_copies > 0) {
      return res.status(400).json({ error: 'Book is available, no need to reserve. You can issue it directly.' });
    }

    // Step C: Reservation banao
    const result = await pool.query(
      `INSERT INTO reservations (book_id, member_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [book_id, member_id]
    );

    res.status(201).json({
      message: 'Book reserved successfully',
      reservation: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating reservation:', error.message);
    res.status(500).json({ error: 'Server error, could not create reservation' });
  }
};

// Function 2: Reservation cancel karo
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation cancelled', reservation: result.rows[0] });
  } catch (error) {
    console.error('Error cancelling reservation:', error.message);
    res.status(500).json({ error: 'Server error, could not cancel reservation' });
  }
};

// Function 3: Saari reservations ki list bhejo (book aur member details ke saath)
const getAllReservations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.reservation_date, r.status,
              b.title AS book_title,
              m.name AS member_name
       FROM reservations r
       JOIN books b ON r.book_id = b.id
       JOIN members m ON r.member_id = m.id
       ORDER BY r.created_at ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching reservations:', error.message);
    res.status(500).json({ error: 'Server error, could not fetch reservations' });
  }
};

module.exports = { createReservation, cancelReservation, getAllReservations };