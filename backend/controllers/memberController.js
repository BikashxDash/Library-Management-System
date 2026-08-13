// Ye file members se related saara logic rakhti hai

const pool = require('../config/db');

// Function 1: Saare members ki list bhejo
const getAllMembers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching members:', error.message);
    res.status(500).json({ error: 'Server error, could not fetch members' });
  }
};

// Function 2: Naya member add karo
const addMember = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const result = await pool.query(
      `INSERT INTO members (name, email, phone)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding member:', error.message);
    res.status(500).json({ error: 'Server error, could not add member' });
  }
};

// Function 3: Member ki details update karo
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, is_active } = req.body;

    const result = await pool.query(
      `UPDATE members
       SET name = $1, email = $2, phone = $3, is_active = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, phone, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating member:', error.message);
    res.status(500).json({ error: 'Server error, could not update member' });
  }
};

// Function 4: Member delete karo
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM members WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json({ message: 'Member deleted successfully', deletedMember: result.rows[0] });
  } catch (error) {
    console.error('Error deleting member:', error.message);
    res.status(500).json({ error: 'Server error, could not delete member' });
  }
};

module.exports = { getAllMembers, addMember, updateMember, deleteMember };