// Ye file reservations se related logic rakhti hai

const pool = require('../config/db');

// Function 1: Book reserve karo (with DB transaction & book row lock)
const createReservation = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { book_id } = req.body;
    // Admin can specify member_id; member uses their own linked member_id
    const member_id = req.user.role === 'admin' && req.body.member_id
      ? req.body.member_id
      : req.user.member_id;

    if (!book_id) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    if (!member_id) {
      return res.status(400).json({ error: 'Member record not found for this user' });
    }

    await client.query('BEGIN');

    // Step A: Lock book row and check availability
    const bookCheck = await client.query(
      'SELECT id, title, available_copies FROM books WHERE id = $1 FOR UPDATE',
      [book_id]
    );

    if (bookCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Book not found' });
    }

    // Sirf tab reserve karne do jab book fully unavailable ho
    if (bookCheck.rows[0].available_copies > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Book is available, no need to reserve. You can issue it directly.',
      });
    }

    // Step B: Check agar is member ne pehle se is book ko reserve kar rakha hai
    const existing = await client.query(
      `SELECT id FROM reservations
       WHERE book_id = $1 AND member_id = $2 AND status = 'pending'`,
      [book_id, member_id]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You already have an active reservation for this book' });
    }

    // Step C: Reservation banao
    const result = await client.query(
      `INSERT INTO reservations (book_id, member_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [book_id, member_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Book reserved successfully',
      reservation: result.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Function 2: Reservation cancel karo (Admin ya apna reservation)
const cancelReservation = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const check = await client.query(
      'SELECT * FROM reservations WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (check.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const reservation = check.rows[0];

    // Non-admin can only cancel their own reservation
    if (req.user.role !== 'admin' && reservation.member_id !== req.user.member_id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied. You can only cancel your own reservation.' });
    }

    if (reservation.status === 'cancelled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Reservation is already cancelled' });
    }

    if (reservation.status === 'fulfilled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot cancel a reservation that has already been fulfilled' });
    }

    const result = await client.query(
      `UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');

    res.status(200).json({ message: 'Reservation cancelled', reservation: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Function 3: Reservations list bhejo (Admin sees all, members see only their own)
const getAllReservations = async (req, res, next) => {
  try {
    let query = `
      SELECT r.id, r.book_id, r.member_id, r.reservation_date, r.status, r.created_at,
             b.title AS book_title, b.author AS book_author,
             m.name AS member_name, m.email AS member_email
      FROM reservations r
      JOIN books b ON r.book_id = b.id
      JOIN members m ON r.member_id = m.id
    `;
    const params = [];

    // Agar user admin nahi hai, to sirf unke member_id ki reservations dikhao
    if (req.user.role !== 'admin') {
      if (!req.user.member_id) {
        return res.status(200).json([]);
      }
      query += ` WHERE r.member_id = $1`;
      params.push(req.user.member_id);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation, cancelReservation, getAllReservations };
