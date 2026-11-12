// Ye backend ka main entry point hai - server yahi se start hota hai

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security headers (Helmet)
app.use(helmet());

// CORS aur JSON parsing middleware
app.use(cors());
app.use(express.json());

// Rate limiter for authentication routes (/api/auth) - brute force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                  // 50 requests per 15 minutes per IP
  message: { error: 'Too many login/registration attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

// Health check route
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
app.use('/api/dashboard', dashboardRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central Error Handler Middleware
// Har unhandled error ya next(err) yahan aayega
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Unhandled server error:', err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
});

// Server ko start karna (sirf tab jab file directly chal rahi ho, test suite me nahi)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
