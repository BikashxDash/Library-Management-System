// Ye backend ka main entry point hai - server yahi se start hota hai

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// DB connection file ko import kar rahe hain
require('./config/db');

// Saare routes import kar rahe hain
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const fineRoutes = require('./routes/fineRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running fine' });
});

// Saare routes ko connect kar rahe hain
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/reservations', reservationRoutes);

// Server ko start karna
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});