// Ye file authentication (register/login) ka logic rakhti hai

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function 1: Naya admin/librarian register karo
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Step A: Check karo email pehle se exist to nahi karti
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Step B: Password ko hash karo (plain text kabhi save nahi karte)
    const salt = await bcrypt.genSalt(10);              // "salt" ek random string hai hashing ko aur secure banane ke liye
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step C: User ko DB me save karo (hashed password ke saath)
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3) RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully',
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

    // Step A: User ko email se dhundo
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Step B: Password match karo (hashed password se compare karta hai bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Step C: Sab sahi hai, ab JWT token banao
    const token = jwt.sign(
      { id: user.id, role: user.role },   // Ye data token ke andar store hoga
      process.env.JWT_SECRET,             // Secret key se sign karte hain
      { expiresIn: '7d' }                 // Token 7 din tak valid rahega
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

module.exports = { registerUser, loginUser };