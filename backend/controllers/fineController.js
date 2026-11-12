// Ye file fines se related logic rakhti hai

const pool = require('../config/db');

// Function 1: Fines ki list bhejo (Admin sees all, members see only their own)
const getAllFines = async (req, res, next) => {
  try {
    let query = `
      SELECT f.id, f.amount, f.days_late, f.status, f.created_at, f.transaction_id, f.member_id,
             m.name AS member_name, m.email AS member_email,
             b.title AS book_title
      FROM fines f
      JOIN members m ON f.member_id = m.id
      LEFT JOIN transactions t ON f.transaction_id = t.id
      LEFT JOIN books b ON t.book_id = b.id
    `;
    const params = [];

    // Member sees only their own fines
    if (req.user.role !== 'admin') {
      if (!req.user.member_id) {
        return res.status(200).json([]);
      }
      query += ` WHERE f.member_id = $1`;
      params.push(req.user.member_id);
    }

    query += ' ORDER BY f.created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Function 2: Fine ko "paid" mark karo (Admin only, with DB transaction)
const payFine = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const check = await client.query(
      'SELECT id, status FROM fines WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (check.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Fine not found' });
    }

    if (check.rows[0].status === 'paid') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Fine is already marked as paid' });
    }

    const result = await client.query(
      `UPDATE fines SET status = 'paid' WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');

    res.status(200).json({ message: 'Fine marked as paid', fine: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

module.exports = { getAllFines, payFine };
