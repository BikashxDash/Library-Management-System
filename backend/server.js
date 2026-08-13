// Ye backend ka main entry point hai - server yahi se start hota hai

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// DB connection file ko import kar rahe hain
// (isse pool.connect() run ho jayega aur DB connect hoga)
require('./config/db');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Middleware - ye har request ke saath chalta hai
app.use(cors());           // Frontend (alag port pe) se request allow karega
app.use(express.json());   // Incoming JSON data ko samajhne ke liye

// Ek test route - check karne ke liye ki server sahi chal raha hai
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running fine' });
});

app.use('/api/books', bookRoutes);

// Server ko start karna
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});