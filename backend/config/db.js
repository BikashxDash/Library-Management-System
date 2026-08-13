// Ye file PostgreSQL database se connection banane ke liye hai

const { Pool } = require('pg');       // 'pg' package se Pool le rahe hain
require('dotenv').config();           // .env file ki values load kar rahe hain

// Pool ek group hota hai connections ka
// Har request pe naya connection banane se better hai pool use karna
const pool = new Pool({
  user: process.env.DB_USER,          // .env se username
  host: process.env.DB_HOST,          // .env se host
  database: process.env.DB_NAME,      // .env se database naam
  password: process.env.DB_PASSWORD,  // .env se password
  port: process.env.DB_PORT,          // .env se port
});

// Test karte hain ki connection ho paaya ya nahi
pool.connect((err) => {
  if (err) {
    console.error('Database connection FAILED:', err.message);
  } else {
    console.log('PostgreSQL connected successfully');
  }
});

// Ye pool export kar rahe hain taaki dusri files me bhi use kar sake
module.exports = pool;