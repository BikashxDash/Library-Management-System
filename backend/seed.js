// Ye script pehla Admin account create karta hai (ek baar chalana hai)

const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const createFirstAdmin = async () => {
  try {
    const name = 'Admin';
    const email = 'admin@example.com';       // apna email daal dena
    const plainPassword = 'admin123';        // apna strong password daal dena
    const role = 'admin';
    const status = 'approved';

    // Check karo pehle se admin exist to nahi karta
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Admin already exists with this email.');
      process.exit(0);
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, role, status]
    );

    console.log('First Admin created successfully:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createFirstAdmin();