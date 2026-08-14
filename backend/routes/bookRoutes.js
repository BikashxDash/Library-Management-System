const express = require('express');
const router = express.Router();

const { getAllBooks, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');   // NAYI LINE

router.get('/', getAllBooks);                  // Sab dekh sakte hain, login zaroori nahi
router.post('/', protect, addBook);             // Sirf logged-in user add kar sakta hai
router.put('/:id', protect, updateBook);        // Sirf logged-in user update kar sakta hai
router.delete('/:id', protect, deleteBook);     // Sirf logged-in user delete kar sakta hai

module.exports = router;