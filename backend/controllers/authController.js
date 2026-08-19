// Ye file authentication (register/login) ka logic rakhti hai

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function 1: Naya admin/librarian register karo
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Public register hamesha 'member' role, 'pending' status ke saath banega
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, 'member', 'pending') RETURNING id, name, email, role, status`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Server error, could not register user' });
  }
};

// Function 2: Login karo aur token pao
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Naya check: agar member abhi approved nahi hai to login block karo
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending admin approval' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your registration was rejected. Contact admin.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Server error, could not login' });
  }
};

// Function 3: Sirf Admin dekh sakta hai konse users pending hain approval ke liye
const getPendingUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, status, created_at 
       FROM users WHERE status = 'pending' ORDER BY created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching pending users:', error.message);
    res.status(500).json({ error: 'Server error, could not fetch pending users' });
  }
};

// Function 4: Admin ek user ko approve karta hai
const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users SET status = 'approved' WHERE id = $1 RETURNING id, name, email, role, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User approved successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error approving user:', error.message);
    res.status(500).json({ error: 'Server error, could not approve user' });
  }
};

// Function 5: Admin ek user ko reject karta hai
const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users SET status = 'rejected' WHERE id = $1 RETURNING id, name, email, role, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User rejected', user: result.rows[0] });
  } catch (error) {
    console.error('Error rejecting user:', error.message);
    res.status(500).json({ error: 'Server error, could not reject user' });
  }
};

module.exports = { registerUser, loginUser, getPendingUsers, approveUser, rejectUser };