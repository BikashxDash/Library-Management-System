// Ye file members se related saara logic rakhti hai

const pool = require('../config/db');

// Function 1: Members list bhejo (Admin sees all, members see only themselves)
const getAllMembers = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query('SELECT * FROM members ORDER BY id ASC');
      return res.status(200).json(result.rows);
    }

    // Member sees only their own profile
    if (!req.user.member_id) {
      return res.status(200).json([]);
    }

    const result = await pool.query('SELECT * FROM members WHERE id = $1', [req.user.member_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Function 2: Naya member add karo (Admin only)
const addMember = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Check duplicate email
    const existing = await pool.query('SELECT id FROM members WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Member with this email already exists' });
    }

    const result = await pool.query(
      `INSERT INTO members (name, email, phone)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, phone || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Function 3: Member ki details update karo (Admin only)
const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, is_active } = req.body;

    const result = await pool.query(
      `UPDATE members
       SET name = $1, email = $2, phone = $3, is_active = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, phone, is_active !== undefined ? is_active : true, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Function 4: Member delete karo (Admin only)
const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check agar member ke paas active issued books hain
    const activeTx = await pool.query(
      `SELECT id FROM transactions WHERE member_id = $1 AND status = 'issued'`,
      [id]
    );
    if (activeTx.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete member with active issued books' });
    }

    // Check unpaid fines
    const unpaidFines = await pool.query(
      `SELECT id FROM fines WHERE member_id = $1 AND status = 'unpaid'`,
      [id]
    );
    if (unpaidFines.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete member with unpaid fines' });
    }

    const result = await pool.query(
      'DELETE FROM members WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json({ message: 'Member deleted successfully', deletedMember: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Function 5: Ek specific member ki detail do (Admin ya apna profile)
const getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && Number(id) !== Number(req.user.member_id)) {
      return res.status(403).json({ error: 'Access denied. You can only view your own profile.' });
    }

    const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMembers, getMemberById, addMember, updateMember, deleteMember };
