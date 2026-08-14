// Ye file fines se related logic rakhti hai

const pool = require('../config/db');

// Function 1: Saare fines ki list bhejo (member naam ke saath)
const getAllFines = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.id, f.amount, f.days_late, f.status, f.created_at,
              m.name AS member_name, m.email AS member_email
       FROM fines f
       JOIN members m ON f.member_id = m.id
       ORDER BY f.created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching fines:', error.message);
    res.status(500).json({ error: 'Server error, could not fetch fines' });
  }
};

// Function 2: Fine ko "paid" mark karo
const payFine = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE fines SET status = 'paid' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    res.status(200).json({ message: 'Fine marked as paid', fine: result.rows[0] });
  } catch (error) {
    console.error('Error updating fine:', error.message);
    res.status(500).json({ error: 'Server error, could not update fine' });
  }
};

module.exports = { getAllFines, payFine };