// Ye script pehla Admin account create karta hai (ek baar chalana hai)
// Admin credentials .env file se read hote hain:
//   SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD

const pool = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createFirstAdmin = async () => {
  try {
    // .env se credentials lo; agar nahi mile to sensible defaults
    const name  = process.env.SEED_ADMIN_NAME     || 'Admin';
    const email = process.env.SEED_ADMIN_EMAIL     || 'admin@example.com';
    const plainPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const role   = 'admin';
    const status = 'approved';

    // Check karo pehle se admin exist to nahi karta
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Admin already exists with this email:', email);
      process.exit(0);
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status',
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
