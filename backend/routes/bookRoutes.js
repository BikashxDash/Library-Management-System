const express = require('express');
const router = express.Router();

const { getAllBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');
const { validateBook } = require('../middleware/validationMiddleware');

router.get('/', getAllBooks);                                 // Sab dekh sakte hain, login zaroori nahi
router.get('/:id', getBookById);                              // Sab dekh sakte hain, login zaroori nahi
router.post('/', protect, validateBook, addBook);             // Sirf logged-in user add kar sakta hai
router.put('/:id', protect, validateBook, updateBook);        // Sirf logged-in user update kar sakta hai
router.delete('/:id', protect, deleteBook);                                                  // Sirf logged-in user delete kar sakta hai

module.exports = router;